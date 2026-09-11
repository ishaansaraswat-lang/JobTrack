import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  JobApplication,
  NewJobApplication,
  UpdateJobApplication,
  ApplicationFiltersState,
  ApplicationStats,
  ApplicationStatus,
} from '@/types/application';
import { INITIAL_MOCK_APPLICATIONS, INITIAL_MOCK_EVENTS } from '@/lib/mockData';

const LOCAL_APPS_KEY = 'jobtrack_local_applications';
const LOCAL_EVENTS_KEY = 'jobtrack_local_events';

// Local storage storage helpers for demo mode
function getLocalApplications(): JobApplication[] {
  const data = localStorage.getItem(LOCAL_APPS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(INITIAL_MOCK_APPLICATIONS));
    return INITIAL_MOCK_APPLICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MOCK_APPLICATIONS;
  }
}

function saveLocalApplications(apps: JobApplication[]) {
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(apps));
}

export function useApplications(filters?: Partial<ApplicationFiltersState>) {
  const { user, isDemoUser } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['applications', user?.id, filters],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!user) return [];

      let applications: JobApplication[] = [];

      if (!isSupabaseConfigured || isDemoUser) {
        applications = getLocalApplications();
      } else {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('application_date', { ascending: false });

        if (error) {
          console.error('Error fetching applications from Supabase:', error);
          throw error;
        }
        applications = data || [];
      }

      // Apply client-side filters
      if (filters) {
        if (filters.search && filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          applications = applications.filter(
            (app) =>
              app.company_name.toLowerCase().includes(searchLower) ||
              app.job_title.toLowerCase().includes(searchLower) ||
              (app.location && app.location.toLowerCase().includes(searchLower)) ||
              (app.notes && app.notes.toLowerCase().includes(searchLower))
          );
        }

        if (filters.status && filters.status !== 'All') {
          applications = applications.filter((app) => app.status === filters.status);
        }

        if (filters.jobType && filters.jobType !== 'All') {
          applications = applications.filter((app) => app.job_type === filters.jobType);
        }

        if (filters.sortBy) {
          applications.sort((a, b) => {
            if (filters.sortBy === 'date_desc') {
              return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
            }
            if (filters.sortBy === 'date_asc') {
              return new Date(a.application_date).getTime() - new Date(b.application_date).getTime();
            }
            if (filters.sortBy === 'company') {
              return a.company_name.localeCompare(b.company_name);
            }
            if (filters.sortBy === 'deadline') {
              if (!a.deadline) return 1;
              if (!b.deadline) return -1;
              return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            return 0;
          });
        }
      }

      return applications;
    },
    enabled: Boolean(user),
  });
}

export function useApplication(id: string | undefined) {
  const { user, isDemoUser } = useAuth();

  return useQuery({
    queryKey: ['application', id],
    queryFn: async (): Promise<JobApplication | null> => {
      if (!id || !user) return null;

      if (!isSupabaseConfigured || isDemoUser) {
        const apps = getLocalApplications();
        const found = apps.find((a) => a.id === id);
        return found || null;
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        throw error;
      }

      return data;
    },
    enabled: Boolean(id && user),
  });
}

export function useApplicationStats() {
  const { data: applications = [] } = useApplications();

  const stats: ApplicationStats = {
    total: applications.length,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  applications.forEach((app) => {
    switch (app.status) {
      case 'Applied':
        stats.applied += 1;
        break;
      case 'Screening':
        stats.screening += 1;
        break;
      case 'Interview':
        stats.interview += 1;
        break;
      case 'Offer':
        stats.offer += 1;
        break;
      case 'Rejected':
        stats.rejected += 1;
        break;
      case 'Withdrawn':
        stats.withdrawn += 1;
        break;
    }
  });

  return stats;
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { user, isDemoUser } = useAuth();

  return useMutation({
    mutationFn: async (newApp: Omit<NewJobApplication, 'user_id'>): Promise<JobApplication> => {
      if (!user) throw new Error('You must be logged in to add an application');

      if (!isSupabaseConfigured || isDemoUser) {
        const apps = getLocalApplications();
        const created: JobApplication = {
          id: `app-${Date.now()}`,
          user_id: user.id,
          company_name: newApp.company_name,
          job_title: newApp.job_title,
          job_type: newApp.job_type || 'Full-time',
          location: newApp.location || null,
          salary: newApp.salary || null,
          job_url: newApp.job_url || null,
          application_date: newApp.application_date || new Date().toISOString().split('T')[0],
          deadline: newApp.deadline || null,
          status: newApp.status || 'Applied',
          notes: newApp.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        apps.unshift(created);
        saveLocalApplications(apps);

        // Record initial creation event in local events
        const eventsData = localStorage.getItem(LOCAL_EVENTS_KEY);
        const events = eventsData ? JSON.parse(eventsData) : INITIAL_MOCK_EVENTS;
        events.unshift({
          id: `evt-${Date.now()}`,
          application_id: created.id,
          user_id: user.id,
          event_type: 'APPLICATION_CREATED',
          title: 'Application Submitted',
          description: `Applied for ${created.job_title} at ${created.company_name}`,
          event_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));

        return created;
      }

      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...newApp,
          user_id: user.id,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-events'] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  const { user, isDemoUser } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateJobApplication;
    }): Promise<JobApplication> => {
      if (!user) throw new Error('Not authenticated');

      if (!isSupabaseConfigured || isDemoUser) {
        const apps = getLocalApplications();
        const index = apps.findIndex((a) => a.id === id);
        if (index === -1) throw new Error('Application not found');

        const oldApp = apps[index];
        const updated: JobApplication = {
          ...oldApp,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        apps[index] = updated;
        saveLocalApplications(apps);

        // If status changed, record timeline event
        if (updates.status && updates.status !== oldApp.status) {
          const eventsData = localStorage.getItem(LOCAL_EVENTS_KEY);
          const events = eventsData ? JSON.parse(eventsData) : INITIAL_MOCK_EVENTS;
          events.unshift({
            id: `evt-${Date.now()}`,
            application_id: id,
            user_id: user.id,
            event_type: 'STATUS_CHANGE',
            title: `Status Changed to ${updates.status}`,
            description: `Stage updated from ${oldApp.status} to ${updates.status}`,
            event_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
          localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
        }

        return updated;
      }

      const { data, error } = await (supabase.from('applications') as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['application-events', variables.id] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { isDemoUser } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || isDemoUser) {
        const apps = getLocalApplications();
        const filtered = apps.filter((a) => a.id !== id);
        saveLocalApplications(filtered);
        return id;
      }

      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.removeQueries({ queryKey: ['application', deletedId] });
      queryClient.removeQueries({ queryKey: ['application-events', deletedId] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const updateMutation = useUpdateApplication();

  return {
    updateStatus: (id: string, newStatus: ApplicationStatus) => {
      return updateMutation.mutateAsync({
        id,
        updates: { status: newStatus },
      });
    },
    isPending: updateMutation.isPending,
  };
}

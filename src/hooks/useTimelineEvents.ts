import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ApplicationEvent, NewApplicationEvent } from '@/types/application';
import { INITIAL_MOCK_EVENTS } from '@/lib/mockData';

const LOCAL_EVENTS_KEY = 'jobtrack_local_events';

function getLocalEvents(applicationId: string): ApplicationEvent[] {
  const data = localStorage.getItem(LOCAL_EVENTS_KEY);
  let events: ApplicationEvent[] = [];
  if (!data) {
    events = INITIAL_MOCK_EVENTS;
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } else {
    try {
      events = JSON.parse(data);
    } catch {
      events = INITIAL_MOCK_EVENTS;
    }
  }
  return events.filter((e) => e.application_id === applicationId);
}

export function useTimelineEvents(applicationId: string | undefined) {
  const { user, isDemoUser } = useAuth();

  return useQuery({
    queryKey: ['application-events', applicationId],
    queryFn: async (): Promise<ApplicationEvent[]> => {
      if (!applicationId || !user) return [];

      if (!isSupabaseConfigured || isDemoUser) {
        return getLocalEvents(applicationId);
      }

      const { data, error } = await supabase
        .from('application_events')
        .select('*')
        .eq('application_id', applicationId)
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Error fetching timeline events:', error);
        throw error;
      }

      return data || [];
    },
    enabled: Boolean(applicationId && user),
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  const { user, isDemoUser } = useAuth();

  return useMutation({
    mutationFn: async (
      newEvent: Omit<NewApplicationEvent, 'user_id'>
    ): Promise<ApplicationEvent> => {
      if (!user) throw new Error('Not authenticated');

      if (!isSupabaseConfigured || isDemoUser) {
        const stored = localStorage.getItem(LOCAL_EVENTS_KEY);
        const events: ApplicationEvent[] = stored ? JSON.parse(stored) : INITIAL_MOCK_EVENTS;

        const created: ApplicationEvent = {
          id: `evt-${Date.now()}`,
          application_id: newEvent.application_id,
          user_id: user.id,
          event_type: newEvent.event_type,
          title: newEvent.title,
          description: newEvent.description || null,
          event_date: newEvent.event_date || new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        events.unshift(created);
        localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
        return created;
      }

      const { data, error } = await supabase
        .from('application_events')
        .insert({
          ...newEvent,
          user_id: user.id,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['application-events', data.application_id],
      });
    },
  });
}

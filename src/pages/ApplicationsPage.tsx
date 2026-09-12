import React, { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationFiltersState, JobApplication } from '@/types/application';
import { ApplicationFilters } from '@/components/applications/ApplicationFilters';
import { ApplicationTable } from '@/components/applications/ApplicationTable';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const ApplicationsPage: React.FC = () => {
  const [filters, setFilters] = useState<ApplicationFiltersState>({
    search: '',
    status: 'All',
    jobType: 'All',
    sortBy: 'date_desc',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const { data: applications = [], isLoading } = useApplications(filters);

  const handleOpenAdd = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      jobType: 'All',
      sortBy: 'date_desc',
    });
  };

  return (
    <div className="saas-page">
      {/* Page Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="saas-title text-2xl">
              Job Applications
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {applications.length} {applications.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>
          <p className="saas-subtitle">
            Manage, filter, and track all your active and archived job applications.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-toolbar">
        <ApplicationFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Table Content or Empty States */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={
            filters.search || filters.status !== 'All' || filters.jobType !== 'All'
              ? 'No matching applications'
              : 'No applications yet'
          }
          description={
            filters.search || filters.status !== 'All' || filters.jobType !== 'All'
              ? 'Try changing your search query or resetting filters to see your jobs.'
              : 'Start your pipeline by logging your first job application.'
          }
          actionLabel={
            filters.search || filters.status !== 'All' || filters.jobType !== 'All'
              ? 'Clear Filters'
              : 'Add First Application'
          }
          onAction={
            filters.search || filters.status !== 'All' || filters.jobType !== 'All'
              ? handleResetFilters
              : handleOpenAdd
          }
        />
      ) : (
        <ApplicationTable applications={applications} onEdit={handleEdit} />
      )}

      {/* Add / Edit Modal */}
      <ApplicationFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        application={editingApp}
      />
    </div>
  );
};

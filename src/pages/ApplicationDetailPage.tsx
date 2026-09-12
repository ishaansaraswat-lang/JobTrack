import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplication, useDeleteApplication } from '@/hooks/useApplications';
import { ApplicationHeader } from '@/components/details/ApplicationHeader';
import { ApplicationDetailsCard } from '@/components/details/ApplicationDetailsCard';
import { ApplicationTimeline } from '@/components/details/ApplicationTimeline';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading, error } = useApplication(id);
  const deleteMutation = useDeleteApplication();
  const toast = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!application) return;
    try {
      await deleteMutation.mutateAsync(application.id);
      toast.success('Application deleted');
      navigate('/applications');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete application');
    }
  };

  if (isLoading) {
    return (
      <div className="saas-page">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Application not found"
        description="The job application you are looking for does not exist or has been removed."
        actionLabel="Back to Applications"
        onAction={() => navigate('/applications')}
      />
    );
  }

  return (
    <div className="saas-page">
      {/* Header */}
      <ApplicationHeader
        application={application}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* Grid: Position Overview + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ApplicationDetailsCard application={application} />
        </div>

        <div className="lg:col-span-1">
          <ApplicationTimeline applicationId={application.id} />
        </div>
      </div>

      {/* Edit modal */}
      <ApplicationFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        application={application}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Application"
        description={`Are you sure you want to permanently delete your application for "${application.job_title}" at "${application.company_name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

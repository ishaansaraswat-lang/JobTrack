import React, { useState } from 'react';
import { APPLICATION_STATUSES, ApplicationStatus, JobApplication } from '@/types/application';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';

interface KanbanBoardProps {
  applications: JobApplication[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications }) => {
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('Applied');

  const handleAdd = (status: ApplicationStatus) => {
    setSelectedApp(null);
    setTargetStatus(status);
    setIsModalOpen(true);
  };

  const handleEdit = (app: JobApplication) => {
    setSelectedApp(app);
    setTargetStatus(app.status);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[calc(100vh-14rem)]">
        {APPLICATION_STATUSES.map((status) => {
          const columnApps = applications.filter((app) => app.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              applications={columnApps}
              onAdd={handleAdd}
              onEdit={handleEdit}
            />
          );
        })}
      </div>

      <ApplicationFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        application={selectedApp}
        initialStatus={targetStatus}
      />
    </>
  );
};

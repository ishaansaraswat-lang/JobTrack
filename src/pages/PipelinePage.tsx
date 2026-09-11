import React from 'react';
import { useApplications } from '@/hooks/useApplications';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';

export const PipelinePage: React.FC = () => {
  const { data: applications = [], isLoading } = useApplications();

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Pipeline
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {applications.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visual Kanban board. Move applications across interview stages.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-80 h-96 bg-slate-100/70 rounded-2xl p-4 shrink-0 space-y-3"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard applications={applications} />
      )}
    </div>
  );
};

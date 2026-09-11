import React from 'react';
import { ApplicationStatus, JobApplication } from '@/types/application';
import { STATUS_CONFIG } from '@/lib/constants';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: JobApplication[];
  onAdd: (status: ApplicationStatus) => void;
  onEdit: (app: JobApplication) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  applications,
  onAdd,
  onEdit,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col w-80 shrink-0 bg-slate-100/70 rounded-2xl border border-slate-200 p-3 max-h-[calc(100vh-12rem)] shadow-xs">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1.5 py-1 mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`} />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {config.label}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
            {applications.length}
          </span>
        </div>

        <button
          onClick={() => onAdd(status)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors"
          title={`Add job to ${status}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300/80 p-6 text-center text-slate-400 bg-white/40">
            <p className="text-xs font-medium">No applications</p>
            <button
              onClick={() => onAdd(status)}
              className="mt-2 text-[11px] text-indigo-600 hover:underline font-semibold"
            >
              + Add to {status}
            </button>
          </div>
        ) : (
          applications.map((app) => (
            <KanbanCard key={app.id} application={app} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};

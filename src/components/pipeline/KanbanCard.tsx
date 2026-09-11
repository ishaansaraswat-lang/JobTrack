import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from '@/types/application';
import { formatDate, getDaysRemaining } from '@/lib/formatters';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { useToast } from '@/components/common/Toast';

interface KanbanCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ application, onEdit }) => {
  const { updateStatus, isPending } = useUpdateApplicationStatus();
  const toast = useToast();
  const deadlineInfo = getDaysRemaining(application.deadline);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (newStatus === application.status) return;
    try {
      await updateStatus(application.id, newStatus);
      toast.success(`Moved ${application.company_name} to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const currentIndex = APPLICATION_STATUSES.indexOf(application.status);
  const prevStatus = currentIndex > 0 ? APPLICATION_STATUSES[currentIndex - 1] : null;
  const nextStatus =
    currentIndex < APPLICATION_STATUSES.length - 1
      ? APPLICATION_STATUSES[currentIndex + 1]
      : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col gap-2.5">
      {/* Top Header: Company + Menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to={`/applications/${application.id}`}
            className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate block"
          >
            {application.company_name}
          </Link>
          <p className="text-xs text-slate-600 font-medium truncate">
            {application.job_title}
          </p>
        </div>

        <DropdownMenu
          trigger={
            <button className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          }
        >
          <DropdownMenuItem asChild>
            <Link to={`/applications/${application.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(application)}>
            Edit Application
          </DropdownMenuItem>
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-t border-slate-100">
            Move To Stage:
          </div>
          {APPLICATION_STATUSES.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              className={status === application.status ? 'font-bold text-indigo-600' : ''}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </div>

      {/* Meta tags (location, salary) */}
      <div className="space-y-1 text-[11px] text-slate-500">
        {application.location && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}
        {application.salary && (
          <div className="font-medium text-slate-700 truncate">
            {application.salary}
          </div>
        )}
      </div>

      {/* Deadline badge if available */}
      {deadlineInfo && (
        <div className="pt-1">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              deadlineInfo.isOverdue
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : deadlineInfo.isUrgent
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Clock className="h-3 w-3" />
            {deadlineInfo.text}
          </span>
        </div>
      )}

      {/* Footer with quick next/prev stage buttons */}
      <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{formatDate(application.application_date)}</span>

        <div className="flex items-center gap-1">
          {prevStatus && (
            <button
              onClick={() => handleStatusChange(prevStatus)}
              disabled={isPending}
              title={`Move to ${prevStatus}`}
              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              disabled={isPending}
              title={`Move to ${nextStatus}`}
              className="p-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

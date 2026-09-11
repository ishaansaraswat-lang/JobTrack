import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JobApplication, ApplicationStatus, APPLICATION_STATUSES } from '@/types/application';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Trash2,
  Building2,
  Check,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { useToast } from '@/components/common/Toast';

interface ApplicationHeaderProps {
  application: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { updateStatus, isPending } = useUpdateApplicationStatus();
  const toast = useToast();

  const handleStatusSelect = async (status: ApplicationStatus) => {
    if (status === application.status) return;
    try {
      await updateStatus(application.id, status);
      toast.success(`Updated status to ${status}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div className="flex items-start gap-3.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 shrink-0 rounded-xl"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-sm">
            {application.company_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {application.company_name}
              </h1>
              <DropdownMenu
                trigger={
                  <button className="cursor-pointer">
                    <StatusBadge status={application.status} />
                  </button>
                }
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                  Change Stage:
                </div>
                {APPLICATION_STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className="justify-between"
                  >
                    <span>{status}</span>
                    {status === application.status && (
                      <Check className="h-3.5 w-3.5 text-indigo-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {application.job_title} &bull; {application.job_type}
            </p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 ml-12 md:ml-0">
        {application.job_url && (
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Job Posting</span>
            </a>
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Edit</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

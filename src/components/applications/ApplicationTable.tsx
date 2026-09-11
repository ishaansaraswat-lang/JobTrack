import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { formatDate, getDaysRemaining } from '@/lib/formatters';
import { JobApplication } from '@/types/application';
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDeleteApplication } from '@/hooks/useApplications';
import { useToast } from '@/components/common/Toast';

interface ApplicationTableProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onEdit,
}) => {
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);
  const deleteMutation = useDeleteApplication();
  const toast = useToast();

  const handleDelete = async () => {
    if (!deletingApp) return;
    try {
      await deleteMutation.mutateAsync(deletingApp.id);
      toast.success(`Removed ${deletingApp.company_name} application`);
      setDeletingApp(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete application');
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-[220px]">Company & Job</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const deadlineInfo = getDaysRemaining(app.deadline);
                return (
                  <TableRow key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Company & Job */}
                    <TableCell>
                      <Link
                        to={`/applications/${app.id}`}
                        className="group block font-medium"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {app.company_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                {app.company_name}
                              </span>
                              {app.job_url && (
                                <a
                                  href={app.job_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-slate-400 hover:text-indigo-600 p-0.5"
                                  title="Visit job posting"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {app.job_title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {app.location || 'Remote'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>

                    {/* Salary */}
                    <TableCell>
                      <span className="text-xs text-slate-700 font-medium">
                        {app.salary || '—'}
                      </span>
                    </TableCell>

                    {/* Applied Date */}
                    <TableCell>
                      <span className="text-xs text-slate-600">
                        {formatDate(app.application_date)}
                      </span>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      {deadlineInfo ? (
                        <div className="flex flex-col">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                              deadlineInfo.isOverdue
                                ? 'bg-rose-50 text-rose-700'
                                : deadlineInfo.isUrgent
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {deadlineInfo.isUrgent && <AlertCircle className="h-3 w-3" />}
                            {deadlineInfo.text}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(app.deadline)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* Actions dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownMenuItem asChild>
                          <Link to={`/applications/${app.id}`} className="flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(app)}>
                          <div className="flex items-center gap-2">
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Application</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          destructive
                          onClick={() => setDeletingApp(app)}
                        >
                          <div className="flex items-center gap-2 text-rose-600">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-200">
          {applications.map((app) => (
            <div key={app.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/applications/${app.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {app.company_name}
                    </h4>
                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{app.job_title}</p>
                </Link>
                <StatusBadge status={app.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{app.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{app.salary || 'Salary N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Applied {formatDate(app.application_date)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/applications/${app.id}`}>Details</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(app)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  onClick={() => setDeletingApp(app)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        open={Boolean(deletingApp)}
        onOpenChange={(open) => !open && setDeletingApp(null)}
        title="Delete Job Application"
        description={`Are you sure you want to delete your application for "${deletingApp?.job_title}" at "${deletingApp?.company_name}"? This action cannot be undone.`}
        confirmLabel="Delete Application"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

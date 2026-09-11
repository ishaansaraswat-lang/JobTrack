import React from 'react';
import { JobApplication } from '@/types/application';
import { formatDate, getDaysRemaining } from '@/lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface ApplicationDetailsCardProps {
  application: JobApplication;
}

export const ApplicationDetailsCard: React.FC<ApplicationDetailsCardProps> = ({
  application,
}) => {
  const deadlineInfo = getDaysRemaining(application.deadline);

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">
          Position Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Employment Type
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {application.job_type}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {application.location || 'Remote / Unspecified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Salary Compensation
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {application.salary || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Applied Date
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {formatDate(application.application_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Deadline / Next Step
              </p>
              <div className="mt-0.5">
                {application.deadline ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {formatDate(application.deadline)}
                    </span>
                    {deadlineInfo && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          deadlineInfo.isOverdue
                            ? 'bg-rose-50 text-rose-700'
                            : deadlineInfo.isUrgent
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {deadlineInfo.text}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">No deadline set</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes block */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Notes & Discussion Details
            </h4>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {application.notes || 'No notes added for this job opportunity yet.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

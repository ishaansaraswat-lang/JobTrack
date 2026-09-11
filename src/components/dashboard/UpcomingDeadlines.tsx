import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '@/types/application';
import { getDaysRemaining, formatDate } from '@/lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingDeadlinesProps {
  applications: JobApplication[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  applications,
}) => {
  // Find apps with deadlines or in Interview status
  const itemsWithDeadlines = applications
    .filter((app) => Boolean(app.deadline) || app.status === 'Interview')
    .map((app) => ({
      app,
      deadlineInfo: getDaysRemaining(app.deadline),
    }))
    .slice(0, 5);

  return (
    <Card className="h-full flex flex-col border border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Upcoming Deadlines & Interviews
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Key milestones requiring your attention
          </p>
        </div>
        <Clock className="h-4 w-4 text-slate-400" />
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-slate-100">
        {itemsWithDeadlines.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming deadlines or interviews.</p>
            <p className="text-xs text-slate-400 mt-1">
              Add deadlines to applications to track them here.
            </p>
          </div>
        ) : (
          itemsWithDeadlines.map(({ app, deadlineInfo }) => (
            <Link
              key={app.id}
              to={`/applications/${app.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {app.company_name}
                  </h4>
                  {app.status === 'Interview' && (
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Interview
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {app.job_title}
                </p>
              </div>

              <div className="shrink-0 text-right">
                {deadlineInfo ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                      deadlineInfo.isOverdue
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : deadlineInfo.isUrgent
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    )}
                  >
                    {deadlineInfo.isUrgent && <AlertCircle className="h-3 w-3" />}
                    {deadlineInfo.text}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    {formatDate(app.application_date)}
                  </span>
                )}
                {app.deadline && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(app.deadline)}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

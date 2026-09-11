import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '@/types/application';
import { StatusBadge } from '@/components/applications/StatusBadge';
import { formatDate } from '@/lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentApplicationsProps {
  applications: JobApplication[];
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
}) => {
  const recent = applications.slice(0, 5);

  return (
    <Card className="h-full flex flex-col border border-slate-200/80 bg-white shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Recent Applications
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Your most recently updated positions
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-indigo-600">
          <Link to="/applications">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-slate-100">
        {recent.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No applications recorded yet.</p>
          </div>
        ) : (
          recent.map((app) => (
            <Link
              key={app.id}
              to={`/applications/${app.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {app.company_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {app.company_name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {app.job_title} &bull; {app.location || 'Remote'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="hidden sm:inline text-xs text-slate-400">
                  {formatDate(app.application_date)}
                </span>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { APPLICATION_STATUSES, ApplicationStatus, JobApplication } from '@/types/application';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  TrendingUp,
} from 'lucide-react';

type PipelineView = 'board' | 'list' | 'analytics';

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-50 text-blue-700 border-blue-100',
  Screening: 'bg-violet-50 text-violet-700 border-violet-100',
  Interview: 'bg-amber-50 text-amber-700 border-amber-100',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-100',
  Withdrawn: 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusDots: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-500',
  Screening: 'bg-violet-500',
  Interview: 'bg-amber-500',
  Offer: 'bg-emerald-500',
  Rejected: 'bg-rose-500',
  Withdrawn: 'bg-slate-500',
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
};

const initials = (company: string) =>
  company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const ViewButton: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ active, icon, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {children}
  </button>
);

const PipelineList: React.FC<{ applications: JobApplication[] }> = ({ applications }) => {
  const navigate = useNavigate();

  return (
    <div className="saas-card overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50/70">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Company & Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Applied</th>
              <th className="px-5 py-3">Deadline</th>
              <th className="px-5 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr key={app.id} className="group hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                      {initials(app.company_name)}
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900 group-hover:text-indigo-600">
                        {app.company_name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">{app.job_title}</span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDots[app.status]}`} />
                    {app.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{app.location || '—'}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatDate(app.application_date)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatDate(app.deadline)}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    View <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {applications.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => navigate(`/applications/${app.id}`)}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                  {initials(app.company_name)}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{app.company_name}</p>
                  <p className="text-xs text-slate-500">{app.job_title}</p>
                </div>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusStyles[app.status]}`}>
                {app.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{app.location || 'No location'}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(app.application_date)}</span>
            </div>
          </button>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="p-12 text-center text-sm text-slate-500">No applications yet.</div>
      )}
    </div>
  );
};

const AnalyticsView: React.FC<{ applications: JobApplication[] }> = ({ applications }) => {
  const counts = useMemo(() => {
    return APPLICATION_STATUSES.map((status) => ({
      status,
      count: applications.filter((app) => app.status === status).length,
    }));
  }, [applications]);

  const active = applications.filter((app) => !['Rejected', 'Withdrawn'].includes(app.status)).length;
  const interviews = applications.filter((app) => app.status === 'Interview').length;
  const offers = applications.filter((app) => app.status === 'Offer').length;
  const responseRate = applications.length ? Math.round(((applications.length - applications.filter((app) => app.status === 'Applied').length) / applications.length) * 100) : 0;
  const max = Math.max(...counts.map((item) => item.count), 1);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="saas-card p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Applications by stage</h2>
            <p className="mt-1 text-sm text-slate-500">A quick view of your current hiring funnel.</p>
          </div>
          <BarChart3 className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="mt-7 space-y-4">
          {counts.map(({ status, count }) => (
            <div key={status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`} />
                  {status}
                </span>
                <span className="font-semibold text-slate-900">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${statusDots[status]}`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <div className="saas-card p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><BriefcaseBusiness className="h-5 w-5" /></span>
            <div><p className="text-xs text-slate-500">Active applications</p><p className="text-2xl font-bold text-slate-900">{active}</p></div>
          </div>
        </div>
        <div className="saas-card p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><TrendingUp className="h-5 w-5" /></span>
            <div><p className="text-xs text-slate-500">Interviews</p><p className="text-2xl font-bold text-slate-900">{interviews}</p></div>
          </div>
        </div>
        <div className="saas-card p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><span className="text-lg">%</span></span>
            <div><p className="text-xs text-slate-500">Progress rate</p><p className="text-2xl font-bold text-slate-900">{responseRate}%</p></div>
          </div>
        </div>
      </div>

      <div className="saas-card p-5 lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Pipeline health</h2>
            <p className="mt-1 text-sm text-slate-500">Keep applications moving toward interviews and offers.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{offers} offer{offers === 1 ? '' : 's'}</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ['Applied', counts.find((item) => item.status === 'Applied')?.count ?? 0],
            ['Screening', counts.find((item) => item.status === 'Screening')?.count ?? 0],
            ['Interview', interviews],
            ['Offer', offers],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PipelinePage: React.FC = () => {
  const { data: applications = [], isLoading } = useApplications();
  const [view, setView] = useState<PipelineView>('board');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="saas-page space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="saas-title text-2xl">Application Pipeline</h1>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {applications.length} Total
            </span>
          </div>
          <p className="saas-subtitle">Move applications through hiring stages and keep your job search organized.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <ViewButton active={view === 'board'} onClick={() => setView('board')} icon={<LayoutGrid className="h-4 w-4" />}>
              Board View
            </ViewButton>
            <ViewButton active={view === 'list'} onClick={() => setView('list')} icon={<List className="h-4 w-4" />}>
              List View
            </ViewButton>
            <ViewButton active={view === 'analytics'} onClick={() => setView('analytics')} icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </ViewButton>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 w-80 shrink-0 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : view === 'board' ? (
        <KanbanBoard applications={applications} />
      ) : view === 'list' ? (
        <PipelineList applications={applications} />
      ) : (
        <AnalyticsView applications={applications} />
      )}

      <ApplicationFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
};

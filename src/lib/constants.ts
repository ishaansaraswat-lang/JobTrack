import { ApplicationStatus } from '@/types/application';

export interface StatusConfig {
  label: ApplicationStatus;
  badgeClass: string;
  bgLight: string;
  dotColor: string;
  borderColor: string;
  chartColor: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  Applied: {
    label: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    bgLight: 'bg-blue-50/60',
    dotColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    chartColor: '#3b82f6',
  },
  Screening: {
    label: 'Screening',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    bgLight: 'bg-purple-50/60',
    dotColor: 'bg-purple-500',
    borderColor: 'border-purple-200',
    chartColor: '#a855f7',
  },
  Interview: {
    label: 'Interview',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    bgLight: 'bg-amber-50/60',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-200',
    chartColor: '#f59e0b',
  },
  Offer: {
    label: 'Offer',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    bgLight: 'bg-emerald-50/60',
    dotColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    chartColor: '#10b981',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    bgLight: 'bg-rose-50/60',
    dotColor: 'bg-rose-500',
    borderColor: 'border-rose-200',
    chartColor: '#ef4444',
  },
  Withdrawn: {
    label: 'Withdrawn',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    bgLight: 'bg-slate-50',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-200',
    chartColor: '#64748b',
  },
};

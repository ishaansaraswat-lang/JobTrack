import { Database, ApplicationStatus } from './database.types';

export type JobApplication = Database['public']['Tables']['applications']['Row'];
export type NewJobApplication = Database['public']['Tables']['applications']['Insert'];
export type UpdateJobApplication = Database['public']['Tables']['applications']['Update'];

export type ApplicationEvent = Database['public']['Tables']['application_events']['Row'];
export type NewApplicationEvent = Database['public']['Tables']['application_events']['Insert'];

export type { ApplicationStatus };

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export interface ApplicationFiltersState {
  search: string;
  status: ApplicationStatus | 'All';
  jobType: string | 'All';
  sortBy: 'date_desc' | 'date_asc' | 'company' | 'deadline';
}

export interface ApplicationStats {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

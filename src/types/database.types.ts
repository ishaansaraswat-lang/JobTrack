export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          headline: string | null;
          target_role: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          headline?: string | null;
          target_role?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          headline?: string | null;
          target_role?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_title: string;
          job_type: string;
          location: string | null;
          salary: string | null;
          job_url: string | null;
          application_date: string;
          deadline: string | null;
          status: ApplicationStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          job_title: string;
          job_type?: string;
          location?: string | null;
          salary?: string | null;
          job_url?: string | null;
          application_date?: string;
          deadline?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          job_title?: string;
          job_type?: string;
          location?: string | null;
          salary?: string | null;
          job_url?: string | null;
          application_date?: string;
          deadline?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      application_events: {
        Row: {
          id: string;
          application_id: string;
          user_id: string;
          event_type: string;
          title: string;
          description: string | null;
          event_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          user_id: string;
          event_type: string;
          title: string;
          description?: string | null;
          event_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          user_id?: string;
          event_type?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          created_at?: string;
        };
      };
    };
  };
}

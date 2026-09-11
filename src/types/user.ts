import { Database } from './database.types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
export type UpdateUserProfile = Database['public']['Tables']['profiles']['Update'];

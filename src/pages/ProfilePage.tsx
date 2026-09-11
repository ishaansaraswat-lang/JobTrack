import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/common/Toast';
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  LogOut,
  Sparkles,
  ShieldCheck,
  Database,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export const ProfilePage: React.FC = () => {
  const { profile, user, signOut, isDemoUser, isConfigured, updateProfile } = useAuth();
  const { data: applications = [] } = useApplications();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setHeadline(profile.headline || '');
      setTargetRole(profile.target_role || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({
      full_name: fullName,
      headline,
      target_role: targetRole,
      location,
    });
    setIsSaving(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          User Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details and career preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Stats (1 col) */}
        <div className="space-y-6">
          <Card className="border border-slate-200/80 bg-white shadow-xs text-center p-6">
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl mb-3 shadow-inner">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {profile?.full_name || 'Job Seeker'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.headline || 'Software Professional'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate max-w-[200px]">{profile?.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase font-semibold">Total</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {applications.length}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase font-semibold">Active</p>
                <p className="text-xl font-bold text-indigo-600 mt-0.5">
                  {
                    applications.filter(
                      (a) => a.status === 'Interview' || a.status === 'Screening'
                    ).length
                  }
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="w-full mt-6 gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Card>

          {/* Connection Status Card */}
          <Card className="border border-slate-200/80 bg-white shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-slate-500" />
              Backend Connection
            </h4>

            {isConfigured && !isDemoUser ? (
              <div className="space-y-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Supabase Cloud Active</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Data is securely synced to your Supabase PostgreSQL database with Row-Level Security.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>Interactive Demo Mode</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Running on browser local storage. Connect your Supabase keys in <code>.env</code> for full cloud persistence.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Edit Profile Form (2 cols) */}
        <div className="md:col-span-2">
          <Card className="border border-slate-200/80 bg-white shadow-xs">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base">Personal & Professional Info</CardTitle>
              <CardDescription className="text-xs">
                Update how your name and target roles appear in JobTrack
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Email is associated with your authentication login
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Headline
                  </label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Frontend Architect | React & TypeScript"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Role
                    </label>
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Full Stack Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Location
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Remote / San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

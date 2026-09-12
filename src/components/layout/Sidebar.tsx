import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  User,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { profile, signOut, isDemoUser, isConfigured } = useAuth();
  const { data: applications = [] } = useApplications();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Applications',
      path: '/applications',
      icon: Briefcase,
      badge: applications.length,
    },
    {
      name: 'Pipeline',
      path: '/pipeline',
      icon: Kanban,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[250px] bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold shadow-lg shadow-indigo-900/30">
          JT
        </div>
        <div>
          <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
            JobTrack
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">
              SaaS
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Career Pipeline</p>
        </div>
      </div>

      {/* Mode / Supabase status pill */}
      <div className="px-4 py-3">
        {isDemoUser || !isConfigured ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <div className="leading-tight truncate">
              <p className="font-medium">Interactive Demo Mode</p>
              <p className="text-[10px] text-amber-400/80">Local storage active</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium truncate">Supabase Connected</span>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-2">
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10 font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                    'bg-white/10 text-slate-300 group-hover:bg-white/15'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-sm">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {profile?.full_name || 'Job Seeker'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {profile?.email || 'user@example.com'}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

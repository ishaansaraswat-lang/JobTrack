import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  User,
  LogOut,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  open,
  onClose,
  onOpenAddModal,
}) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  // Close nav on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!open) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'Pipeline', path: '/pipeline', icon: Kanban },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 p-4 flex flex-col shadow-2xl animate-in slide-in-from-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              JT
            </div>
            <span className="font-bold text-base text-white">JobTrack</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Add CTA */}
        <div className="py-4">
          <Button
            onClick={() => {
              onClose();
              onOpenAddModal();
            }}
            className="w-full gap-2 justify-center"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-xs font-semibold text-white truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {profile?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              onClose();
            }}
            className="w-full gap-2 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

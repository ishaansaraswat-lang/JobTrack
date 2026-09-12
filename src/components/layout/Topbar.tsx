import React from 'react';
import { Menu, Plus, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenAddModal,
}) => {
  const { profile, isConfigured } = useAuth();

  return (
    <header className="h-[72px] border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs">
            JT
          </div>
          <span className="font-bold text-sm text-slate-900">JobTrack</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 min-w-[220px] lg:min-w-[280px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Job search workspace</span>
        </div>

        {!isConfigured && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <Database className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Connect your Supabase project in <code>.env</code></span>
          </div>
        )}

        <Button
          onClick={onOpenAddModal}
          size="sm"
          className="gap-1.5 rounded-xl shadow-sm shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
};

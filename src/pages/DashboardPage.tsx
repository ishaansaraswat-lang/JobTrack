import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApplications, useApplicationStats } from '@/hooks/useApplications';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Send,
  UserCheck,
  Calendar,
  Award,
  XCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const { data: applications = [], isLoading } = useApplications();
  const stats = useApplicationStats();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="saas-page">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="saas-title">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Job Seeker'} 👋
          </h1>
          <p className="saas-subtitle">
            Here is an overview of your job search progress and upcoming milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/pipeline')}
            className="gap-2 text-xs sm:text-sm"
          >
            <span>View Pipeline</span>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 text-xs sm:text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Briefcase}
          colorClass="text-slate-700"
          bgClass="bg-slate-100"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Applied"
          value={stats.applied}
          icon={Send}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Screening"
          value={stats.screening}
          icon={UserCheck}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Interviews"
          value={stats.interview}
          icon={Calendar}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Offers"
          value={stats.offer}
          icon={Award}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
          onClick={() => navigate('/applications')}
        />
      </div>

      {/* Charts and Feeds Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Chart (1/3 or 1 col on lg) */}
        <div className="lg:col-span-1">
          <StatusChart stats={stats} />
        </div>

        {/* Upcoming Deadlines (1/3) */}
        <div className="lg:col-span-1">
          <UpcomingDeadlines applications={applications} />
        </div>

        {/* Recent Applications (1/3) */}
        <div className="lg:col-span-1">
          <RecentApplications applications={applications} />
        </div>
      </div>

      {/* Modal Dialog */}
      <ApplicationFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
};

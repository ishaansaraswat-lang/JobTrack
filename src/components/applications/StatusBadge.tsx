import React from 'react';
import { ApplicationStatus } from '@/types/application';
import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Send,
  UserCheck,
  Calendar,
  Award,
  XCircle,
  Archive,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

const STATUS_ICONS: Record<ApplicationStatus, React.ComponentType<{ className?: string }>> = {
  Applied: Send,
  Screening: UserCheck,
  Interview: Calendar,
  Offer: Award,
  Rejected: XCircle,
  Withdrawn: Archive,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Applied'];
  const Icon = STATUS_ICONS[status] || Send;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
        config.badgeClass,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

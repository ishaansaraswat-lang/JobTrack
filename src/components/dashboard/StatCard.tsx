import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  description?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  description,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-5 transition-all border border-slate-200/80 bg-white hover:shadow-md hover:border-slate-300',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </span>
          </div>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            bgClass,
            colorClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

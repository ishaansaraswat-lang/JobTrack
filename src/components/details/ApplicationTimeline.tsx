import React, { useState } from 'react';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { formatDateTime, formatDate } from '@/lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddEventModal } from './AddEventModal';
import {
  Send,
  Calendar,
  MessageSquare,
  Award,
  XCircle,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationTimelineProps {
  applicationId: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  applicationId,
}) => {
  const { data: events = [], isLoading } = useTimelineEvents(applicationId);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'APPLICATION_CREATED':
        return {
          icon: Send,
          color: 'bg-blue-100 text-blue-600 border-blue-200',
        };
      case 'STATUS_CHANGE':
        return {
          icon: CheckCircle2,
          color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
        };
      case 'INTERVIEW':
        return {
          icon: Calendar,
          color: 'bg-amber-100 text-amber-600 border-amber-200',
        };
      case 'OFFER':
        return {
          icon: Award,
          color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
        };
      case 'REJECTION':
        return {
          icon: XCircle,
          color: 'bg-rose-100 text-rose-600 border-rose-200',
        };
      default:
        return {
          icon: MessageSquare,
          color: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  return (
    <>
      <Card className="border border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Application Timeline
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              History of status changes, interviews, and progress
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Milestone
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No timeline events recorded yet.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="mt-2 text-indigo-600 text-xs"
              >
                + Log the first milestone
              </Button>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:left-2.5 before:top-2 before:w-0.5 before:bg-slate-200">
              {events.map((event) => {
                const { icon: Icon, color } = getEventIcon(event.event_type);
                return (
                  <div key={event.id} className="relative group">
                    {/* Circle icon on the timeline line */}
                    <div
                      className={`absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full border ${color} bg-white shadow-2xs`}
                    >
                      <Icon className="h-3 w-3" />
                    </div>

                    <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {event.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatDate(event.event_date)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddEventModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        applicationId={applicationId}
      />
    </>
  );
};

import React, { useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useCreateTimelineEvent } from '@/hooks/useTimelineEvents';
import { useToast } from '@/components/common/Toast';

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onOpenChange,
  applicationId,
}) => {
  const [eventType, setEventType] = useState('INTERVIEW');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  const createEventMutation = useCreateTimelineEvent();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required');
      return;
    }

    try {
      await createEventMutation.mutateAsync({
        application_id: applicationId,
        event_type: eventType,
        title,
        description,
        event_date: new Date(eventDate).toISOString(),
      });
      toast.success('Added timeline event!');
      setTitle('');
      setDescription('');
      setError('');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add timeline event');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Log Timeline Event</DialogTitle>
        <DialogDescription>
          Record an interview date, milestone, recruiter feedback, or custom note.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Type
          </label>
          <Select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="INTERVIEW">Interview Scheduled / Completed</option>
            <option value="NOTE">Note / Update</option>
            <option value="OFFER">Offer Milestone</option>
            <option value="REJECTION">Rejection Notice</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Title <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Technical Round with Engineering Manager"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className={error ? 'border-rose-500' : ''}
          />
          {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Date
          </label>
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Details & Takeaways
          </label>
          <Textarea
            rows={3}
            placeholder="Interview questions asked, interviewer impressions, next steps discussed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogClose onClick={() => onOpenChange(false)} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createEventMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createEventMutation.isPending}>
            {createEventMutation.isPending ? 'Adding...' : 'Log Event'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

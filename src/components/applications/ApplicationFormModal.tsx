import React, { useState, useEffect } from 'react';
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
import {
  JobApplication,
  NewJobApplication,
  APPLICATION_STATUSES,
  JOB_TYPES,
  ApplicationStatus,
} from '@/types/application';
import { useCreateApplication, useUpdateApplication } from '@/hooks/useApplications';
import { useToast } from '@/components/common/Toast';

interface ApplicationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
  initialStatus?: ApplicationStatus;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  open,
  onOpenChange,
  application,
  initialStatus = 'Applied',
}) => {
  const isEditing = Boolean(application);
  const toast = useToast();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  const [formData, setFormData] = useState<Omit<NewJobApplication, 'user_id'>>({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    location: '',
    salary: '',
    job_url: '',
    application_date: new Date().toISOString().split('T')[0],
    deadline: '',
    status: initialStatus,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name,
        job_title: application.job_title,
        job_type: application.job_type || 'Full-time',
        location: application.location || '',
        salary: application.salary || '',
        job_url: application.job_url || '',
        application_date: application.application_date,
        deadline: application.deadline || '',
        status: application.status,
        notes: application.notes || '',
      });
    } else {
      setFormData({
        company_name: '',
        job_title: '',
        job_type: 'Full-time',
        location: '',
        salary: '',
        job_url: '',
        application_date: new Date().toISOString().split('T')[0],
        deadline: '',
        status: initialStatus,
        notes: '',
      });
    }
    setErrors({});
  }, [application, open, initialStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.company_name?.trim()) {
      errs.company_name = 'Company name is required';
    }
    if (!formData.job_title?.trim()) {
      errs.job_title = 'Job title is required';
    }
    if (formData.job_url && !formData.job_url.startsWith('http://') && !formData.job_url.startsWith('https://')) {
      errs.job_url = 'URL must start with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && application) {
        await updateMutation.mutateAsync({
          id: application.id,
          updates: {
            ...formData,
            deadline: formData.deadline || null,
          },
        });
        toast.success(`Updated ${formData.company_name} application`);
      } else {
        await createMutation.mutateAsync({
          ...formData,
          deadline: formData.deadline || null,
        });
        toast.success(`Added ${formData.company_name} application!`);
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save application');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Job Application' : 'Add New Job Application'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Update the details and current stage of this application.'
            : 'Track a new opportunity by filling in the details below.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <Input
              name="company_name"
              placeholder="e.g. Google, Stripe"
              value={formData.company_name}
              onChange={handleChange}
              className={errors.company_name ? 'border-rose-500' : ''}
            />
            {errors.company_name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <Input
              name="job_title"
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.job_title}
              onChange={handleChange}
              className={errors.job_title ? 'border-rose-500' : ''}
            />
            {errors.job_title && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.job_title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
            <Select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Salary / Compensation</label>
            <Input
              name="salary"
              placeholder="e.g. $160,000 - $190,000"
              value={formData.salary || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <Input
              name="location"
              placeholder="e.g. Remote, San Francisco, CA"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Listing URL</label>
            <Input
              name="job_url"
              placeholder="https://company.com/jobs/123"
              value={formData.job_url || ''}
              onChange={handleChange}
              className={errors.job_url ? 'border-rose-500' : ''}
            />
            {errors.job_url && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.job_url}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Application Date</label>
            <Input
              type="date"
              name="application_date"
              value={formData.application_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deadline / Interview Date (Optional)
            </label>
            <Input
              type="date"
              name="deadline"
              value={formData.deadline || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Next Steps</label>
          <Textarea
            name="notes"
            rows={3}
            placeholder="Key talking points, recruiter contact info, interview prep notes..."
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </div>

        <DialogClose onClick={() => onOpenChange(false)} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Application'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

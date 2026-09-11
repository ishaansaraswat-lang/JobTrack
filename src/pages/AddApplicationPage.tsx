import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  NewJobApplication,
} from '@/types/application';
import { useCreateApplication } from '@/hooks/useApplications';
import { useToast } from '@/components/common/Toast';
import { ArrowLeft } from 'lucide-react';

export const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateApplication();
  const toast = useToast();

  const [formData, setFormData] = useState<Omit<NewJobApplication, 'user_id'>>({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    location: '',
    salary: '',
    job_url: '',
    application_date: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Applied',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (
      formData.job_url &&
      !formData.job_url.startsWith('http://') &&
      !formData.job_url.startsWith('https://')
    ) {
      errs.job_url = 'URL must begin with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const created = await createMutation.mutateAsync({
        ...formData,
        deadline: formData.deadline || null,
      });
      toast.success(`Added ${formData.company_name} to your pipeline!`);
      navigate(`/applications/${created.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add application');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Job Application</h1>
          <p className="text-xs text-slate-500">
            Record a new career opportunity into your tracker
          </p>
        </div>
      </div>

      <Card className="border border-slate-200/80 bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Opportunity Details</CardTitle>
          <CardDescription className="text-xs">
            Fields marked with an asterisk (*) are required
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="company_name"
                  placeholder="e.g. Netflix, Microsoft"
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
                  placeholder="e.g. Senior Software Engineer"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salary / Compensation
                </label>
                <Input
                  name="salary"
                  placeholder="e.g. $150k - $180k"
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
                  placeholder="e.g. Remote, Austin, TX"
                  value={formData.location || ''}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Posting URL
                </label>
                <Input
                  name="job_url"
                  placeholder="https://jobs.lever.co/company/..."
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Date
                </label>
                <Input
                  type="date"
                  name="application_date"
                  value={formData.application_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deadline or Upcoming Interview
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes & Talking Points
              </label>
              <Textarea
                name="notes"
                rows={4}
                placeholder="Referral name, tech stack details, initial thoughts..."
                value={formData.notes || ''}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Add Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

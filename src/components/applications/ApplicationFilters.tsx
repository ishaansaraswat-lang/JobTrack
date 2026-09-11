import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  ApplicationFiltersState,
  APPLICATION_STATUSES,
  JOB_TYPES,
  ApplicationStatus,
} from '@/types/application';

interface ApplicationFiltersProps {
  filters: ApplicationFiltersState;
  onChange: (filters: ApplicationFiltersState) => void;
  onReset: () => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.jobType !== 'All' ||
    filters.sortBy !== 'date_desc';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by company, job title, location, or notes..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9 h-10 bg-slate-50/50 border-slate-200"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <Select
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as ApplicationStatus | 'All',
              })
            }
            className="h-10 bg-slate-50/50"
          >
            <option value="All">All Statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>

        {/* Job Type Dropdown */}
        <div className="w-full md:w-40">
          <Select
            value={filters.jobType}
            onChange={(e) =>
              onChange({
                ...filters,
                jobType: e.target.value,
              })
            }
            className="h-10 bg-slate-50/50"
          >
            <option value="All">All Job Types</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full md:w-44">
          <Select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as ApplicationFiltersState['sortBy'],
              })
            }
            className="h-10 bg-slate-50/50"
          >
            <option value="date_desc">Latest Applied</option>
            <option value="date_asc">Oldest Applied</option>
            <option value="company">Company (A-Z)</option>
            <option value="deadline">Upcoming Deadline</option>
          </Select>
        </div>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-3 text-slate-500 hover:text-slate-800 gap-1"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Status quick pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
          <SlidersHorizontal className="h-3 w-3" /> Filter:
        </span>
        <button
          onClick={() => onChange({ ...filters, status: 'All' })}
          className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
            filters.status === 'All'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {APPLICATION_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onChange({ ...filters, status })}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              filters.status === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50">
      <div className="h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="gap-2">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
};

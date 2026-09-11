import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Briefcase, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, loginAsDemo, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      toast.success('Welcome back to JobTrack!');
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    toast.info('Entered interactive demo mode with sample data');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/80 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to JobTrack
          </h1>
          <p className="text-sm text-slate-500">
            Your production job application management pipeline
          </p>
        </div>

        <Card className="border border-slate-200/90 shadow-lg bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Account Login</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to access your tracking workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="alex.developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">Or</span>
              </div>
            </div>

            {/* Quick Demo Mode */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 gap-2"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Explore Interactive Demo Mode</span>
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 border-t border-slate-100 text-xs text-slate-500">
            <p>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

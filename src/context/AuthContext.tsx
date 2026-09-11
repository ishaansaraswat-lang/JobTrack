import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/types/user';
import { INITIAL_MOCK_PROFILE } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loginAsDemo: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'jobtrack_demo_mode';
const PROFILE_STORAGE_KEY = 'jobtrack_local_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Initialize demo or active session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);

      if (!isSupabaseConfigured || storedDemo === 'true') {
        // Use demo session
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
        const parsedProfile = storedProfile ? JSON.parse(storedProfile) : INITIAL_MOCK_PROFILE;

        if (mounted) {
          setIsDemoUser(true);
          setProfile(parsedProfile);
          setUser({
            id: parsedProfile.id,
            email: parsedProfile.email,
            app_metadata: {},
            user_metadata: { full_name: parsedProfile.full_name },
            aud: 'authenticated',
            created_at: parsedProfile.created_at,
          } as User);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email ?? '');
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }

      // Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            setIsDemoUser(false);
            await fetchProfile(newSession.user.id, newSession.user.email ?? '');
          } else {
            setProfile(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Create initial profile if missing
        const newProfile: UserProfile = {
          id: userId,
          email: email,
          full_name: email.split('@')[0],
          headline: 'Job Seeker',
          target_role: 'Software Engineer',
          location: 'Remote',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from('profiles').upsert(newProfile as any);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      loginAsDemo();
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setIsDemoUser(false);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      loginAsDemo();
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (isDemoUser) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setIsDemoUser(false);
      setUser(null);
      setProfile(null);
      return;
    }

    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const loginAsDemo = () => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'true');
    const demoProf = INITIAL_MOCK_PROFILE;
    setIsDemoUser(true);
    setProfile(demoProf);
    setUser({
      id: demoProf.id,
      email: demoProf.email,
      app_metadata: {},
      user_metadata: { full_name: demoProf.full_name },
      aud: 'authenticated',
      created_at: demoProf.created_at,
    } as User);
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (isDemoUser || !isSupabaseConfigured) {
      const updated = { ...profile, ...updates, updated_at: new Date().toISOString() } as UserProfile;
      setProfile(updated);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      return { error: null };
    }

    if (!user) return { error: new Error('User not logged in') };

    try {
      const { error } = await (supabase.from('profiles') as any)
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isDemoUser,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

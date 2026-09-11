-- ================================================================
-- JobTrack Database Initialization Schema
-- Comprehensive, Production-Grade PostgreSQL Schema for Supabase
-- Safe to run in any fresh or existing Supabase project (idempotent)
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. APPLICATION STATUS ENUM
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'Applied',
        'Screening',
        'Interview',
        'Offer',
        'Rejected',
        'Withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
-- Extends Supabase auth.users with user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    headline TEXT DEFAULT 'Software Engineer',
    target_role TEXT DEFAULT 'Full Stack Developer',
    location TEXT DEFAULT 'Remote / Open to Relocate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_type TEXT NOT NULL DEFAULT 'Full-time', -- 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'
    location TEXT,
    salary TEXT,
    job_url TEXT,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE,
    status application_status NOT NULL DEFAULT 'Applied',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. APPLICATION EVENTS (TIMELINE & INTERVIEW NOTES)
CREATE TABLE IF NOT EXISTS public.application_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'APPLICATION_CREATED', 'STATUS_CHANGE', 'INTERVIEW', 'NOTE', 'OFFER', 'REJECTION'
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_app_date ON public.applications(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_application_events_app_id ON public.application_events(application_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_application_events_user_id ON public.application_events(user_id);

-- 7. TRIGGER: UPDATED_AT TIMESTAMP AUTO-UPDATER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_application_updated ON public.applications;
CREATE TRIGGER on_application_updated
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. TRIGGER: AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. TRIGGER: AUTOMATIC TIMELINE EVENTS ON APPLICATION CREATION & STATUS CHANGE
CREATE OR REPLACE FUNCTION public.handle_application_timeline_logging()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.application_events (application_id, user_id, event_type, title, description, event_date)
        VALUES (
            NEW.id,
            NEW.user_id,
            'APPLICATION_CREATED',
            'Application Submitted',
            'Applied for ' || NEW.job_title || ' at ' || NEW.company_name,
            COALESCE(NEW.application_date::timestamptz, now())
        );
    ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.application_events (application_id, user_id, event_type, title, description, event_date)
        VALUES (
            NEW.id,
            NEW.user_id,
            'STATUS_CHANGE',
            'Status Changed to ' || NEW.status,
            'Stage updated from ' || OLD.status || ' to ' || NEW.status,
            now()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_application_timeline_logging ON public.applications;
CREATE TRIGGER on_application_timeline_logging
    AFTER INSERT OR UPDATE OF status ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_application_timeline_logging();

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view, insert, and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications: Users can CRUD only their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON public.applications;
CREATE POLICY "Users can insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
CREATE POLICY "Users can update own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own applications" ON public.applications;
CREATE POLICY "Users can delete own applications" ON public.applications
    FOR DELETE USING (auth.uid() = user_id);

-- Application Events: Users can CRUD only their own application events
DROP POLICY IF EXISTS "Users can view own application events" ON public.application_events;
CREATE POLICY "Users can view own application events" ON public.application_events
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own application events" ON public.application_events;
CREATE POLICY "Users can insert own application events" ON public.application_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own application events" ON public.application_events;
CREATE POLICY "Users can update own application events" ON public.application_events
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own application events" ON public.application_events;
CREATE POLICY "Users can delete own application events" ON public.application_events
    FOR DELETE USING (auth.uid() = user_id);

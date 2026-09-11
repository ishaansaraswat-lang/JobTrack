# JobTrack — Job Application Management Platform

JobTrack is a full-stack, production-quality SaaS web application for tracking and managing job applications across their complete lifecycle.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Inter typography, custom semantic tokens
- **UI Components**: shadcn/ui design patterns, Lucide React icons
- **State & Data Access**: TanStack React Query v5
- **Data Visualizations**: Recharts
- **Routing**: React Router DOM v6
- **Backend & Database**: Supabase, PostgreSQL, Supabase Auth, Row Level Security (RLS)

---

## Core Features

1. **Authentication & Session Persistence**:
   - Supabase Auth (Email & Password sign up and log in).
   - Instant interactive demo mode with realistic sample data for testing.
   - Protected routes with redirect guards and loading states.

2. **SaaS Overview Dashboard**:
   - High-level metric cards: Total Applications, Applied, Screening, Interviews, Offers, Rejected.
   - Recharts status distribution chart (toggle between Donut and Bar formats).
   - Upcoming deadlines and interviews with urgency countdown badges.
   - Recent applications feed with stage badges.

3. **Applications Management**:
   - Master data table with Company, Position, Location, Status, Salary, Applied Date, Deadline, and Actions.
   - Live debounced search across companies, positions, and notes.
   - Status filters and Job Type selectors.
   - Sorting by Latest Applied, Oldest Applied, Company Name (A-Z), or Upcoming Deadline.
   - Edit, Delete with accessible confirmation dialogs, and View Details.

4. **Interactive Pipeline (Kanban Board)**:
   - 6-column workflow: `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
   - Single-click stage progression controls and status selection menus.
   - Column counters and quick "Add to stage" actions.

5. **Application Details & Milestone Timeline**:
   - Full opportunity metadata, external job listing links, and editable fields.
   - Vertical visual timeline tracking application submissions, status transitions, interview dates, and custom notes.
   - Add custom milestone modal with date pickers and note capture.

6. **User Profile & Settings**:
   - Personal profile information (Full Name, Headline, Target Role, Location).
   - Live backend connection status indicator (Supabase Cloud vs Demo mode).
   - Quick sign out.

---

## Getting Started

### 1. Prerequisites
- Node.js LTS (v20+ or v22+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open and run the migration script located at:
   ```
   supabase/migrations/20260911_init_jobtrack_schema.sql
   ```
   This creates:
   - `profiles`, `applications`, and `application_events` tables.
   - Automatic triggers for profile creation on signup and timeline updates on status changes.
   - Row Level Security (RLS) policies ensuring users only access their own records.
4. Copy your **Project URL** and **Publishable Key** (or Anon Key) from Supabase **Settings > API**.
5. Create a `.env` file (or update the existing `.env`) with:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
   ```

### 4. Running the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Building for Production
```bash
npm run build
npm run preview
```

---

## Application Routes

- `/login` — Login page with demo mode launcher
- `/signup` — Registration with email & password
- `/dashboard` — SaaS metrics overview, chart, upcoming deadlines
- `/applications` — Full applications data table with search, filter, and sort
- `/applications/:id` — Detail view with vertical event timeline
- `/add-application` — Dedicated new application form
- `/pipeline` — Kanban board with 6 status stages
- `/profile` — User profile, career settings, and connection status

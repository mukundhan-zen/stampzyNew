# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

### Package Management
- Uses `pnpm` as the package manager (pnpm-lock.yaml present)
- Install dependencies: `pnpm install`

## Architecture Overview

This is a Next.js 15 stamp collection tracking application with the following key architectural components:

### Framework & Stack
- **Frontend**: Next.js 15 with App Router (`src/app` directory structure)
- **Styling**: Tailwind CSS v4 with Shadcn UI components ("new-york" style)
- **Backend**: Supabase for authentication, database, and storage
- **Language**: TypeScript throughout
- **Theme**: next-themes for dark/light mode support

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related pages (login, register)
│   ├── (auth-pages)/      # Additional auth pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── forms/             # Form components
│   └── ui/                # Shadcn UI components
├── lib/                   # Shared utilities and configurations
├── types/                 # TypeScript type definitions
└── utils/supabase/        # Supabase client utilities
```

### Authentication System
- Uses Supabase Auth (SSR-compatible setup)
- Client-side auth: `src/utils/supabase/client.ts`
- Server-side auth: `src/utils/supabase/server.ts`
- Middleware: `src/utils/supabase/middleware.ts`
- Database schema includes `public.users` table linked to `auth.users`

### Key Features Implemented
- User registration/login with Supabase Auth
- Protected routes with middleware
- Dashboard with stamp collection management
- Image upload functionality for stamps
- Collection and stamp CRUD operations
- Search and filtering capabilities
- Responsive design (mobile-first)

### Database Schema
- `public.users` table with RLS policies
- Stamps, collections, and transaction tables (refer to `db/schema.sql`)
- Image storage linked to stamp records

### Styling Configuration
- Tailwind CSS with custom color palette (slate base color)
- Shadcn UI components configured in `components.json`
- Theme switching with next-themes
- CSS variables for consistent theming

### Development Notes
- Uses strict TypeScript configuration
- Path aliases configured (`@/*` maps to `./src/*`)
- Environment variables required for Supabase connection
- Images configured for remote patterns (Pexels, Wikimedia)

### Application Flow
1. Authentication required for dashboard access
2. Users can add stamps with metadata and images
3. Dashboard displays collections with search/filter
4. Progressive disclosure for advanced features
5. Mobile-responsive navigation (sidebar → bottom nav)

### Important Files to Reference
- `PROJECT-SPECS.md` - Detailed feature specifications
- `PLAN.md` - Development plan with epics and stories
- `MVP-SCOPE.md` - MVP feature scope and requirements
- `src/lib/supabase.ts` - Main Supabase client configuration
- `db/schema.sql` - Database schema and RLS policies
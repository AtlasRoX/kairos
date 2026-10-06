# Kairos System Architecture

## Architecture Overview
Kairos is an AI and software engineering production readiness tracking and evaluation platform built on Next.js with React Server and Client Components.

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                     │
│  - App Router (app/page.tsx, app/projects/[id]/page.tsx)│
│  - Atomic UI System (components/ui/*)                   │
│  - Domain Feature Modules (components/checklist/*)      │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                  Next.js Route Handlers                 │
│  - /api/auth/*     - /api/projects/*                    │
│  - /api/checklist  - /api/projects/[id]/results         │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Persistence Layer                    │
│  - Neon Serverless PostgreSQL / pg Pool (lib/db)        │
│  - Schema: users, projects, checklist_items, results    │
└─────────────────────────────────────────────────────────┘
```

## Data Layer Design
1. **Connection Pooling**: Utilizes `@neondatabase/serverless` and standard `pg` connection pools.
2. **State Management**: React state hooks coupled with modular API route handlers.
3. **Authentication**: Session cookie with cryptographically secure token tracking.

# Database Schema Specification

Kairos uses PostgreSQL. Tables are defined as follows:

## 1. `users`
- `id` (VARCHAR/UUID PRIMARY KEY)
- `email` (VARCHAR UNIQUE NOT NULL)
- `name` (VARCHAR NOT NULL)
- `password_hash` (VARCHAR NOT NULL)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())

## 2. `projects`
- `id` (VARCHAR/UUID PRIMARY KEY)
- `user_id` (VARCHAR REFERENCES users(id))
- `name` (VARCHAR NOT NULL)
- `description` (TEXT)
- `tier` (VARCHAR DEFAULT 'tier-1')
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ DEFAULT NOW())

## 3. `checklist_results`
- `id` (VARCHAR/UUID PRIMARY KEY)
- `project_id` (VARCHAR REFERENCES projects(id))
- `item_id` (VARCHAR NOT NULL)
- `status` (VARCHAR DEFAULT 'not_started')
- `notes` (TEXT)
- `updated_at` (TIMESTAMPTZ DEFAULT NOW())

## 4. `activity_logs`
- `id` (VARCHAR/UUID PRIMARY KEY)
- `project_id` (VARCHAR REFERENCES projects(id))
- `action` (VARCHAR NOT NULL)
- `details` (JSONB)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())

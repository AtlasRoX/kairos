# Kairos REST API Reference

## Authentication Endpoints
- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Authenticate and issue session cookie.
- `POST /api/auth/logout`: Invalidate session and clear auth cookie.
- `GET /api/auth/me`: Retrieve currently authenticated user context.

## Project Management Endpoints
- `GET /api/projects`: List all accessible projects.
- `POST /api/projects`: Create a new production readiness audit project.
- `GET /api/projects/:id`: Get detailed metadata for a specific project.
- `PUT /api/projects/:id`: Update project configuration.
- `DELETE /api/projects/:id`: Remove project and associated checklist audits.

## Readiness Checklist Endpoints
- `GET /api/checklist`: Fetch standardized checklist categories and criteria.
- `GET /api/projects/:id/results`: Get evaluation state of checklist items.
- `POST /api/projects/:id/results`: Update checklist criteria score and QA remarks.
- `GET /api/projects/:id/logs`: Retrieve audit trail of project changes.

# MERN Auth + RBAC + Tasks (Admin Console Included)

This repository contains a full-stack assignment demonstrating a scalable REST API with authentication, role-based access control (RBAC), CRUD for a secondary entity (Tasks), API versioning, audit logging, Swagger docs, and a minimal React UI for interacting with the APIs.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Zod (validation)
- Frontend: React + Vite, react-router-dom, axios, Tailwind CSS
- Docs: Swagger (swagger-ui-express, swagger-jsdoc)

## Monorepo Structure
```
assignment/
  client/       # React UI (Login/Register, User Dashboard, Admin Console)
  server/       # Express API + RBAC + Audit logs + Swagger
  READEME.md    # This file
```

## Core Features Implemented
- User registration and login with hashed passwords and JWT cookie sessions
- RBAC: Roles are `user` and `admin`
  - Signup always creates `role: user` (no self-serve admin)
  - Admins are created via seed script or admin-only endpoint
- CRUD for Tasks entity
  - Users manage their own tasks
  - Admin can manage any user’s tasks from the Admin Console
- API versioning under `/api/v1`
- Input validation and sanitization using Zod schema validation
- Audit logging for sensitive actions (role changes removed by request), password updates, and task deletions
- Minimal React UI
  - Login and Registration
  - User Dashboard: create/list/delete tasks
  - Admin Console (hidden to users): user management, password reset, task management, audit logs
- Swagger documentation at `/api-docs`

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or hosted)

### Environment Variables (server/.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=replace_with_strong_secret

# Admin seed (used by npm run seed:admin)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123
SEED_ADMIN_NAME=Super Admin
```

### Environment Variables (client/.env)
```
VITE_BACKEND_URL=http://localhost:4000
```

### Install & Run
Open two terminals.

1) Server
```
cd server
npm install
npm run server
```

2) Client
```
cd client
npm install
npm run dev
```

### Seed First Admin
```
cd server
npm run seed:admin
```
- Promotes existing user by `SEED_ADMIN_EMAIL` to `admin`, or creates a new admin if none exists.

## API Overview (versioned)
- Base URL: `http://localhost:4000`
- Versioned prefix: `/api/v1`

### Auth
- `POST /api/v1/auth/register` → { name, email, password } → sets JWT cookie
- `POST /api/v1/auth/login` → { email, password } → sets JWT cookie
- `POST /api/v1/auth/logout` → clears JWT cookie
- `GET  /api/v1/auth/is-auth` → requires cookie; returns success if authenticated

### User (self)
- `GET /api/v1/user/data` → requires cookie; returns `{ name, role }`

### Tasks (user-scoped unless admin)
- `GET    /api/v1/tasks` → list tasks (admin sees all, user sees own)
- `POST   /api/v1/tasks` → create task { title, description }
- `GET    /api/v1/tasks/:id` → get single task (owner or admin)
- `PUT    /api/v1/tasks/:id` → update { title?, description?, status? }
- `DELETE /api/v1/tasks/:id` → delete (owner or admin)

### Admin (hidden to users; server returns 404 if not admin)
- `GET    /api/v1/admin/users` → list users with `taskCount`
- `GET    /api/v1/admin/users/:id` → user profile + tasks + counts
- `PUT    /api/v1/admin/users/:id` → update name/email
- `PUT    /api/v1/admin/users/:id/password` → change user password
- `DELETE /api/v1/admin/users/:id` → delete user + tasks
- `POST   /api/v1/admin/users/:id/tasks` → create task for user
- `PUT    /api/v1/admin/tasks/:taskId` → edit task (admin)
- `DELETE /api/v1/admin/tasks/:taskId` → delete task (admin)
- `GET    /api/v1/admin/audits` → recent audit logs
- `POST   /api/v1/admin/create-admin` → admin-only create admin

### API Documentation
- **Swagger UI**: Visit `http://localhost:4000/api-docs` for interactive API documentation
- **Postman Collection**: Import `server/postman-collection.json` for complete API testing

## Frontend UI
- Root route `/` is dynamic:
  - Admins see the Admin Console
  - Users see the Tasks dashboard
- Login at `/login`
- Admin console is not client-routed for users (and server responds 404 to admin APIs for users)

## Security Practices
- Passwords hashed with bcrypt
- JWT stored in HTTP-only cookie
- RBAC middleware checks role on each request and hides admin routes with 404 for users
- Admin role is never set via public signup
- Input validation and sanitization using Zod schemas
- Sensitive operations logged to `audit` collection

## Scalability Notes
- Modular controllers/routes and versioned API to enable adding new modules and versions
- Stateless JWT enables horizontal scaling; store sessions in a cache if migrating to opaque tokens
- Input validation/sanitization implemented with Zod schemas
- Observability: add request logging, metrics, tracing (Winston/Pino, OpenTelemetry)
- Caching: use Redis for frequently-read resources/lists
- Deployment: containerize with Docker, run behind a reverse proxy (Nginx), enable TLS, health checks, autoscaling

## Scripts
Server
```
npm run server      # dev with nodemon
npm start           # prod
npm run seed:admin  # create or promote first admin
```

Client
```
npm run dev         # start Vite dev server
npm run build       # production build
npm run preview     # preview build
```

## Notes
- Role change UI and API have been intentionally removed by request (no in-app role elevation).
- Non-admins cannot discover admin endpoints; server returns 404 for admin routes to users.



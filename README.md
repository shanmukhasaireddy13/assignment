# MERN Notes + Google SSO

This repository contains a full-stack MERN app where users authenticate via Google Single Sign-On and manage personal notes. The backend issues an HTTP-only JWT cookie after verifying the Google ID token. Users can create, list, update, and delete their notes.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Zod (validation)
- Frontend: React + Vite, react-router-dom, axios, Tailwind CSS, Google Identity Services
- Docs: Swagger (swagger-ui-express)

## Monorepo Structure
```
assignment/
  client/       # React UI (Google Sign-In, Notes)
  server/       # Express API (Google SSO verification, Notes CRUD, Swagger)
  README.md     # This file
```

## Core Features
- Google SSO via Google Identity Services (client) + token verification (server)
- JWT cookie-based sessions
- Notes CRUD (user-scoped)
- Input validation with Zod
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
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Environment Variables (client/.env)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
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

## API Overview (versioned)
- Base URL: `http://localhost:4000`
- Versioned prefix: `/api/v1`

### Auth
- `POST /api/v1/auth/google` → { idToken } → verifies Google token and sets JWT cookie
- `POST /api/v1/auth/logout` → clears JWT cookie
- `GET  /api/v1/auth/is-auth` → requires cookie; returns success if authenticated

### User (self)
- `GET /api/v1/user/data` → requires cookie; returns `{ name, role }`

### Notes (user-scoped)
- `GET    /api/v1/notes` → list current user's notes
- `POST   /api/v1/notes` → create note { content }
- `GET    /api/v1/notes/:id` → get single note (owner)
- `PUT    /api/v1/notes/:id` → update { content? }
- `DELETE /api/v1/notes/:id` → delete (owner)

### API Documentation
- **Swagger UI**: Visit `http://localhost:4000/api-docs` for interactive API documentation
- **Postman Collection**: Import `server/postman-collection.json` for complete API testing

## Frontend UI
- Root route `/`: Notes dashboard for authenticated users
- Login at `/login`: classic email/password (optional) and Google Sign-In button

## Security Practices
- Passwords hashed with bcrypt (for email/password endpoints if used)
- JWT stored in HTTP-only cookie
- Input validation and sanitization using Zod schemas

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
```

Client
```
npm run dev         # start Vite dev server
npm run build       # production build
npm run preview     # preview build
```

## Google Cloud Console
- OAuth 2.0 Client Type: Web application
- Authorized JavaScript origins:
  - `http://localhost:5173`
  - `https://your-production-domain.com`
- Authorized redirect URIs: not required for this token-based approach


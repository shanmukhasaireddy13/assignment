# Backend API Server

Express.js REST API with authentication, RBAC, and task management.

## Features
- User authentication with JWT cookies
- Role-based access control (user/admin)
- Task CRUD operations
- Admin management console APIs
- Input validation with Zod
- Audit logging
- Swagger documentation
- MongoDB with Mongoose

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- Zod for validation
- Swagger for API docs

## Environment Variables
Create `.env` file:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_here

# Admin seed script
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123
SEED_ADMIN_NAME=Super Admin
```

## Installation & Setup
```bash
npm install
npm run server  # Development with nodemon
npm start       # Production
```

## Create First Admin
```bash
npm run seed:admin
```

## API Documentation
- **Swagger UI**: Visit `http://localhost:4000/api-docs` for interactive API documentation
- **Postman Collection**: Import `postman-collection.json` for complete API testing

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /is-auth` - Check authentication status

### User (`/api/v1/user`)
- `GET /data` - Get current user data

### Tasks (`/api/v1/tasks`)
- `GET /` - List tasks (user's own, admin sees all)
- `POST /` - Create task
- `GET /:id` - Get task by ID
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task

### Admin (`/api/v1/admin`) - Admin only
- `GET /users` - List all users with task counts
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/password` - Change user password
- `DELETE /users/:id` - Delete user
- `POST /users/:id/tasks` - Create task for user
- `PUT /tasks/:taskId` - Update task (admin)
- `DELETE /tasks/:taskId` - Delete task (admin)
- `GET /audits` - Get audit logs
- `POST /create-admin` - Create new admin

## Security Features
- Password hashing with bcrypt
- JWT tokens in HTTP-only cookies
- Role-based access control
- Input validation with Zod
- Admin routes hidden from non-admins (404 response)
- Audit logging for sensitive operations

## Project Structure
```
server/
├── config/          # Database configuration
├── controllers/      # Route handlers
├── docs/           # Swagger/OpenAPI specs
├── middleware/      # Auth, validation, RBAC
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── seed/           # Database seeding scripts
└── server.js       # Entry point
```

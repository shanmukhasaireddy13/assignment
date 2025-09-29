# React Frontend Client

Modern React application with Vite for interacting with the MERN Auth API.

## Features
- User authentication (login/register)
- Protected dashboard for task management
- Admin console for user and task management
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Role-based UI rendering

## Tech Stack
- React 19 + Vite
- React Router DOM for routing
- Axios for API calls
- Tailwind CSS for styling
- React Toastify for notifications

## Environment Variables
Create `.env` file:
```
VITE_BACKEND_URL=http://localhost:4000
```

## Installation & Setup
```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

## Project Structure
```
client/
├── public/         # Static assets
├── src/
│   ├── assets/     # Images, icons
│   ├── components/ # Reusable components
│   ├── context/    # React context (auth state)
│   ├── pages/      # Page components
│   ├── App.jsx     # Main app component
│   └── main.jsx    # Entry point
├── index.html     # HTML template
└── vite.config.js # Vite configuration
```

## Pages & Features

### Authentication
- **Login Page** (`/login`) - User login and registration
- **Dynamic Root** (`/`) - Shows admin console for admins, user dashboard for users

### User Dashboard
- Task management (create, list, delete)
- User profile display
- Logout functionality

### Admin Console
- User management (view, edit, delete users)
- Password reset for users
- Task management for any user
- Audit log viewing
- Create new admin users
- Search and filter users

## Key Components

### AppContexts.jsx
- Manages authentication state
- Handles API calls with credentials
- Provides user data and auth status

### Pages
- **Home.jsx** - User dashboard with task management
- **Login.jsx** - Authentication form
- **Admin.jsx** - Comprehensive admin management interface

### Components
- **Navbar.jsx** - Navigation with user avatar and logout
- **Header.jsx** - Welcome header component

## UI/UX Features
- Responsive design (mobile-friendly)
- Clean, modern interface
- Toast notifications for feedback
- Loading states and error handling
- Role-based navigation and content
- Search and filtering capabilities

## Security
- JWT tokens handled via HTTP-only cookies
- Automatic redirects based on authentication status
- Admin routes completely hidden from regular users
- Secure API communication with backend

## Development
- Hot reload with Vite
- ESLint configuration
- Tailwind CSS for styling
- Component-based architecture

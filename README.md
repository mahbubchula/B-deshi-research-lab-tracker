# 🔬 Research Lab Activities Tracking System

A comprehensive, collaborative web application for managing research lab activities, goals, papers, team collaboration, and supervisor oversight.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎓 For Students

- **Collaborative Dashboard**
  - View all team members' goals, papers, and tasks
  - Track team activity feed in real-time
  - Aggregated statistics for the entire lab

- **Goal Management**
  - Create daily, weekly, and monthly goals
  - Track progress with visual indicators
  - Set priorities and deadlines
  - View goals assigned to you by supervisors

- **Research Paper Tracking**
  - Manage paper submissions with multiple statuses
  - Track from "In Progress" to "Published"
  - Multi-author collaboration support
  - Keyword and venue management

- **Task Management**
  - Organize tasks with priorities (Low, Medium, High, Urgent)
  - Due date tracking with overdue indicators
  - Status workflow (Pending → In Progress → Completed)
  - View tasks assigned to you

- **Personal Profile**
  - Update personal information
  - View your contribution statistics
  - Change password

### 👨‍🏫 For Professors/Supervisors/Admins

All student features PLUS:

- **Supervisor Dashboard**
  - Overview of all students and their activities
  - Aggregated statistics across the entire lab
  - Recent activity monitoring
  - Quick access to student details

- **Student Management**
  - View all registered students
  - Access individual student profiles
  - View each student's goals, papers, and tasks
  - **Delete users** with cascade delete (removes all their data)

- **Assignment Features**
  - **Assign goals** to specific students
  - **Assign tasks** to individual students
  - **Add students as co-authors** on papers
  - Track who assigned what to whom

- **Personal To-Do List** (Private)
  - Daily, weekly, monthly, and yearly to-dos
  - Completely separate from student tasks
  - Priority management
  - Statistics dashboard

- **Activity Management**
  - Collapsible activity feed (saves space)
  - **Delete individual activities**
  - Filter by type and user

- **Full Administrative Control**
  - Manage all users, goals, papers, tasks
  - Override permissions as needed
  - System-wide oversight

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **Axios** - HTTP client

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Compression** - Response compression

### DevOps
- **MongoDB Atlas** - Cloud database (Free tier)
- **Vercel** - Frontend hosting (Free)
- **Render** - Backend hosting (Free)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **MongoDB** (Atlas account or local instance)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/research-lab-tracker.git
cd research-lab-tracker
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

**Backend** - Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/research-lab
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Run Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the Application**

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
research-lab-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   ├── goal.controller.js   # Goal CRUD operations
│   │   │   ├── paper.controller.js  # Paper management
│   │   │   ├── task.controller.js   # Task management
│   │   │   ├── user.controller.js   # User management
│   │   │   ├── activity.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── personalTodo.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # JWT verification
│   │   ├── models/
│   │   │   ├── User.model.js        # User schema
│   │   │   ├── Goal.model.js        # Goal schema
│   │   │   ├── Paper.model.js       # Paper schema
│   │   │   ├── Task.model.js        # Task schema
│   │   │   ├── Activity.model.js
│   │   │   ├── Notification.model.js
│   │   │   └── PersonalTodo.model.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── goal.routes.js
│   │       ├── paper.routes.js
│   │       ├── task.routes.js
│   │       ├── user.routes.js
│   │       ├── activity.routes.js
│   │       ├── dashboard.routes.js
│   │       ├── notification.routes.js
│   │       └── personalTodo.routes.js
│   ├── test-database.js             # Database testing script
│   ├── package.json
│   └── server.js                     # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Main layout with sidebar
│   │   │   └── UserSelector.jsx      # Student assignment component
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CollaborativeDashboard.jsx  # Main dashboard
│   │   │   ├── Goals.jsx
│   │   │   ├── Papers.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SupervisorDashboard.jsx     # Supervisor overview
│   │   │   ├── SupervisorStudents.jsx      # Student management
│   │   │   ├── StudentDetail.jsx           # Individual student view
│   │   │   └── PersonalTodos.jsx           # Supervisor to-do list
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   ├── store/
│   │   │   └── authStore.js          # Zustand auth store
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
├── CRITICAL_ISSUES_STATUS.md         # Security & issues review
├── ARCHITECTURE.md
├── FEATURES.md
└── README.md                          # This file
```

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user
PUT    /api/auth/profile           # Update profile
PUT    /api/auth/change-password   # Change password
```

### Goal Endpoints

```
GET    /api/goals                  # Get all goals (collaborative)
GET    /api/goals/:id              # Get single goal
POST   /api/goals                  # Create goal (with assignment)
PUT    /api/goals/:id              # Update goal
DELETE /api/goals/:id              # Delete goal
GET    /api/goals/stats            # Get goal statistics
```

### Paper Endpoints

```
GET    /api/papers                 # Get all papers (collaborative)
GET    /api/papers/:id             # Get single paper
POST   /api/papers                 # Create paper (with co-authors)
PUT    /api/papers/:id             # Update paper
DELETE /api/papers/:id             # Delete paper
```

### Task Endpoints

```
GET    /api/tasks                  # Get all tasks (collaborative)
GET    /api/tasks/:id              # Get single task
POST   /api/tasks                  # Create task (with assignment)
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
```

### Dashboard Endpoints

```
GET    /api/dashboard              # Get collaborative dashboard
GET    /api/dashboard/personal     # Get personal dashboard
```

### User Management (Supervisor Only)

```
GET    /api/users                  # Get all users
GET    /api/users/:id              # Get user details
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user (cascade)
GET    /api/users/:id/goals        # Get user's goals
GET    /api/users/:id/papers       # Get user's papers
GET    /api/users/:id/tasks        # Get user's tasks
```

### Supervisor Endpoints

```
GET    /api/users/supervisor/dashboard   # Supervisor overview
GET    /api/users/supervisor/activities  # All activities
```

### Personal To-Do (Supervisor Only)

```
GET    /api/personal-todos         # Get personal to-dos
GET    /api/personal-todos/:id     # Get single to-do
POST   /api/personal-todos         # Create to-do
PUT    /api/personal-todos/:id     # Update to-do
DELETE /api/personal-todos/:id     # Delete to-do
GET    /api/personal-todos/stats   # Get statistics
```

### Activity Endpoints

```
GET    /api/activities             # Get activities
GET    /api/activities/:id         # Get single activity
DELETE /api/activities/:id         # Delete activity (supervisor)
DELETE /api/activities             # Clear all activities (supervisor)
```

---

## 🌐 Deployment

### MongoDB Atlas Setup

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create database user with password
4. Whitelist IP addresses:
   - For development: `0.0.0.0/0`
   - For production: Your server IPs
5. Get connection string and add to `.env`

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) and create account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `research-lab-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables from your `.env`
7. Click "Create Web Service"

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and create account
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
7. Click "Deploy"

---

## 👥 Default Users

After setup, you can register new users with different roles:

### Registration Options
- **Student** - Basic access to goals, papers, tasks
- **Professor** - Supervisor access + personal to-do list
- **Admin** - Full system access

**Important**: The first registered user with role `admin` will have full privileges.

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with middleware
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation on models
- ✅ Cascade delete (prevents orphaned data)

---

## 🧪 Testing

### Database Testing

```bash
cd backend
npm run test-db
```

This will:
- Connect to your MongoDB
- Show all users, goals, papers, tasks
- Display statistics and data ownership

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with React, Node.js, and MongoDB
- Icons by [Lucide](https://lucide.dev/)
- UI styled with [TailwindCSS](https://tailwindcss.com/)

---

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

## 🎯 Roadmap

- [ ] Email notifications for task assignments
- [ ] Deadline reminders
- [ ] Export data to CSV/PDF
- [ ] Comment system UI
- [ ] Pagination for large datasets
- [ ] Real-time updates with WebSockets
- [ ] File attachment support
- [ ] Advanced analytics dashboard

---

**Made with ❤️ for Research Labs**

# Research Lab Activities Tracking System
## Project Structure & Architecture

```
research-lab-tracker/
│
├── 📄 README.md                    # Project overview
├── 📄 SETUP_GUIDE.md               # Complete setup instructions
├── 📄 FEATURES.md                  # Feature documentation
├── 🔧 setup.sh                     # Quick start script
├── 📄 .gitignore                   # Git ignore rules
├── 📄 research-lab-tracker.code-workspace  # VS Code workspace
│
├── 🔙 backend/                     # Node.js + Express Backend
│   ├── 📦 package.json
│   ├── 🚀 server.js               # Entry point
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.js        # MongoDB connection
│   │   │
│   │   ├── 📁 models/             # Database schemas
│   │   │   ├── User.model.js      # User with roles
│   │   │   ├── Goal.model.js      # Daily/Weekly/Monthly goals
│   │   │   ├── Paper.model.js     # Research papers
│   │   │   ├── Task.model.js      # Assignments
│   │   │   ├── Activity.model.js  # Activity tracking
│   │   │   └── Notification.model.js
│   │   │
│   │   ├── 📁 controllers/        # Business logic
│   │   │   ├── auth.controller.js # Login, register, profile
│   │   │   └── goal.controller.js # Goal CRUD operations
│   │   │
│   │   ├── 📁 routes/             # API endpoints
│   │   │   ├── auth.routes.js     # /api/auth/*
│   │   │   ├── goal.routes.js     # /api/goals/*
│   │   │   ├── paper.routes.js    # /api/papers/*
│   │   │   ├── task.routes.js     # /api/tasks/*
│   │   │   ├── activity.routes.js # /api/activities/*
│   │   │   ├── user.routes.js     # /api/users/*
│   │   │   └── notification.routes.js
│   │   │
│   │   └── 📁 middleware/
│   │       └── auth.middleware.js # JWT verification, authorization
│   │
│   └── 📄 .env.example            # Environment template
│
└── 🎨 frontend/                    # React + Vite Frontend
    ├── 📦 package.json
    ├── ⚙️ vite.config.js
    ├── ⚙️ tailwind.config.js      # UI styling config
    ├── 📄 index.html              # Entry HTML
    │
    └── 📁 src/
        ├── 🚀 main.jsx            # React entry point
        ├── 📱 App.jsx             # Main app component
        ├── 🎨 index.css           # Global styles + Tailwind
        │
        ├── 📁 pages/              # Page components
        │   ├── Login.jsx          # 🔐 Login page
        │   ├── Register.jsx       # 📝 Registration
        │   ├── Dashboard.jsx      # 📊 Main dashboard
        │   ├── Goals.jsx          # 🎯 Goals management
        │   ├── Papers.jsx         # 📄 Paper tracking
        │   ├── Tasks.jsx          # ✅ Task management
        │   └── Profile.jsx        # 👤 User profile
        │
        ├── 📁 components/
        │   └── Layout.jsx         # 🏗️ Sidebar + navigation
        │
        ├── 📁 store/
        │   └── authStore.js       # 💾 Zustand state management
        │
        └── 📁 services/
            └── api.js             # 🌐 API client + methods

```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                      (localhost:5173)                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages     │  │  Components  │  │    Store     │       │
│  │  (Views)    │  │  (Reusable)  │  │  (Zustand)   │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                           ▲                                  │
│                           │                                  │
│                    ┌──────┴───────┐                         │
│                    │  API Client  │                         │
│                    │  (Axios)     │                         │
│                    └──────┬───────┘                         │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP/JSON
                             │ JWT Token
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXPRESS.JS BACKEND                           │
│                  (localhost:5000)                            │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │            MIDDLEWARE LAYER                   │          │
│  │  • CORS         • Helmet      • Compression  │          │
│  │  • Auth Check   • Validation                 │          │
│  └────────────────┬─────────────────────────────┘          │
│                   │                                          │
│  ┌────────────────▼────────────────────────────┐           │
│  │               ROUTES                         │           │
│  │  /api/auth  /api/goals  /api/papers         │           │
│  │  /api/tasks /api/activities                 │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼────────────────────────────┐           │
│  │            CONTROLLERS                       │           │
│  │  • Business Logic                           │           │
│  │  • Request/Response Handling                │           │
│  └────────────────┬─────────────────────────────┘           │
│                   │                                          │
│  ┌────────────────▼────────────────────────────┐           │
│  │              MODELS                          │           │
│  │  • Data Schemas                             │           │
│  │  • Validation Rules                         │           │
│  └────────────────┬─────────────────────────────┘           │
└────────────────────┼──────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB ATLAS                              │
│                   (Cloud Database)                           │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   users     │  │   goals     │  │   papers    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   tasks     │  │ activities  │  │notifications│        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example: Creating a Goal

```
1. User fills goal form → 2. Frontend validates
         ↓
3. API call: POST /api/goals with JWT token
         ↓
4. Backend middleware verifies token
         ↓
5. Controller receives request
         ↓
6. Model validates data
         ↓
7. MongoDB saves goal
         ↓
8. Activity log created
         ↓
9. Response sent to frontend
         ↓
10. UI updates with new goal
         ↓
11. Toast notification shows success
```

## 🎯 Tech Stack Breakdown

### Frontend Stack
- **React 18**: UI library
- **Vite**: Build tool (fast!)
- **TailwindCSS**: Utility-first styling
- **Zustand**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **date-fns**: Date formatting
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

### Backend Stack
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin requests
- **Morgan**: Request logging
- **Compression**: Response compression

### Deployment Stack
- **Render**: Backend hosting (Free)
- **Vercel**: Frontend hosting (Free)
- **MongoDB Atlas**: Database (Free M0 tier)
- **GitHub**: Version control

## 📊 Database Schema Overview

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'professor' | 'admin',
  department: String,
  labGroup: String,
  supervisor: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Goals Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  description: String,
  type: 'daily' | 'weekly' | 'monthly',
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high',
  progress: Number (0-100),
  startDate: Date,
  endDate: Date,
  completedAt: Date,
  isPrivate: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Papers Collection
```javascript
{
  _id: ObjectId,
  title: String,
  authors: [{
    user: ObjectId,
    name: String,
    role: 'lead' | 'co-author' | 'contributor'
  }],
  abstract: String,
  status: 'in-progress' | 'submitted' | 'under-review' | 'accepted' | 'published',
  venue: { name: String, type: String },
  submissionDate: Date,
  versions: [{ version: Number, fileUrl: String, notes: String }],
  comments: [{ user: ObjectId, text: String, createdAt: Date }],
  keywords: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  assignedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  status: 'pending' | 'in-progress' | 'review' | 'completed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate: Date,
  relatedPaper: ObjectId (ref: Paper),
  comments: [{ user: ObjectId, text: String }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

```
Registration:
User → Submit form → Backend validates → Hash password → 
Save to DB → Return success

Login:
User → Submit credentials → Backend finds user → 
Compare passwords → Generate JWT → Return token + user data

Authenticated Request:
User → Request with token → Middleware verifies → 
Controller processes → Response
```

## 🎨 UI Component Hierarchy

```
App
├── Login (Public)
├── Register (Public)
└── Layout (Protected)
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Links
    │   └── User Profile
    ├── Header
    │   ├── Welcome Message
    │   └── Notifications
    └── Content
        ├── Dashboard
        ├── Goals
        ├── Papers
        ├── Tasks
        └── Profile
```

This structure provides maximum flexibility for your 7-8 member lab! 🚀

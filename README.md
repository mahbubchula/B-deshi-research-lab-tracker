# Research Lab Activities Tracking System

A comprehensive web application for managing research lab activities, goals, papers, and team collaboration.

## Features

### For Students
- Personal dashboard with activity timeline
- Daily/Weekly/Monthly goal tracking
- Paper submission tracking with status updates
- Task management with deadlines
- Collaborative workspace
- Progress analytics

### For Professors/Admins
- Overview of all lab members' activities
- Assign tasks to students
- Track paper submissions and reviews
- Private workspace for personal academic work
- Team performance analytics
- Notification system

## Tech Stack

- **Frontend**: React with Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Free tier - MongoDB Atlas)
- **Authentication**: JWT
- **Hosting**: 
  - Frontend: Vercel (Free)
  - Backend: Render (Free)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Git

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd research-lab-tracker
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup

Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## Project Structure

```
research-lab-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── index.html
└── README.md
```

## Deployment

### MongoDB Atlas Setup
1. Create free account at mongodb.com/cloud/atlas
2. Create cluster (M0 Free tier)
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string

### Backend Deployment (Render)
1. Push code to GitHub
2. Create new Web Service on render.com
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project on vercel.com
3. Set environment variables
4. Deploy

## Default Admin Account

**Email**: admin@lab.com
**Password**: admin123

⚠️ Change this immediately after first login!

## License

MIT

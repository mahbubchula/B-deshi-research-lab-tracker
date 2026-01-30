# Research Lab Activities Tracking System - Complete Setup Guide

## 🎯 Overview
This is a full-stack web application for managing research lab activities with 7-8 team members. It's completely free to deploy and use.

## 📋 Prerequisites
- Node.js 18+ installed
- VS Code (or any code editor)
- Git installed
- Free MongoDB Atlas account
- Free Render account (for backend)
- Free Vercel account (for frontend)

## 🚀 Local Development Setup

### Step 1: Clone and Open in VS Code

```bash
# If you have this as a folder
cd research-lab-tracker
code .

# Open two terminals in VS Code (Terminal > New Terminal)
```

### Step 2: MongoDB Setup (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a new cluster (M0 Free tier)
4. Click "Database Access" → Add New Database User
   - Username: labadmin
   - Password: (generate strong password)
5. Click "Network Access" → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Click "Database" → Connect → Connect your application
7. Copy the connection string (looks like: mongodb+srv://labadmin:password@cluster.mongodb.net/)

### Step 3: Backend Setup

**Terminal 1 - Backend:**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb+srv://labadmin:YOUR_PASSWORD@cluster.mongodb.net/research-lab?retryWrites=true&w=majority
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

# Replace YOUR_PASSWORD with your actual MongoDB password

# Start development server
npm run dev
```

You should see: "✅ MongoDB Connected" and "🚀 Server running on port 5000"

### Step 4: Frontend Setup

**Terminal 2 - Frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

You should see: "Local: http://localhost:5173"

### Step 5: Access the Application

1. Open browser: http://localhost:5173
2. Click "Register here"
3. Create first account (this will be admin)
4. Login and start using!

## 👥 Adding Team Members

### Option 1: Manual Registration
1. Share the URL with team members
2. They click "Register" and create accounts
3. All new users are students by default

### Option 2: Admin Creation
To create a professor/admin account, use MongoDB Compass or Atlas:
1. Find the user in the `users` collection
2. Change `role` field from "student" to "professor" or "admin"

## 🌐 Free Deployment (Production)

### Deploy Backend to Render (10 minutes)

1. Push code to GitHub:
```bash
cd research-lab-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to https://render.com
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your repository
6. Configure:
   - Name: research-lab-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

7. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_generated_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

8. Click "Create Web Service"
9. Wait 5-10 minutes for deployment
10. Copy your backend URL (e.g., https://research-lab-backend.onrender.com)

### Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist

6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app is live! 🎉

## 📱 Accessing Your Deployed App

1. Vercel will give you a URL like: https://research-lab-tracker.vercel.app
2. Share this URL with your 7-8 team members
3. They can access it from any device with internet

## 🔒 Security Notes

1. **Change Default Admin Password**
   - First user created should change password immediately
   - Go to Profile → Security Settings

2. **MongoDB Security**
   - Create strong passwords
   - In production, whitelist specific IPs instead of 0.0.0.0/0

3. **Environment Variables**
   - Never commit .env files to Git
   - Use strong, unique JWT_SECRET

## 💾 Data Backup

### Automatic Backups (Free on Render)
Render automatically backs up your MongoDB Atlas data.

### Manual Backup
```bash
# Using MongoDB Compass
# Connect to your cluster
# Click "Collection" → "Export Collection" → "Export to JSON"
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure all environment variables are set
- Check if port 5000 is available

### Frontend can't connect to backend
- Check VITE_API_URL in frontend .env
- Verify backend is running (visit http://localhost:5000/health)
- Check CORS settings in backend

### Database connection fails
- Verify MongoDB username and password
- Check network access settings (whitelist IP)
- Ensure cluster is active

## 📊 Usage Statistics

**Free Tier Limits:**
- MongoDB Atlas: 512MB storage (handles ~100,000 documents)
- Render: 750 hours/month (enough for 24/7 operation)
- Vercel: Unlimited deployments, 100GB bandwidth/month

**For 7-8 users:** These limits are more than sufficient!

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Add Features
- Backend: Add routes in `backend/src/routes/`
- Frontend: Add pages in `frontend/src/pages/`
- Models: Add schemas in `backend/src/models/`

## 📞 Support

For issues:
1. Check this guide first
2. Review error messages in browser console (F12)
3. Check backend logs in terminal or Render dashboard
4. Verify all environment variables are set correctly

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend running locally
- [ ] Frontend running locally
- [ ] Can register and login
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Team members can access deployed app
- [ ] Admin account created and secured

Congratulations! Your Research Lab Tracker is now live! 🎉

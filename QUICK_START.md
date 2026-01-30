# 🚀 QUICK START - Research Lab Tracker

## ⚡ 5-Minute Setup (Local Development)

### Step 1: Get MongoDB (2 minutes)
1. Go to https://mongodb.com/cloud/atlas
2. Sign up → Create Cluster (M0 Free)
3. Database Access → Add User (username: labadmin)
4. Network Access → Allow All IPs (0.0.0.0/0)
5. Connect → Copy connection string

### Step 2: Setup Project (3 minutes)
```bash
# Open project in VS Code
code research-lab-tracker

# Run quick setup (installs dependencies)
chmod +x setup.sh
./setup.sh

# Edit backend/.env - add your MongoDB string
# MONGODB_URI=mongodb+srv://labadmin:PASSWORD@cluster.mongodb.net/research-lab

# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend  
cd frontend && npm run dev

# Open: http://localhost:5173
```

## 🎯 First Time Use

1. **Register**: Create your account (first user is admin)
2. **Login**: Use your credentials
3. **Create Goal**: Click "New Goal" on dashboard
4. **Add Team**: Share URL with 7-8 lab members

## 📁 Project Files Overview

```
research-lab-tracker/
├── README.md              # Main documentation
├── SETUP_GUIDE.md         # Detailed setup (READ THIS!)
├── FEATURES.md            # What's included
├── ARCHITECTURE.md        # Technical details
├── setup.sh               # Auto-setup script
│
├── backend/               # Server code
│   ├── server.js         # Start here to understand backend
│   ├── src/models/       # Database schemas
│   ├── src/controllers/  # Business logic
│   └── src/routes/       # API endpoints
│
└── frontend/             # Client code
    ├── src/App.jsx       # Start here to understand frontend
    ├── src/pages/        # All pages
    └── src/components/   # Reusable components
```

## 🔥 Essential Commands

### Development
```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start dev server (port 5000)
npm start               # Start production

# Frontend
cd frontend
npm install             # Install dependencies
npm run dev            # Start dev server (port 5173)
npm run build          # Build for production
```

### Quick Tests
```bash
# Test backend is running
curl http://localhost:5000/health

# Test MongoDB connection
# Login to app and create a goal
```

## 🌐 Free Deployment

### Backend → Render.com (10 min)
1. Push to GitHub
2. render.com → New Web Service
3. Connect repo, select backend/
4. Add environment variables
5. Deploy!

### Frontend → Vercel.com (5 min)
1. vercel.com → New Project
2. Import from GitHub
3. Root: frontend/
4. Add VITE_API_URL
5. Deploy!

## 🎨 Customization

### Change Colors
`frontend/tailwind.config.js` → Line 10-20

### Add Features
- Backend: Create controller in `backend/src/controllers/`
- Frontend: Create page in `frontend/src/pages/`
- Database: Add model in `backend/src/models/`

### Modify UI
- Layout: `frontend/src/components/Layout.jsx`
- Styling: `frontend/src/index.css`

## 📊 Default Accounts

**After first registration:**
- Email: Your email
- Role: Student (change to admin/professor in MongoDB)

**Demo Login:**
- Email: admin@lab.com
- Password: admin123
(Only works if you seed the database)

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Check MONGODB_URI in backend/.env
- Verify MongoDB cluster is active
- Check whitelist IPs (use 0.0.0.0/0)

### "CORS error"
- Check FRONTEND_URL in backend/.env
- Restart backend server

### "Page not found"
- Backend: Check server running on port 5000
- Frontend: Check server running on port 5173

### "Cannot register/login"
- Check MongoDB connection
- View backend console for errors
- Check browser console (F12)

## 📞 Need Help?

1. **Read SETUP_GUIDE.md** - Comprehensive guide
2. **Check FEATURES.md** - What's implemented
3. **Review ARCHITECTURE.md** - How it works
4. **Browser Console** - Press F12, check for errors
5. **Backend Logs** - Check terminal running backend

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Dependencies installed (backend & frontend)
- [ ] .env files configured
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can create a goal
- [ ] Dashboard shows statistics

## 🎉 You're Ready!

Your Research Lab Tracker is set up and running!

**Next Steps:**
1. Customize colors and branding
2. Invite your 7-8 team members
3. Create your first project goals
4. Start tracking papers and tasks

**For Production:**
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Update team with new URL
4. Start using in your lab!

---

Made with ❤️ for research labs

Total Setup Time: ~15 minutes
Cost: $0 (Free tier)
Team Size: 7-8 members perfect!

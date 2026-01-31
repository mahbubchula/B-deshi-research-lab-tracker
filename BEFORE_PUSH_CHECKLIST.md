# ✅ Before Push Checklist

Complete this checklist before pushing to GitHub.

---

## 📋 Quick Checklist

- [ ] **1. All features working** - Test the application
- [ ] **2. No .env in commits** - Verify sensitive files excluded
- [ ] **3. README updated** - Documentation is current
- [ ] **4. Dependencies installed** - Both frontend and backend
- [ ] **5. No console errors** - Clean browser console
- [ ] **6. Git initialized** - Repository ready

---

## 🧪 Testing Checklist

### Backend Testing

```bash
cd backend

# Check if server starts
npm run dev

# Should see:
# ✓ Server running on port 5000
# ✓ Database connected
```

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] No deprecation warnings

### Frontend Testing

```bash
cd frontend

# Check if frontend starts
npm run dev

# Should see:
# ✓ VITE ready
# ✓ Local: http://localhost:5173
```

- [ ] Frontend starts without errors
- [ ] No build warnings
- [ ] All pages load correctly

### Feature Testing

**As Student:**
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can view collaborative dashboard
- [ ] Can create/edit/delete goals
- [ ] Can create/edit/delete papers
- [ ] Can create/edit/delete tasks
- [ ] Can see other team members' work
- [ ] Can update profile

**As Supervisor:**
- [ ] All student features work
- [ ] Can access Supervisor Dashboard
- [ ] Can view all students
- [ ] Can view individual student details
- [ ] Can delete users
- [ ] Can assign goals to students
- [ ] Can assign tasks to students
- [ ] Can add co-authors to papers
- [ ] Can access Personal To-Dos
- [ ] Can create daily/weekly/monthly/yearly to-dos
- [ ] Can show/hide activities
- [ ] Can delete activities

---

## 🔒 Security Checklist

### Environment Files

```bash
# Verify .env files exist locally
ls backend/.env
ls frontend/.env

# Verify .env is in .gitignore
cat .gitignore | grep ".env"
```

- [ ] `backend/.env` exists (NOT to be pushed)
- [ ] `frontend/.env` exists (NOT to be pushed)
- [ ] `backend/.env.example` exists (WILL be pushed)
- [ ] `frontend/.env.example` exists (WILL be pushed)
- [ ] `.env` is in `.gitignore`

### Sensitive Data Check

```bash
# Search for potential secrets in code
grep -r "mongodb+srv://" backend/src/ frontend/src/ || echo "Clean"
grep -r "JWT_SECRET" backend/src/ frontend/src/ || echo "Clean"
```

- [ ] No hardcoded MongoDB URIs
- [ ] No hardcoded JWT secrets
- [ ] No API keys in code
- [ ] No passwords in code

---

## 📁 File Structure Checklist

### Required Files Present

- [ ] `README.md` (comprehensive)
- [ ] `.gitignore` (up to date)
- [ ] `backend/.env.example`
- [ ] `frontend/.env.example`
- [ ] `backend/package.json`
- [ ] `frontend/package.json`
- [ ] `backend/server.js`
- [ ] `frontend/src/App.jsx`

### Documentation Files

- [ ] `GITHUB_PUSH_GUIDE.md`
- [ ] `COMPLETE_FEATURES_LIST.md`
- [ ] `CRITICAL_ISSUES_STATUS.md`
- [ ] `ARCHITECTURE.md` (if exists)
- [ ] `FEATURES.md` (if exists)

### Files NOT to Push

Verify these are in `.gitignore`:

- [ ] `node_modules/`
- [ ] `backend/.env`
- [ ] `frontend/.env`
- [ ] `backend/dist/`
- [ ] `frontend/dist/`
- [ ] `*.log`
- [ ] `.DS_Store`
- [ ] `.vscode/` or `.idea/`

---

## 🎯 Code Quality Checklist

### Backend

- [ ] No `console.log` in production code (except intentional logging)
- [ ] All routes have proper authentication
- [ ] All controllers have error handling
- [ ] All models have validation
- [ ] No unused imports
- [ ] No commented-out code (remove it)

### Frontend

- [ ] No `console.log` in production code
- [ ] All API calls have error handling
- [ ] All forms have validation
- [ ] No unused components
- [ ] No unused imports
- [ ] No commented-out code (remove it)

---

## 📦 Dependencies Checklist

### Backend Dependencies

```bash
cd backend
npm list --depth=0
```

**Required packages installed:**
- [ ] express
- [ ] mongoose
- [ ] dotenv
- [ ] cors
- [ ] helmet
- [ ] bcryptjs
- [ ] jsonwebtoken
- [ ] morgan
- [ ] compression

### Frontend Dependencies

```bash
cd frontend
npm list --depth=0
```

**Required packages installed:**
- [ ] react
- [ ] react-dom
- [ ] react-router-dom
- [ ] axios
- [ ] zustand
- [ ] react-hot-toast
- [ ] lucide-react
- [ ] date-fns
- [ ] tailwindcss

---

## 🚀 Build Checklist

### Test Production Build

```bash
# Backend
cd backend
npm install
npm start  # Should work without errors

# Frontend
cd frontend
npm install
npm run build  # Should build successfully
npm run preview  # Should serve built files
```

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] No build errors or warnings
- [ ] Production build works

---

## 📝 Git Checklist

### Git Status

```bash
cd D:\research-lab-tracker-complete
git status
```

**Verify:**
- [ ] Only intended files are staged
- [ ] No `.env` files in staging
- [ ] No `node_modules/` in staging
- [ ] `.env.example` files ARE staged

### Git Configuration

```bash
git config user.name
git config user.email
```

- [ ] Git username is set
- [ ] Git email is set
- [ ] Using correct GitHub account

---

## 🌐 README Checklist

Review `README.md`:

- [ ] Title and description are clear
- [ ] All features listed
- [ ] Tech stack documented
- [ ] Installation steps are correct
- [ ] Environment variable examples provided
- [ ] API documentation included
- [ ] Deployment instructions present
- [ ] Contact/support information added
- [ ] License specified
- [ ] Badges display correctly
- [ ] Links work (if any)

---

## 🔄 Final Checks

### Commands to Run

```bash
# 1. Clean install and test
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev  # Ctrl+C to stop

cd ../frontend
rm -rf node_modules package-lock.json
npm install
npm run dev  # Ctrl+C to stop

# 2. Check git status
git status

# 3. Review changes
git diff

# 4. Check .gitignore
cat .gitignore
```

### Final Verification

- [ ] Application runs with fresh install
- [ ] All features tested and working
- [ ] No errors in console
- [ ] Git status shows only intended files
- [ ] `.gitignore` is correct
- [ ] All documentation is up to date

---

## ✅ Ready to Push!

If all items are checked, you're ready to push to GitHub!

### Next Steps:

1. **Follow**: `GITHUB_PUSH_GUIDE.md`
2. **Push your code**
3. **Verify on GitHub**
4. **Deploy (optional)**

---

## 🚨 If Something's Wrong

### Problems Found?

**Fix Before Pushing:**

1. **Environment file committed**:
   ```bash
   git rm --cached backend/.env frontend/.env
   git commit -m "chore: Remove .env files"
   ```

2. **node_modules committed**:
   ```bash
   git rm -r --cached node_modules
   git commit -m "chore: Remove node_modules"
   ```

3. **Errors in code**:
   - Fix the errors
   - Test again
   - Then push

---

**Good luck with your push! 🚀**

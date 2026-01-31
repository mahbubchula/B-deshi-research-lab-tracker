# 🔧 TROUBLESHOOTING GUIDE - Research Lab Tracker

## ❌ Problem: Dashboard Shows 0 for Everything

### Step 1: Test Database Connection

```bash
cd D:\research-lab-tracker-complete\backend
npm run test-db
```

This will show you:
- ✅ If MongoDB is connected
- ✅ How many users, goals, papers, tasks are in database
- ✅ Sample data from each collection
- ✅ What data exists for specific users

### Step 2: Interpret Test Results

#### If you see "NO USERS FOUND":
```
❌ Problem: No users in database
✅ Solution: Create user accounts
   1. Go to http://localhost:5173/register
   2. Create supervisor account (role: professor)
   3. Create student accounts (role: student)
```

#### If you see "NO GOALS/PAPERS/TASKS FOUND":
```
❌ Problem: Database is empty
✅ Solution: Create data as a student
   1. Login as student
   2. Create 2-3 goals
   3. Create 1-2 papers
   4. Create 2-3 tasks
   5. Refresh dashboard
```

#### If you see data BUT dashboard shows 0:
```
❌ Problem: Frontend not fetching data properly
✅ Solution: Check browser console
   1. Open browser DevTools (F12)
   2. Go to Console tab
   3. Look for errors in red
   4. Check Network tab for failed API calls
```

---

## 🧪 Step-by-Step Testing Process

### Test 1: Backend Server Running

**Check:**
```bash
cd D:\research-lab-tracker-complete\backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Environment: development
✅ MongoDB connected
```

**If you see errors:**
- Check if .env file exists in backend folder
- Verify MONGODB_URI in .env is correct
- Check internet connection

---

### Test 2: Frontend Server Running

**Check:**
```bash
cd D:\research-lab-tracker-complete\frontend
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5173/
```

**If you see errors:**
- Run `npm install` first
- Check if .env file exists in frontend folder
- Verify VITE_API_URL=/api in .env

---

### Test 3: Create Test Data

#### As Student:

1. **Register/Login:**
   - Email: test@student.com
   - Password: test123
   - Role: Student

2. **Create Goals:**
   ```
   Goal 1:
   - Title: "Complete Literature Review"
   - Type: Weekly
   - Priority: High
   - Start Date: Today
   - End Date: +7 days
   - Progress: 30%
   - Status: In Progress

   Goal 2:
   - Title: "Write Research Proposal"
   - Type: Monthly
   - Priority: High
   - Start Date: Today
   - End Date: +30 days
   - Progress: 10%
   - Status: In Progress
   ```

3. **Create Papers:**
   ```
   Paper 1:
   - Title: "Deep Learning Research"
   - Abstract: "This paper explores..."
   - Status: In Progress
   - Venue Type: Conference
   - Venue Name: "NeurIPS 2024"
   - Keywords: "deep learning, ML"
   ```

4. **Create Tasks:**
   ```
   Task 1:
   - Title: "Implement neural network"
   - Description: "Build the architecture"
   - Priority: High
   - Due Date: +7 days
   - Status: Pending
   ```

5. **Check Dashboard:**
   - Dashboard should now show:
     - Active Goals: 2
     - Pending Tasks: 1
     - Papers in Progress: 1
     - Activity log: 4 activities

---

### Test 4: Browser Console Check

1. **Open DevTools (F12)**

2. **Go to Console Tab**

**You should see logs like:**
```
Fetching dashboard data...
API Responses: { goals: {...}, tasks: {...}, papers: {...}, activities: {...} }
Calculated stats: { goalStats: {...}, taskStats: {...}, paperStats: {...} }
```

**If you see errors:**
- Red text indicates problems
- Common errors:
  - `401 Unauthorized` → Login again
  - `404 Not Found` → Backend not running
  - `Network Error` → Check backend URL
  - `CORS Error` → Check backend CORS settings

3. **Go to Network Tab**

**Check API calls:**
- Filter by "Fetch/XHR"
- Look for calls to:
  - `/api/goals`
  - `/api/papers`
  - `/api/tasks`
  - `/api/activities`

**Each should return:**
```json
{
  "success": true,
  "count": X,
  "data": [...]
}
```

---

### Test 5: Check API Directly

**Open these URLs in browser (while logged in):**

```
http://localhost:5000/api/goals
http://localhost:5000/api/papers
http://localhost:5000/api/tasks
http://localhost:5000/api/activities
```

**Each should show JSON response with your data**

**If you see "Unauthorized":**
- You need to be logged in
- Or test via frontend

---

## 🔍 Common Problems & Solutions

### Problem 1: "Dashboard shows 0 but data exists in database"

**Possible Causes:**
1. Data belongs to different user
2. API calls failing silently
3. Frontend not parsing response correctly

**Solution:**
```bash
# 1. Run database test
cd backend
npm run test-db

# 2. Check which user owns the data
# 3. Login as that user
# 4. Check browser console for errors
```

---

### Problem 2: "Activities log is empty"

**Cause:** No activities created yet

**Solution:**
1. Create a goal (activity will be logged)
2. Edit a goal (activity will be logged)
3. Delete a goal (activity will be logged)
4. Refresh dashboard

**If still empty:**
- Check `/api/activities` endpoint
- Verify activity.controller.js exists
- Check backend logs for errors

---

### Problem 3: "Can't see students as supervisor"

**Cause:** Not logged in as professor/admin

**Solution:**
1. Check your user role:
   ```bash
   cd backend
   npm run test-db
   # Look at Users section - check your role
   ```

2. If role is "student", you need a professor account:
   - Register new account with role: Professor
   - OR update existing account in MongoDB

---

### Problem 4: "Papers not saving"

**Cause:** Author field issues

**Solution:**
- This was fixed in the latest update
- Make sure you have latest code
- Check backend logs for errors
- Verify paper.controller.js has proper author handling

---

### Problem 5: "MongoDB not connecting"

**Error:** `MongooseError: Unable to connect`

**Solution:**
1. Check internet connection
2. Verify .env file exists:
   ```bash
   cd backend
   ls .env  # Should exist
   ```

3. Check MONGODB_URI format:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

4. Test connection:
   ```bash
   npm run test-db
   ```

---

## 🧪 Verification Checklist

Run through this checklist:

### Backend:
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] `/api/goals` returns data (if goals exist)
- [ ] `/api/papers` returns data (if papers exist)
- [ ] `/api/tasks` returns data (if tasks exist)
- [ ] `/api/activities` returns data (if activities exist)

### Frontend:
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can register new user
- [ ] Can login
- [ ] Can create goal → Shows in list
- [ ] Can create paper → Shows in list
- [ ] Can create task → Shows in list
- [ ] Dashboard updates after creating items

### Database:
- [ ] Run `npm run test-db` → Shows data
- [ ] Users exist in database
- [ ] Goals exist (if created)
- [ ] Papers exist (if created)
- [ ] Tasks exist (if created)
- [ ] Activities exist (if actions performed)

### Browser:
- [ ] No errors in console
- [ ] API calls succeed (200 OK)
- [ ] Data appears in Network tab responses
- [ ] Dashboard shows correct numbers

---

## 🎯 Quick Fix Commands

### Reset and Start Fresh:

```bash
# Stop both servers (Ctrl+C)

# Backend
cd D:\research-lab-tracker-complete\backend
npm install
npm run test-db  # Check database
npm start        # Start server

# Frontend (in new terminal)
cd D:\research-lab-tracker-complete\frontend
npm install
npm run dev      # Start dev server

# Open browser
http://localhost:5173
```

### If Dashboard Still Shows 0:

```bash
# 1. Check database
cd backend
npm run test-db

# 2. If NO DATA found:
#    - Register accounts
#    - Login as student
#    - Create goals, papers, tasks

# 3. If DATA EXISTS:
#    - Open browser console (F12)
#    - Look for errors
#    - Check Network tab for API calls
#    - Verify you're logged in as correct user
```

---

## 📞 Debug Information to Collect

If dashboard still doesn't work, collect this information:

### 1. Database Test Output:
```bash
cd backend
npm run test-db > database-test.txt
```

### 2. Browser Console Output:
- F12 → Console → Copy all logs
- F12 → Network → Filter "Fetch/XHR" → Screenshot

### 3. Backend Logs:
- Terminal output from `npm start`
- Any errors or warnings

### 4. Version Check:
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

---

## ✅ Expected Behavior After Fix

### Student Dashboard:
```
Good evening, [Name]!
You have 2 pending tasks and 3 active goals

[Active Goals: 3]      [Pending Tasks: 2]
[Papers in Progress: 1] [Completion Rate: 50%]

Recent Activity:
✓ Created daily goal: "Review papers" - 5 min ago
✓ Added paper: "ML Research" - 10 min ago
✓ Created task: "Implement model" - 15 min ago
```

### Supervisor Dashboard:
```
Supervisor Dashboard

[Total Students: 3]    [Total Goals: 8]
[Total Papers: 5]      [Total Tasks: 12]

Students:
Alice Johnson - alice@lab.com - Active
Bob Williams - bob@lab.com - Active
Carol Davis - carol@lab.com - Active
```

---

## 🚨 Emergency Reset

If nothing works:

```bash
# 1. Backup your data (if any)

# 2. Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install

# 3. Restart servers
cd backend
npm start

# Frontend in new terminal
cd frontend
npm run dev

# 4. Clear browser cache
# - Open browser
# - Press Ctrl+Shift+Delete
# - Clear cache and cookies
# - Reload page
```

---

## 💡 Pro Tips

1. **Always check database first**
   ```bash
   npm run test-db
   ```

2. **Browser console is your friend**
   - F12 → Console → See all logs
   - Errors in red = problems
   - Logs show what's happening

3. **Network tab shows API calls**
   - F12 → Network → Filter "Fetch/XHR"
   - Click on request → Preview → See response

4. **Create test data step by step**
   - Create 1 goal → Check dashboard
   - Create 1 paper → Check dashboard
   - Create 1 task → Check dashboard

5. **Use console.log to debug**
   - Already added to Dashboard.jsx
   - Check what data is received
   - Compare with expected format

---

## ✨ Success Criteria

Dashboard is working when:
- ✅ Numbers are NOT 0 (if data exists)
- ✅ Activity log shows actions
- ✅ No console errors
- ✅ Stats update when you create/delete items
- ✅ Refresh page → Numbers stay the same

Supervisor features working when:
- ✅ Can see "Supervisor Dashboard" menu
- ✅ Can see list of students
- ✅ Can click on student to see their data
- ✅ Dashboard shows aggregated stats
- ✅ Recent activity shows all students' actions

---

**Need more help? Check:**
- COMPLETE_SETUP_GUIDE.md
- FINAL_SUMMARY.md
- Browser console (F12)
- Backend terminal logs
- Database test output (`npm run test-db`)

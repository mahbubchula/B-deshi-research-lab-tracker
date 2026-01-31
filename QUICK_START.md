# ⚡ QUICK START GUIDE

## 🚀 Start in 3 Steps

### Step 1: Start Backend
```bash
cd D:\research-lab-tracker-complete\backend
npm start
```
✅ Wait for "Server running on port 5000"

### Step 2: Start Frontend
```bash
cd D:\research-lab-tracker-complete\frontend
npm run dev
```
✅ Wait for "Local: http://localhost:5173/"

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 👥 Create Test Accounts

### Supervisor Account:
```
Email: supervisor@lab.com
Password: supervisor123
Role: Professor
Department: Computer Science
```

### Student Accounts:
```
Student 1:
Email: alice@lab.com
Password: student123
Role: Student

Student 2:
Email: bob@lab.com
Password: student123
Role: Student
```

---

## 🎯 Test Flow

### As Student (Alice):
1. ✅ Login → Create 3 goals → Check dashboard shows "3"
2. ✅ Create 2 papers → Check dashboard shows "2"
3. ✅ Create 3 tasks → Check dashboard shows "3"
4. ✅ Check activity log shows all 8 activities

### As Supervisor:
1. ✅ Login → Click "Supervisor Dashboard"
2. ✅ Should see "Total Students: 2" (Alice, Bob)
3. ✅ Should see Alice's 3 goals, 2 papers, 3 tasks
4. ✅ Click "Students" → See Alice and Bob
5. ✅ Click eye icon on Alice → See all her data
6. ✅ Check "Recent Activity" shows Alice's actions

---

## ✅ Success Check

Dashboard should show:
- ✅ Real numbers (not 0)
- ✅ Activity log has entries
- ✅ No console errors
- ✅ Changes save to database

Supervisor should see:
- ✅ All students listed
- ✅ Aggregated statistics
- ✅ Individual student details
- ✅ All students' activities

---

## 📁 Important Files

**Documentation:**
- `COMPLETE_SETUP_GUIDE.md` - Full testing guide
- `FINAL_SUMMARY.md` - Complete summary
- `QUICK_START.md` - This file

**Config:**
- `backend/.env` - Database connection
- `frontend/.env` - API endpoint

---

## 🐛 Common Issues

**Dashboard shows 0:**
- Create some goals/papers/tasks first
- Refresh the page
- Check browser console for errors

**Can't see students:**
- Make sure you're logged in as professor/admin
- Check "Role" during registration
- Try logging out and back in

**API errors:**
- Verify backend is running (port 5000)
- Check MongoDB connection
- Look at backend terminal for errors

---

## 🎉 That's It!

Your Research Lab Tracker is ready to use!

**All features working • No mock data • 100% functional**

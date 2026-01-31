# Testing Guide - Research Lab Tracker

## Quick Start Testing

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd D:\research-lab-tracker-complete\backend
npm install  # if first time
npm start
```

**Terminal 2 - Frontend:**
```bash
cd D:\research-lab-tracker-complete\frontend
npm install  # if first time
npm run dev
```

**Expected Output:**
- Backend: `🚀 Server running on port 5000`
- Frontend: `➜  Local:   http://localhost:5173/`

---

## 2. Login/Register

1. Open browser: http://localhost:5173
2. If you have an account, login
3. If not, click "Register" and create an account

---

## 3. Test Dashboard Statistics

### Before Creating Data:
Check the dashboard - it should show:
- Active Goals: 0
- Pending Tasks: 0
- Papers in Progress: 0
- Completion Rate: 0%
- Recent Activity: "No recent activity"

---

## 4. Test Goals Feature

### Create a Goal:
1. Click "Goals" in navigation
2. Click "New Goal" button
3. Fill in:
   - Title: "Complete literature review"
   - Type: Daily
   - Priority: High
   - Start Date: Today
   - End Date: Today
   - Description: "Review 10 research papers"
4. Click "Create Goal"

### Verify:
- ✅ Success toast appears
- ✅ Goal appears in goals list
- ✅ Go to Dashboard → "Active Goals" shows 1
- ✅ Activity log shows "Created daily goal: Complete literature review"

### Edit the Goal:
1. Click edit icon on the goal
2. Change progress to 50%
3. Click "Update Goal"

### Verify:
- ✅ Goal updates successfully
- ✅ Activity log shows "Updated goal: Complete literature review"

### Complete the Goal:
1. Click edit icon
2. Change status to "Completed"
3. Click "Update Goal"

### Verify:
- ✅ Goal marked as completed
- ✅ Dashboard "Completion Rate" increases
- ✅ Activity log shows "Completed goal: Complete literature review"
- ✅ "Active Goals" decreases by 1

### Delete a Goal:
1. Create another test goal
2. Click delete icon
3. Confirm deletion

### Verify:
- ✅ Goal removed from list
- ✅ Dashboard stats update
- ✅ Activity log shows "Deleted goal: [goal name]"

---

## 5. Test Papers Feature

### Create a Paper:
1. Click "Papers" in navigation
2. Click "New Paper" button
3. Fill in:
   - Title: "Deep Learning for NLP"
   - Abstract: "This paper explores..."
   - Status: In Progress
   - Venue Type: Conference
   - Venue Name: "NeurIPS 2024"
   - Keywords: "machine learning, NLP, deep learning"
4. Click "Add Paper"

### Verify:
- ✅ Success toast appears
- ✅ Paper appears in papers list
- ✅ Dashboard "Papers in Progress" shows 1
- ✅ Activity log shows "Created new paper: Deep Learning for NLP"

### Edit the Paper:
1. Click edit icon on the paper
2. Change status to "Submitted"
3. Click "Update Paper"

### Verify:
- ✅ Paper updates successfully
- ✅ Status badge shows "Submitted"
- ✅ Activity log shows "Updated paper: Deep Learning for NLP"

### Delete a Paper:
1. Click delete icon
2. Confirm deletion

### Verify:
- ✅ Paper removed from list
- ✅ Dashboard stats update
- ✅ Activity log shows "Deleted paper: Deep Learning for NLP"

---

## 6. Test Tasks Feature

### Create a Task:
1. Click "Tasks" in navigation
2. Click "New Task" button
3. Fill in:
   - Title: "Review paper draft"
   - Description: "Review and provide feedback"
   - Priority: High
   - Due Date: Tomorrow
   - Status: Pending
4. Click "Create Task"

### Verify:
- ✅ Success toast appears
- ✅ Task appears in tasks list
- ✅ Dashboard "Pending Tasks" shows 1
- ✅ Activity log shows "Created new task: Review paper draft"

### Edit the Task:
1. Click edit icon on the task
2. Change status to "In Progress"
3. Click "Update Task"

### Verify:
- ✅ Task updates successfully
- ✅ Status badge shows "In Progress"
- ✅ Activity log shows "Updated task: Review paper draft"
- ✅ Dashboard "Pending Tasks" decreases by 1

### Complete the Task:
1. Click edit icon
2. Change status to "Completed"
3. Click "Update Task"

### Verify:
- ✅ Task marked as completed
- ✅ Activity log shows "Completed task: Review paper draft"

### Delete a Task:
1. Create another test task
2. Click delete icon
3. Confirm deletion

### Verify:
- ✅ Task removed from list
- ✅ Dashboard stats update
- ✅ Activity log shows "Deleted task: [task name]"

---

## 7. Test Activity Log Display

### Verify Activity Log:
1. Go to Dashboard
2. Scroll to "Recent Activity" section

### Should See:
- ✅ All recent actions listed
- ✅ Newest activities at the top
- ✅ Each activity shows:
  - Type badge (G for Goal, P for Paper, T for Task)
  - Action description
  - Item name
  - Timestamp
- ✅ Max 5 activities shown in dashboard

---

## 8. Test Dashboard Real-time Updates

### Create Multiple Items:
1. Create 3 goals (2 in-progress, 1 completed)
2. Create 2 papers (1 in-progress, 1 submitted)
3. Create 4 tasks (2 pending, 1 in-progress, 1 completed)

### Verify Dashboard Shows:
- ✅ Active Goals: 2
- ✅ Pending Tasks: 2
- ✅ Papers in Progress: 2 (total papers)
- ✅ Completion Rate: 33% (1 completed out of 3 goals)

### Verify Activity Log Shows:
- ✅ 9 activities (3 goals + 2 papers + 4 tasks)
- ✅ Sorted by date (newest first)
- ✅ All descriptions are accurate

---

## 9. Browser Console Tests

### Open Browser DevTools:
- Press F12 or Right-click → Inspect
- Go to Console tab

### Verify:
- ✅ No red errors appear
- ✅ API calls succeed (200 status codes)
- ✅ No CORS errors
- ✅ No authentication errors

---

## 10. Backend Console Tests

### Check Backend Terminal:

### Should See:
- ✅ No error messages
- ✅ Successful MongoDB connection
- ✅ API requests logged (if using morgan)
- ✅ No 400/500 errors

---

## Common Test Scenarios

### Scenario 1: New User Experience
1. Register new account
2. Dashboard should show all zeros
3. Create first goal
4. Dashboard updates immediately
5. Activity log shows first action

### Scenario 2: Active Research Workflow
1. Create multiple papers at different stages
2. Filter papers by status
3. Verify all filters work correctly
4. Check dashboard reflects accurate counts

### Scenario 3: Task Management
1. Create tasks with different priorities
2. Change task statuses
3. Complete tasks
4. Verify dashboard pending count updates

### Scenario 4: Goal Tracking
1. Create daily, weekly, monthly goals
2. Track progress with percentage
3. Complete goals
4. Verify completion rate calculation

---

## Performance Tests

### Load Test:
1. Create 20 goals
2. Create 15 papers
3. Create 25 tasks
4. Verify dashboard still loads quickly
5. Verify activity log loads without lag

---

## Error Handling Tests

### Test Invalid Data:
1. Try creating goal without title → Should show error
2. Try creating paper without title → Should show error
3. Try creating task without due date → Should show error

### Test Network Errors:
1. Stop backend server
2. Try creating a goal
3. Should show error message
4. Restart backend
5. Try again → Should work

---

## Cross-Feature Integration Tests

### Test 1: Complete Workflow
1. Create a paper "ML Research"
2. Create a goal "Submit ML Research paper"
3. Create a task "Review ML Research draft"
4. Complete the task
5. Update paper status to "Submitted"
6. Complete the goal
7. Verify all activities logged
8. Verify dashboard stats accurate

### Test 2: Bulk Operations
1. Create 5 goals in sequence
2. Check dashboard shows 5 active goals
3. Delete 2 goals
4. Check dashboard shows 3 active goals
5. Verify 7 activities in log (5 creates + 2 deletes)

---

## Mobile Responsiveness Tests

### Test on Different Screen Sizes:
1. Resize browser to mobile size (375px width)
2. Verify dashboard cards stack vertically
3. Verify navigation menu works
4. Verify modals are readable
5. Verify all buttons are clickable

---

## Data Persistence Tests

### Test Database Persistence:
1. Create several items (goals, papers, tasks)
2. Refresh the page
3. Verify all data still appears
4. Close browser completely
5. Reopen and login
6. Verify all data still persists

---

## Expected Results Summary

After completing all tests, you should have:

✅ **Goals:** Multiple goals created, edited, completed, deleted
✅ **Papers:** Multiple papers created, edited, deleted
✅ **Tasks:** Multiple tasks created, edited, completed, deleted
✅ **Dashboard:** Shows accurate statistics for all items
✅ **Activity Log:** Shows all CRUD operations chronologically
✅ **No Errors:** Browser console and backend logs are clean
✅ **Real-time Updates:** All changes reflect immediately
✅ **Data Persistence:** All data saved to MongoDB

---

## Troubleshooting

### Issue: Dashboard shows 0
**Solution:**
1. Check if you're logged in
2. Verify backend is running
3. Check browser console for errors
4. Verify MongoDB connection

### Issue: Activity log empty
**Solution:**
1. Perform any CRUD operation (create/edit/delete)
2. Refresh the page
3. Check `/api/activities` endpoint in Network tab

### Issue: Papers not saving
**Solution:**
1. Verify title field is filled
2. Check backend console for errors
3. Verify MongoDB connection
4. Check authentication token exists

### Issue: CORS errors
**Solution:**
1. Verify frontend runs on port 5173
2. Verify backend runs on port 5000
3. Check `vite.config.js` proxy settings
4. Restart both servers

---

## Quick Verification Script

Run this in browser console after creating some data:

```javascript
// Check localStorage for auth
console.log('Logged in:', !!localStorage.getItem('token'));

// Check API endpoints
fetch('/api/goals').then(r => r.json()).then(d => console.log('Goals:', d.count));
fetch('/api/papers').then(r => r.json()).then(d => console.log('Papers:', d.count));
fetch('/api/tasks').then(r => r.json()).then(d => console.log('Tasks:', d.count));
fetch('/api/activities').then(r => r.json()).then(d => console.log('Activities:', d.count));
```

Expected output:
```
Logged in: true
Goals: 3
Papers: 2
Tasks: 4
Activities: 9
```

---

## Success Criteria

All tests pass when:
- ✅ Can create, edit, delete all item types
- ✅ Dashboard shows correct statistics
- ✅ Activity log shows all actions
- ✅ No console errors
- ✅ No backend errors
- ✅ Data persists after refresh
- ✅ All features work as expected

**If all tests pass, the application is 100% functional!** 🎉

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import User from './src/models/User.model.js';
import Goal from './src/models/Goal.model.js';
import Paper from './src/models/Paper.model.js';
import Task from './src/models/Task.model.js';
import Activity from './src/models/Activity.model.js';

console.log('🧪 DATABASE CONNECTION TEST\n');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
console.log('');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully!\n');

    // Count documents in each collection
    const userCount = await User.countDocuments();
    const goalCount = await Goal.countDocuments();
    const paperCount = await Paper.countDocuments();
    const taskCount = await Task.countDocuments();
    const activityCount = await Activity.countDocuments();

    console.log('📊 DATABASE STATISTICS:');
    console.log('=====================');
    console.log(`Users: ${userCount}`);
    console.log(`Goals: ${goalCount}`);
    console.log(`Papers: ${paperCount}`);
    console.log(`Tasks: ${taskCount}`);
    console.log(`Activities: ${activityCount}`);
    console.log('');

    // Get sample users
    const users = await User.find().select('name email role _id').limit(10);
    const supervisors = users.filter(u => u.role === 'professor' || u.role === 'admin');
    const students = users.filter(u => u.role === 'student');

    console.log('👥 USERS IN DATABASE:');
    console.log('=====================');
    if (users.length > 0) {
      if (supervisors.length > 0) {
        console.log('\n🎓 SUPERVISORS/PROFESSORS:');
        supervisors.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
          console.log(`   ID: ${user._id}`);
        });
      } else {
        console.log('\n⚠️  NO SUPERVISORS FOUND!');
        console.log('   You need to create at least 1 supervisor account (role: professor)');
      }

      if (students.length > 0) {
        console.log('\n👨‍🎓 STUDENTS:');
        students.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email})`);
          console.log(`   ID: ${user._id}`);
        });
      }
    } else {
      console.log('❌ NO USERS FOUND - Please create users first!');
    }
    console.log('');

    // Get sample goals
    const goals = await Goal.find().populate('user', 'name email').limit(5);
    console.log('🎯 GOALS IN DATABASE:');
    console.log('=====================');
    if (goals.length > 0) {
      goals.forEach((goal, index) => {
        console.log(`${index + 1}. "${goal.title}" - ${goal.status}`);
        console.log(`    Owner: ${goal.user?.name || 'Unknown'} (${goal.user?.email || 'no email'})`);
        console.log(`    User ID: ${goal.user?._id || 'Unknown'}`);
      });
    } else {
      console.log('❌ NO GOALS FOUND - Students need to create goals!');
    }
    console.log('');

    // Get sample papers
    const papers = await Paper.find().populate('authors.user', 'name email').limit(5);
    console.log('📄 PAPERS IN DATABASE:');
    console.log('=====================');
    if (papers.length > 0) {
      papers.forEach((paper, index) => {
        console.log(`${index + 1}. "${paper.title}" - ${paper.status}`);
        if (paper.authors && paper.authors.length > 0) {
          paper.authors.forEach(author => {
            if (author.user) {
              console.log(`    Author: ${author.user.name} (${author.user.email})`);
              console.log(`    User ID: ${author.user._id}`);
            }
          });
        }
      });
    } else {
      console.log('❌ NO PAPERS FOUND - Students need to create papers!');
    }
    console.log('');

    // Get sample tasks
    const tasks = await Task.find().populate('assignedTo', 'name email').limit(5);
    console.log('✅ TASKS IN DATABASE:');
    console.log('=====================');
    if (tasks.length > 0) {
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. "${task.title}" - ${task.status}`);
        console.log(`    Assigned to: ${task.assignedTo?.name || 'Unknown'} (${task.assignedTo?.email || 'no email'})`);
        console.log(`    User ID: ${task.assignedTo?._id || 'Unknown'}`);
      });
    } else {
      console.log('❌ NO TASKS FOUND - Students need to create tasks!');
    }
    console.log('');

    // Get sample activities
    const activities = await Activity.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5);
    console.log('📋 RECENT ACTIVITIES:');
    console.log('=====================');
    if (activities.length > 0) {
      activities.forEach((activity, index) => {
        console.log(`${index + 1}. [${activity.type}] ${activity.action} - ${activity.user?.name || 'Unknown'}`);
      });
    } else {
      console.log('❌ NO ACTIVITIES FOUND - Activities will be created when students perform actions!');
    }
    console.log('');

    console.log('🔍 TESTING QUERY FOR A SPECIFIC USER:');
    console.log('=====================================');
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`Testing with user: ${testUser.name} (ID: ${testUser._id})`);

      const userGoals = await Goal.find({ user: testUser._id });
      const userPapers = await Paper.find({ 'authors.user': testUser._id });
      const userTasks = await Task.find({
        $or: [
          { assignedTo: testUser._id },
          { assignedBy: testUser._id }
        ]
      });

      console.log(`  Goals: ${userGoals.length}`);
      console.log(`  Papers: ${userPapers.length}`);
      console.log(`  Tasks: ${userTasks.length}`);
    }
    console.log('');

    console.log('✅ DATABASE TEST COMPLETE!');
    console.log('');
    console.log('📋 SUMMARY:');
    console.log('===========');
    console.log(`Total Users: ${userCount} (${supervisors.length} supervisors, ${students.length} students)`);
    console.log(`Total Goals: ${goalCount}`);
    console.log(`Total Papers: ${paperCount}`);
    console.log(`Total Tasks: ${taskCount}`);
    console.log(`Total Activities: ${activityCount}`);
    console.log('');
    console.log('⚠️  IMPORTANT:');
    console.log('==============');
    console.log('Dashboard shows data ONLY for the logged-in user!');
    console.log('');
    console.log('If you login as a user who has NO data,');
    console.log('the dashboard will show 0 (which is correct!).');
    console.log('');
    console.log('To see data on dashboard:');
    console.log('1. Login as the user who created the data');
    console.log('2. OR create new data as the current logged-in user');
    console.log('');
    console.log('NEXT STEPS:');
    console.log('===========');
    if (supervisors.length === 0) {
      console.log('❗ CREATE SUPERVISOR ACCOUNT:');
      console.log('   Register at http://localhost:5173/register');
      console.log('   Set role to "Professor" (NOT "Student")');
      console.log('');
    }
    if (userCount > 0 && (goalCount > 0 || paperCount > 0 || taskCount > 0)) {
      console.log('✅ DATABASE HAS DATA!');
      console.log('');
      console.log('To see data on dashboard:');
      console.log('1. Check which user owns the data (see above)');
      console.log('2. Login with that user\'s email');
      console.log('3. OR create new goals/papers/tasks as current user');
      console.log('');
      console.log('If dashboard still shows 0:');
      console.log('- Open browser console (F12)');
      console.log('- Look for red errors');
      console.log('- Check Network tab for failed API calls');
    } else {
      console.log('❗ NO DATA YET');
      console.log('');
      console.log('Steps to create data:');
      console.log('1. Login as student at http://localhost:5173/login');
      console.log('2. Create some goals (Goals page → New Goal)');
      console.log('3. Create some papers (Papers page → New Paper)');
      console.log('4. Create some tasks (Tasks page → New Task)');
      console.log('5. Check dashboard - should show numbers!');
    }
    console.log('');

    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection FAILED!');
    console.error('Error:', error.message);
    console.error('');
    console.error('TROUBLESHOOTING:');
    console.error('1. Check if backend/.env file exists');
    console.error('2. Verify MONGODB_URI is correct in .env file');
    console.error('3. Check internet connection');
    console.error('4. Verify MongoDB Atlas cluster is running');
    process.exit(1);
  });

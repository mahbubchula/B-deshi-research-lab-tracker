import Goal from '../models/Goal.model.js';
import Paper from '../models/Paper.model.js';
import Task from '../models/Task.model.js';
import Activity from '../models/Activity.model.js';
import User from '../models/User.model.js';

// @desc    Get shared/collaborative dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getSharedDashboard = async (req, res) => {
  try {
    console.log('Fetching shared dashboard for user:', req.user.email);

    // Get ALL goals from ALL users (collaborative)
    const allGoals = await Goal.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Get ALL papers from ALL users
    const allPapers = await Paper.find()
      .populate('authors.user', 'name email')
      .sort({ createdAt: -1 });

    // Get ALL tasks from ALL users
    const allTasks = await Task.find()
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Get ALL activities from ALL users (recent 50)
    const allActivities = await Activity.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate aggregated statistics
    const stats = {
      goals: {
        total: allGoals.length,
        completed: allGoals.filter(g => g.status === 'completed').length,
        inProgress: allGoals.filter(g => g.status === 'in-progress').length,
        notStarted: allGoals.filter(g => g.status === 'not-started').length
      },
      papers: {
        total: allPapers.length,
        inProgress: allPapers.filter(p => p.status === 'in-progress').length,
        submitted: allPapers.filter(p => ['submitted', 'under-review'].includes(p.status)).length,
        published: allPapers.filter(p => ['published', 'accepted'].includes(p.status)).length
      },
      tasks: {
        total: allTasks.length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        inProgress: allTasks.filter(t => t.status === 'in-progress').length,
        completed: allTasks.filter(t => t.status === 'completed').length
      }
    };

    // Get team members count
    const teamMembers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        stats,
        teamMembers,
        goals: allGoals,
        papers: allPapers,
        tasks: allTasks,
        activities: allActivities
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get personal dashboard data (user's own data only)
// @route   GET /api/dashboard/personal
// @access  Private
export const getPersonalDashboard = async (req, res) => {
  try {
    // Get user's own goals
    const myGoals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Get user's own papers
    const myPapers = await Paper.find({ 'authors.user': req.user.id }).sort({ createdAt: -1 });

    // Get user's own tasks
    const myTasks = await Task.find({
      $or: [
        { assignedTo: req.user.id },
        { assignedBy: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    // Get user's own activities
    const myActivities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    const stats = {
      goals: {
        total: myGoals.length,
        completed: myGoals.filter(g => g.status === 'completed').length,
        inProgress: myGoals.filter(g => g.status === 'in-progress').length
      },
      papers: {
        total: myPapers.length,
        inProgress: myPapers.filter(p => p.status === 'in-progress').length,
        submitted: myPapers.filter(p => ['submitted', 'under-review'].includes(p.status)).length,
        published: myPapers.filter(p => ['published', 'accepted'].includes(p.status)).length
      },
      tasks: {
        total: myTasks.length,
        pending: myTasks.filter(t => t.status === 'pending').length,
        completed: myTasks.filter(t => t.status === 'completed').length
      }
    };

    res.json({
      success: true,
      data: {
        stats,
        goals: myGoals,
        papers: myPapers,
        tasks: myTasks,
        activities: myActivities
      }
    });
  } catch (error) {
    console.error('Personal dashboard error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

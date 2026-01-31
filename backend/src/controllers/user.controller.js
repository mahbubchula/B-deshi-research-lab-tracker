import User from '../models/User.model.js';
import Goal from '../models/Goal.model.js';
import Paper from '../models/Paper.model.js';
import Task from '../models/Task.model.js';
import Activity from '../models/Activity.model.js';

// @desc    Get all users (Supervisor/Admin only)
// @route   GET /api/users
// @access  Private (Professor, Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, department, labGroup, search } = req.query;

    let query = {};

    // Filter by role
    if (role) query.role = role;

    // Filter by department
    if (department) query.department = department;

    // Filter by lab group
    if (labGroup) query.labGroup = labGroup;

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('supervisor', 'name email')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single user details
// @route   GET /api/users/:id
// @access  Private (Professor, Admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('supervisor', 'name email')
      .select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user statistics
    const [goals, papers, tasks] = await Promise.all([
      Goal.find({ user: user._id }),
      Paper.find({ 'authors.user': user._id }),
      Task.find({ $or: [{ assignedTo: user._id }, { assignedBy: user._id }] })
    ]);

    const stats = {
      goals: {
        total: goals.length,
        completed: goals.filter(g => g.status === 'completed').length,
        inProgress: goals.filter(g => g.status === 'in-progress').length
      },
      papers: {
        total: papers.length,
        published: papers.filter(p => p.status === 'published').length,
        inProgress: papers.filter(p => p.status === 'in-progress').length
      },
      tasks: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length
      }
    };

    res.json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update user details (Supervisor/Admin only)
// @route   PUT /api/users/:id
// @access  Private (Professor, Admin)
export const updateUser = async (req, res) => {
  try {
    const allowedFields = {
      name: req.body.name,
      department: req.body.department,
      labGroup: req.body.labGroup,
      role: req.body.role,
      supervisor: req.body.supervisor,
      isActive: req.body.isActive
    };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      allowedFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Professor/Admin only - with cascade delete)
// @route   DELETE /api/users/:id
// @access  Private (Professor, Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // CASCADE DELETE: Delete all related data
    await Promise.all([
      // Delete all goals created by this user
      Goal.deleteMany({ user: user._id }),

      // Delete all papers where user is an author
      Paper.deleteMany({ 'authors.user': user._id }),

      // Delete all tasks assigned to or created by this user
      Task.deleteMany({
        $or: [
          { assignedTo: user._id },
          { assignedBy: user._id }
        ]
      }),

      // Delete all activities by this user
      Activity.deleteMany({ user: user._id })
    ]);

    // Finally delete the user
    await user.deleteOne();

    res.json({
      success: true,
      message: `User "${user.name}" and all associated data deleted successfully`,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get supervisor dashboard statistics
// @route   GET /api/users/supervisor/dashboard
// @access  Private (Professor, Admin)
export const getSupervisorDashboard = async (req, res) => {
  try {
    // Get all users (students under supervision)
    const users = await User.find({ role: 'student' }).select('-password');

    // Get all goals
    const allGoals = await Goal.find().populate('user', 'name email');

    // Get all papers
    const allPapers = await Paper.find().populate('authors.user', 'name email');

    // Get all tasks
    const allTasks = await Task.find()
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email');

    // Calculate overall statistics
    const stats = {
      users: {
        total: users.length,
        active: users.filter(u => u.isActive).length
      },
      goals: {
        total: allGoals.length,
        completed: allGoals.filter(g => g.status === 'completed').length,
        inProgress: allGoals.filter(g => g.status === 'in-progress').length
      },
      papers: {
        total: allPapers.length,
        published: allPapers.filter(p => p.status === 'published').length,
        underReview: allPapers.filter(p => p.status === 'under-review').length,
        inProgress: allPapers.filter(p => p.status === 'in-progress').length
      },
      tasks: {
        total: allTasks.length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        inProgress: allTasks.filter(t => t.status === 'in-progress').length
      }
    };

    // Get recent activities from all users
    const recentActivities = await Activity.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        stats,
        users,
        recentActivities
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all activities (Supervisor view)
// @route   GET /api/users/supervisor/activities
// @access  Private (Professor, Admin)
export const getAllActivities = async (req, res) => {
  try {
    const { type, userId, limit = 50 } = req.query;

    let query = {};

    if (type) query.type = type;
    if (userId) query.user = userId;

    const activities = await Activity.find(query)
      .populate('user', 'name email role department')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Assign supervisor to user
// @route   PUT /api/users/:id/assign-supervisor
// @access  Private (Admin)
export const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;

    // Verify supervisor exists and has professor role
    const supervisor = await User.findById(supervisorId);
    if (!supervisor || !['professor', 'admin'].includes(supervisor.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid supervisor'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { supervisor: supervisorId },
      { new: true }
    ).populate('supervisor', 'name email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user's goals (Supervisor can see any user's goals)
// @route   GET /api/users/:id/goals
// @access  Private (Professor, Admin)
export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user's papers (Supervisor can see any user's papers)
// @route   GET /api/users/:id/papers
// @access  Private (Professor, Admin)
export const getUserPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ 'authors.user': req.params.id })
      .populate('authors.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user's tasks (Supervisor can see any user's tasks)
// @route   GET /api/users/:id/tasks
// @access  Private (Professor, Admin)
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.params.id },
        { assignedBy: req.params.id }
      ]
    })
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

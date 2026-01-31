import Goal from '../models/Goal.model.js';
import Activity from '../models/Activity.model.js';

// @desc    Get all goals (collaborative - shows ALL users' goals)
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    let query = {};  // No user filter - show ALL goals from ALL users

    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const goals = await Goal.find(query)
      .populate('user', 'name email role')  // Show who created each goal
      .populate('assignedBy', 'name email role')  // Show who assigned it
      .populate('assignedTo', 'name email role')  // Show who it's assigned to
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check ownership or professor role
    if (goal.user.toString() !== req.user.id && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // If supervisor is creating and assigning to others
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      req.body.assignedBy = req.user.id;
    }

    const goal = await Goal.create(req.body);

    // Populate the goal to get full user details
    await goal.populate('user assignedBy assignedTo');

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'goal',
      action: `Created ${req.body.type} goal`,
      description: req.body.title,
      relatedId: goal._id,
      relatedModel: 'Goal'
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // If status is being changed to completed, set completedAt
    if (req.body.status === 'completed' && goal.status !== 'completed') {
      req.body.completedAt = new Date();
      req.body.progress = 100;
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Create activity log
    const action = req.body.status === 'completed' ? 'Completed goal' : 'Updated goal';
    await Activity.create({
      user: req.user.id,
      type: 'goal',
      action: action,
      description: goal.title,
      relatedId: goal._id,
      relatedModel: 'Goal'
    });

    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const goalTitle = goal.title;
    await goal.deleteOne();

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'goal',
      action: 'Deleted goal',
      description: goalTitle,
      relatedModel: 'Goal'
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
export const getGoalStats = async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

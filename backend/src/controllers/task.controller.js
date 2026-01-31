import Task from '../models/Task.model.js';
import Activity from '../models/Activity.model.js';
import Notification from '../models/Notification.model.js';

// @desc    Get all tasks (collaborative - shows ALL users' tasks)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;

    let query = {};  // No user filter - show ALL tasks from ALL users

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedBy', 'name email role')  // Show who created the task
      .populate('assignedTo', 'name email role')  // Show who it's assigned to
      .populate('relatedPaper', 'title')
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('relatedPaper', 'title');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    // Set assignedBy to current user
    req.body.assignedBy = req.user.id;
    
    // If no assignedTo, assign to self
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user.id;
    }

    const task = await Task.create(req.body);

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'task',
      action: 'Created new task',
      description: req.body.title,
      relatedId: task._id,
      relatedModel: 'Task'
    });

    // Create notification if assigning to someone else
    if (req.body.assignedTo !== req.user.id) {
      await Notification.create({
        user: req.body.assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned: ${req.body.title}`,
        type: 'task',
        relatedId: task._id,
        relatedModel: 'Task'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const isOwner = task.assignedTo.toString() === req.user.id || 
                   task.assignedBy.toString() === req.user.id;

    if (!isOwner && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // If status changed to completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedBy', 'name email').populate('assignedTo', 'name email');

    // Create activity log
    const action = req.body.status === 'completed' ? 'Completed task' : 'Updated task';
    await Activity.create({
      user: req.user.id,
      type: 'task',
      action: action,
      description: task.title,
      relatedId: task._id,
      relatedModel: 'Task'
    });

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const isOwner = task.assignedTo.toString() === req.user.id || 
                   task.assignedBy.toString() === req.user.id;

    if (!isOwner && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const taskTitle = task.title;
    await task.deleteOne();

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'task',
      action: 'Deleted task',
      description: taskTitle,
      relatedModel: 'Task'
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

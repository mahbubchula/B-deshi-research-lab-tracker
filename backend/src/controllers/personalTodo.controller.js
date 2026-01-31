import PersonalTodo from '../models/PersonalTodo.model.js';

// @desc    Get all personal to-dos for current user
// @route   GET /api/personal-todos
// @access  Private (Professor, Admin)
export const getPersonalTodos = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = { user: req.user.id };

    if (type) query.type = type;
    if (status) query.status = status;

    const todos = await PersonalTodo.find(query)
      .sort({ dueDate: 1, createdAt: -1 });

    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single personal to-do
// @route   GET /api/personal-todos/:id
// @access  Private (Professor, Admin)
export const getPersonalTodo = async (req, res) => {
  try {
    const todo = await PersonalTodo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'To-do not found' });
    }

    // Check ownership
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new personal to-do
// @route   POST /api/personal-todos
// @access  Private (Professor, Admin)
export const createPersonalTodo = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const todo = await PersonalTodo.create(req.body);

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update personal to-do
// @route   PUT /api/personal-todos/:id
// @access  Private (Professor, Admin)
export const updatePersonalTodo = async (req, res) => {
  try {
    let todo = await PersonalTodo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'To-do not found' });
    }

    // Check ownership
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // If status is being changed to completed, set completedAt
    if (req.body.status === 'completed' && todo.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    todo = await PersonalTodo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete personal to-do
// @route   DELETE /api/personal-todos/:id
// @access  Private (Professor, Admin)
export const deletePersonalTodo = async (req, res) => {
  try {
    const todo = await PersonalTodo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'To-do not found' });
    }

    // Check ownership
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await todo.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get statistics for personal to-dos
// @route   GET /api/personal-todos/stats
// @access  Private (Professor, Admin)
export const getPersonalTodoStats = async (req, res) => {
  try {
    const todos = await PersonalTodo.find({ user: req.user.id });

    const stats = {
      total: todos.length,
      byType: {
        daily: todos.filter(t => t.type === 'daily').length,
        weekly: todos.filter(t => t.type === 'weekly').length,
        monthly: todos.filter(t => t.type === 'monthly').length,
        yearly: todos.filter(t => t.type === 'yearly').length
      },
      byStatus: {
        pending: todos.filter(t => t.status === 'pending').length,
        inProgress: todos.filter(t => t.status === 'in-progress').length,
        completed: todos.filter(t => t.status === 'completed').length
      },
      byPriority: {
        low: todos.filter(t => t.priority === 'low').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        high: todos.filter(t => t.priority === 'high').length,
        urgent: todos.filter(t => t.priority === 'urgent').length
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

import Activity from '../models/Activity.model.js';

// @desc    Get all activities for current user
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const { type, limit = 20 } = req.query;

    let query = { user: req.user.id };

    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
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

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Check ownership
    if (activity.user.toString() !== req.user.id && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Check ownership
    if (activity.user.toString() !== req.user.id && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await activity.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Clear all activities for current user
// @route   DELETE /api/activities
// @access  Private
export const clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({ user: req.user.id });

    res.json({ success: true, message: 'All activities cleared', data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

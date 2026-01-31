import Paper from '../models/Paper.model.js';
import Activity from '../models/Activity.model.js';

// @desc    Get all papers (collaborative - shows ALL users' papers)
// @route   GET /api/papers
// @access  Private
export const getPapers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};  // No user filter - show ALL papers from ALL users

    if (status) query.status = status;

    const papers = await Paper.find(query)
      .populate('authors.user', 'name email role')  // Show all authors
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

// @desc    Get single paper
// @route   GET /api/papers/:id
// @access  Private
export const getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('authors.user', 'name email');

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    res.json({ success: true, data: paper });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new paper
// @route   POST /api/papers
// @access  Private
export const createPaper = async (req, res) => {
  try {
    // Add current user as an author if not already in authors array
    if (!req.body.authors || req.body.authors.length === 0) {
      req.body.authors = [{
        user: req.user.id,
        name: req.user.name,
        role: 'lead'
      }];
    } else {
      // Ensure the current user is in the authors array
      const userInAuthors = req.body.authors.some(
        author => author.user?.toString() === req.user.id || author.user === req.user.id
      );

      if (!userInAuthors) {
        req.body.authors.push({
          user: req.user.id,
          name: req.user.name,
          role: 'lead'
        });
      }
    }

    const paper = await Paper.create(req.body);

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'paper',
      action: 'Created new paper',
      description: req.body.title,
      relatedId: paper._id,
      relatedModel: 'Paper'
    });

    res.status(201).json({ success: true, data: paper });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private
export const updatePaper = async (req, res) => {
  try {
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    // Check if user is an author - handle both ObjectId and populated user
    const isAuthor = paper.authors.some(author => {
      const authorId = author.user?._id || author.user;
      return authorId && authorId.toString() === req.user.id;
    });

    if (!isAuthor && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this paper' });
    }

    paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'paper',
      action: 'Updated paper',
      description: paper.title,
      relatedId: paper._id,
      relatedModel: 'Paper'
    });

    res.json({ success: true, data: paper });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete paper
// @route   DELETE /api/papers/:id
// @access  Private
export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    // Check if user is an author - handle both ObjectId and populated user
    const isAuthor = paper.authors.some(author => {
      const authorId = author.user?._id || author.user;
      return authorId && authorId.toString() === req.user.id;
    });

    if (!isAuthor && !['professor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this paper' });
    }

    const paperTitle = paper.title;
    await paper.deleteOne();

    // Create activity log
    await Activity.create({
      user: req.user.id,
      type: 'paper',
      action: 'Deleted paper',
      description: paperTitle,
      relatedModel: 'Paper'
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to paper
// @route   POST /api/papers/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    paper.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await paper.save();

    res.json({ success: true, data: paper });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Paper title is required'],
    trim: true
  },
  authors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['lead', 'co-author', 'contributor'],
      default: 'co-author'
    }
  }],
  abstract: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'under-review', 'revision-needed', 'accepted', 'published', 'rejected'],
    default: 'in-progress'
  },
  venue: {
    name: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['journal', 'conference', 'workshop', 'arxiv'],
      default: 'conference'
    }
  },
  submissionDate: {
    type: Date
  },
  reviewDeadline: {
    type: Date
  },
  acceptanceDate: {
    type: Date
  },
  publicationDate: {
    type: Date
  },
  versions: [{
    version: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileUrl: String,
    notes: String
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  doi: {
    type: String,
    trim: true
  },
  arxivId: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
paperSchema.index({ 'authors.user': 1, status: 1 });
paperSchema.index({ status: 1, submissionDate: -1 });

export default mongoose.model('Paper', paperSchema);

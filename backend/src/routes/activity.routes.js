import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getActivities,
  getActivity,
  deleteActivity,
  clearActivities
} from '../controllers/activity.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getActivities)
  .delete(authorize('professor', 'admin'), clearActivities);  // Only supervisors can clear all

router.route('/:id')
  .get(getActivity)
  .delete(authorize('professor', 'admin'), deleteActivity);  // Only supervisors can delete activities

export default router;

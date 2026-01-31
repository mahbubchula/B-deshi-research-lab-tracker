import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getSharedDashboard, getPersonalDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Shared collaborative dashboard (everyone sees everyone's data)
router.get('/', getSharedDashboard);

// Personal dashboard (user's own data only)
router.get('/personal', getPersonalDashboard);

export default router;

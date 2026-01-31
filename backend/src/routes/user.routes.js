import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSupervisorDashboard,
  getAllActivities,
  assignSupervisor,
  getUserGoals,
  getUserPapers,
  getUserTasks
} from '../controllers/user.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Supervisor dashboard routes
router.get('/supervisor/dashboard', authorize('professor', 'admin'), getSupervisorDashboard);
router.get('/supervisor/activities', authorize('professor', 'admin'), getAllActivities);

// User management routes
router.route('/')
  .get(authorize('professor', 'admin'), getAllUsers);

router.route('/:id')
  .get(authorize('professor', 'admin'), getUserById)
  .put(authorize('professor', 'admin'), updateUser)
  .delete(authorize('professor', 'admin'), deleteUser);  // Allow professors to delete users

// Assign supervisor
router.put('/:id/assign-supervisor', authorize('admin'), assignSupervisor);

// Get user's data (supervisor can view any user's data)
router.get('/:id/goals', authorize('professor', 'admin'), getUserGoals);
router.get('/:id/papers', authorize('professor', 'admin'), getUserPapers);
router.get('/:id/tasks', authorize('professor', 'admin'), getUserTasks);

export default router;

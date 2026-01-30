import express from 'express';
import { getGoals, getGoal, createGoal, updateGoal, deleteGoal, getGoalStats } from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.get('/stats', getGoalStats);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

export default router;

import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getPersonalTodos,
  getPersonalTodo,
  createPersonalTodo,
  updatePersonalTodo,
  deletePersonalTodo,
  getPersonalTodoStats
} from '../controllers/personalTodo.controller.js';

const router = express.Router();

// Protect all routes and restrict to professors/admins only
router.use(protect);
router.use(authorize('professor', 'admin'));

// Stats route must come before /:id route
router.get('/stats', getPersonalTodoStats);

router.route('/')
  .get(getPersonalTodos)
  .post(createPersonalTodo);

router.route('/:id')
  .get(getPersonalTodo)
  .put(updatePersonalTodo)
  .delete(deletePersonalTodo);

export default router;

import express from 'express';
import { 
  getPapers, 
  getPaper, 
  createPaper, 
  updatePaper, 
  deletePaper,
  addComment 
} from '../controllers/paper.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPapers)
  .post(createPaper);

router.route('/:id')
  .get(getPaper)
  .put(updatePaper)
  .delete(deletePaper);

router.post('/:id/comments', addComment);

export default router;

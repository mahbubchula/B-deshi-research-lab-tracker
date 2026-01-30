import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
const router = express.Router();
router.use(protect);
router.get('/', authorize('professor', 'admin'), async (req, res) => {
  res.json({ success: true, data: [] });
});
export default router;

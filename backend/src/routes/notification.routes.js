import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();
router.use(protect);
router.get('/', async (req, res) => res.json({ success: true, data: [] }));
export default router;

import express from 'express';
import { createProfile, getByUserId, updateByUserId } from '../controllers/worker.controller.js';

const router = express.Router();

router.post('/', createProfile);
router.get('/user/:userId', getByUserId);
router.patch('/user/:userId', updateByUserId);

export default router;

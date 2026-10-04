// server/routes/chatRoutes.js
import express from 'express';
import { askChatbot } from '../controllers/chatController.js';

const router = express.Router();

router.post('/ask', askChatbot);

export default router;

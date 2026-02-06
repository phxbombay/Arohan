import express from 'express';
import { getChatHistory, sendMessage, createChat } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.post('/sessions', createChat);
router.get('/sessions/:chatId/history', getChatHistory);
router.post('/sessions/:chatId/message', sendMessage);

export default router;

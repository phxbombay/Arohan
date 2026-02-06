import pool from '../config/db.js';
import logger from '../config/logger.js';

/**
 * @desc    Create a new chat session
 * @route   POST /v1/chatbot/sessions
 * @access  Private
 */
export const createChat = async (req, res) => {
    try {
        const userId = req.user.user_id; // from protect middleware
        const { title } = req.body;

        const newChat = await pool.query(
            `INSERT INTO chats (user_id, title) 
             VALUES ($1, $2) 
             RETURNING chat_id, title, status, created_at`,
            [userId, title || 'New Chat']
        );

        // Add initial bot greeting
        await pool.query(
            `INSERT INTO chat_messages (chat_id, sender, content)
             VALUES ($1, 'bot', $2)`,
            [newChat.rows[0].chat_id, "Hi! I'm Arohan's AI Assistant. How can I help you today?"]
        );

        res.status(201).json({
            status: 'success',
            data: newChat.rows[0]
        });
    } catch (error) {
        logger.error('Create Chat Error:', error);
        res.status(500).json({ message: 'Server error creating chat session' });
    }
};

/**
 * @desc    Get chat history
 * @route   GET /v1/chatbot/sessions/:chatId/history
 * @access  Private
 */
export const getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Verify ownership
        const chatCheck = await pool.query(
            'SELECT user_id FROM chats WHERE chat_id = $1',
            [chatId]
        );

        if (chatCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (chatCheck.rows[0].user_id !== req.user.user_id) {
            return res.status(403).json({ message: 'Not active user' });
        }

        const messages = await pool.query(
            'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC',
            [chatId]
        );

        res.json({
            status: 'success',
            count: messages.rows.length,
            data: messages.rows
        });
    } catch (error) {
        logger.error('Get Chat History Error:', error);
        res.status(500).json({ message: 'Server error fetching chat history' });
    }
};

/**
 * @desc    Send a message
 * @route   POST /v1/chatbot/sessions/:chatId/message
 * @access  Private
 */
export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const userId = req.user.user_id;

        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        // Verify ownership
        const chatCheck = await pool.query(
            'SELECT user_id FROM chats WHERE chat_id = $1',
            [chatId]
        );

        if (chatCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (chatCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Not allowed' });
        }

        // 1. Save User Message
        const userMsg = await pool.query(
            `INSERT INTO chat_messages (chat_id, sender, content)
             VALUES ($1, 'user', $2)
             RETURNING *`,
            [chatId, text]
        );

        // 2. Generate Bot Response (Mock AI Logic for now - can replace with OpenAI call)
        const botResponse = generateBotResponse(text);

        // 3. Save Bot Message
        const botMsg = await pool.query(
            `INSERT INTO chat_messages (chat_id, sender, content, metadata)
             VALUES ($1, 'bot', $2, $3)
             RETURNING *`,
            [chatId, botResponse.text, JSON.stringify({ action: botResponse.action })]
        );

        res.status(201).json({
            status: 'success',
            data: {
                userMessage: userMsg.rows[0],
                botMessage: botMsg.rows[0]
            }
        });

    } catch (error) {
        logger.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

// Simple Rule-Based Logic (Moved from Frontend to Backend)
const generateBotResponse = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('emergency') || lowerText.includes('sos') || lowerText.includes('help')) {
        return {
            text: "🚨 If this is a medical emergency, please press the SOS button immediately or call an ambulance. I can help you find nearby hospitals.",
            action: 'emergency'
        };
    }

    if (lowerText.includes('doctor') || lowerText.includes('physician')) {
        return {
            text: "I can help you find specialist doctors. Would you like to view our list of partner physicians?",
            action: 'doctor'
        };
    }

    if (lowerText.includes('appointment') || lowerText.includes('book')) {
        return {
            text: "You can book appointments directly through our partner hospitals page.",
            action: 'appointment'
        };
    }

    if (lowerText.includes('support') || lowerText.includes('contact')) {
        return {
            text: "Our support team is available 24/7. You can fill out our contact form or email us at support@arohanhealth.com.",
            action: 'support'
        };
    }

    return {
        text: "I'm still learning! You can try asking about emergencies, doctors, appointments, or support.",
        action: null
    };
};

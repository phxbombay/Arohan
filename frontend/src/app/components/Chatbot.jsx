import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Avatar,
    Fab,
    Grow,
    Stack,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
    LocalHospital,
    Emergency,
    CalendarMonth,
    SupportAgent,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
// @ts-ignore
import api from '../../services/api';
import { safeDate } from '../../utils/date-utils';

const INITIAL_MESSAGES = [
    {
        id: 1,
        text: "Hi! I'm Arohan's AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
    }
];

const SUGGESTIONS = [
    { label: 'Emergency Help', icon: <Emergency fontSize="small" />, action: 'emergency' },
    { label: 'Find a Doctor', icon: <LocalHospital fontSize="small" />, action: 'doctor' },
    { label: 'Book Appointment', icon: <CalendarMonth fontSize="small" />, action: 'appointment' },
    { label: 'Customer Support', icon: <SupportAgent fontSize="small" />, action: 'support' },
];

export function Chatbot() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [connectionError, setConnectionError] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // Fetch chat history on mount
    useEffect(() => {
        if (isOpen) {
            loadChatHistory();
        }
    }, [isOpen]);

    const createNewSession = async () => {
        try {
            const res = await api.post('/chatbot/sessions', { title: 'New Conversation' });
            if (res.data.status === 'success') {
                localStorage.setItem('arohan_chat_id', res.data.data.chat_id);
                setMessages(INITIAL_MESSAGES);
                setConnectionError(false);
                return res.data.data.chat_id;
            }
        } catch (error) {
            console.error("Failed to create session", error);
            setConnectionError(true);
        }
        return null;
    };

    const loadChatHistory = async () => {
        try {
            const savedChatId = localStorage.getItem('arohan_chat_id');

            if (savedChatId) {
                try {
                    const res = await api.get(`/chatbot/sessions/${savedChatId}/history`);
                    if (res.data.status === 'success') {
                        const formattedMessages = res.data.data.map(msg => ({
                            id: msg.message_id,
                            text: msg.content,
                            sender: msg.sender,
                            timestamp: new Date(msg.created_at),
                            action: msg.metadata?.action
                        }));
                        if (formattedMessages.length > 0) {
                            setMessages(formattedMessages);
                        }
                    }
                } catch (err) {
                    // If session not found (404) or other error, create new session
                    if (err.response && (err.response.status === 404 || err.response.status === 403)) {
                        console.log("Session invalid, creating new one...");
                        localStorage.removeItem('arohan_chat_id');
                        await createNewSession();
                    } else {
                        throw err;
                    }
                }
            } else {
                await createNewSession();
            }
        } catch (error) {
            console.error("Failed to load chat history", error);
            setConnectionError(true);
        }
    };

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Optimistic UI Update - happens immediately
        const tempUserMsg = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, tempUserMsg]);
        setInput('');
        setIsTyping(true);

        // Try to get or create session in the background
        let currentChatId = localStorage.getItem('arohan_chat_id');

        // Trigger simulated bot response after a short delay
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "This feature will be enabled soon",
                    sender: 'bot',
                    timestamp: new Date(),
                    isBlue: true
                }
            ]);
            setIsTyping(false);
        }, 800);

        // Async background task to sync with backend (non-blocking)
        try {
            if (!currentChatId) {
                currentChatId = await createNewSession();
            }
            if (currentChatId) {
                await api.post(`/chatbot/sessions/${currentChatId}/message`, { text });
            }
        } catch (error) {
            console.warn("Chatbot: Background sync failed", error);
            // We don't block the UI for this
        }
    };

    const generateResponse = (text) => {
        // Deprecated: Logic moved to backend
        return {};
    };

    const handleNavigation = (actionType) => {
        switch (actionType) {
            case 'emergency': navigate('/nearby-hospitals'); break;
            case 'doctor': navigate('/healthcare-professionals'); break;
            case 'appointment': navigate('/partner-hospitals'); break;
            case 'support': navigate('/contact'); break;
            default: break;
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion.label);
    };

    // Claymorphism Styles
    const clayContainer = {
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha('#ffffff', 0.8),
        borderRadius: '24px',
        boxShadow: `
            8px 8px 16px 0 ${alpha(theme.palette.primary.main, 0.15)},
            -8px -8px 16px 0 ${alpha('#ffffff', 0.8)},
            inset 0 0 0 1px ${alpha('#ffffff', 0.5)}
        `,
        border: `1px solid ${alpha('#ffffff', 0.4)}`,
    };

    const clayInput = {
        backgroundColor: alpha('#f0f2f5', 0.6),
        boxShadow: `inset 4px 4px 8px ${alpha('#d1d9e6', 0.5)}, inset -4px -4px 8px #ffffff`,
        borderRadius: '16px',
        border: 'none',
        '& fieldset': { border: 'none' }
    };

    return (
        <>
            <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}>
                <Grow in={isOpen}>
                    <Paper
                        elevation={0}
                        sx={{
                            ...clayContainer,
                            width: { xs: 'calc(100vw - 40px)', sm: 340 },
                            height: 'auto',
                            maxHeight: '75vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: 84,
                            right: 0,
                            transformOrigin: 'bottom right'
                        }}
                    >
                        {/* Header */}
                        <Box sx={{
                            p: 2.5,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.95)})`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    boxShadow: 'inner 2px 2px 5px rgba(0,0,0,0.1)'
                                }}>
                                    <BotIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        Arohan Assistant
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box component="span" sx={{ width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%', display: 'inline-block' }} />
                                        Online
                                    </Typography>
                                </Box>
                            </Stack>
                            <Box>
                                <IconButton size="small" onClick={loadChatHistory} sx={{ color: 'white', mr: 0.5 }}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Messages Area */}
                        <Box sx={{
                            flex: 1,
                            p: 1.5,
                            overflowY: 'auto',
                            bgcolor: 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            minHeight: 250
                        }}>
                            {connectionError && (
                                <Box sx={{ textAlign: 'center', my: 2 }}>
                                    <Typography variant="caption" color="error">
                                        Connection issues detected. Retrying...
                                    </Typography>
                                </Box>
                            )}

                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%'
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            position: 'relative',
                                            bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                            color: msg.sender === 'user' ? 'white' : (msg.isBlue ? 'primary.main' : 'text.primary'),
                                            boxShadow: msg.sender === 'user'
                                                ? `4px 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                                                : '4px 4px 12px rgba(0,0,0,0.05)',
                                            borderTopRightRadius: msg.sender === 'user' ? 4 : 24,
                                            borderTopLeftRadius: msg.sender === 'bot' ? 4 : 24,
                                            borderBottomLeftRadius: 24,
                                            borderBottomRightRadius: 24,
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                lineHeight: 1.6,
                                                fontWeight: msg.isBlue ? 600 : 400,
                                                color: msg.isBlue ? 'primary.main' : 'inherit'
                                            }}
                                        >
                                            {msg.text}
                                        </Typography>
                                    </Paper>
                                    {msg.action && (
                                        <Stack direction="row" spacing={1} mt={1} ml={1}>
                                            <Chip
                                                label="View Details"
                                                onClick={() => handleNavigation(msg.action)}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                icon={<SendIcon sx={{ transform: 'rotate(-45deg)', fontSize: 14 }} />}
                                                sx={{ bgcolor: 'white', border: 'none', boxShadow: '2px 2px 6px rgba(0,0,0,0.1)' }}
                                            />
                                        </Stack>
                                    )}
                                    <Typography variant="caption" sx={{ ml: 1, mt: 0.5, opacity: 0.6, fontSize: '0.7rem' }}>
                                        {safeDate(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            ))}

                            {isTyping && (
                                <Box sx={{ alignSelf: 'flex-start', ml: 1 }}>
                                    <Paper sx={{
                                        p: 1.5,
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        boxShadow: '2px 2px 8px rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        gap: 0.5
                                    }}>
                                        <Box sx={{ width: 6, height: 6, bgcolor: theme.palette.primary.main, borderRadius: '50%', animation: 'bounce 1s infinite 0s' }} />
                                        <Box sx={{ width: 6, height: 6, bgcolor: theme.palette.primary.main, borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                                        <Box sx={{ width: 6, height: 6, bgcolor: theme.palette.primary.main, borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                                        <style>
                                            {`
                                                @keyframes bounce {
                                                    0%, 100% { transform: translateY(0); }
                                                    50% { transform: translateY(-4px); }
                                                }
                                            `}
                                        </style>
                                    </Paper>
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Suggestions */}
                        {messages.length < 3 && (
                            <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {SUGGESTIONS.map((s) => (
                                    <Chip
                                        key={s.label}
                                        icon={s.icon}
                                        label={s.label}
                                        onClick={() => handleSuggestionClick(s)}
                                        size="small"
                                        sx={{
                                            bgcolor: 'white',
                                            border: 'none',
                                            boxShadow: '3px 3px 8px rgba(0,0,0,0.05)',
                                            borderRadius: '12px',
                                            py: 0.5,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '4px 4px 12px rgba(0,0,0,0.1)',
                                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Input Area */}
                        <Box sx={{ p: 1.5, bgcolor: alpha('#ffffff', 0.6), borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Stack direction="row" spacing={1.5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    InputProps={{
                                        sx: clayInput
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        boxShadow: `3px 3px 10px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            transform: 'scale(1.05)'
                                        },
                                        '&:disabled': {
                                            bgcolor: alpha(theme.palette.grey[400], 0.5)
                                        }
                                    }}
                                >
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Paper>
                </Grow>

                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        position: 'absolute',
                        bottom: 80,
                        right: 16,
                        width: 56,
                        height: 56,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }
                    }}
                >
                    {isOpen ? <CloseIcon /> : <ChatIcon />}
                </Fab>
            </Box>
        </>
    );
}

export default Chatbot;

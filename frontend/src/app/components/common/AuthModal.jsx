import { useState, useEffect } from 'react';
import { Mail, Lock, User, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Stack,
    Alert,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
// @ts-ignore
import { useAuth } from '../../../features/auth/hooks/useAuth';
// @ts-ignore
import { useAuthStore } from '../../../features/auth/store/authStore'; // Import store to get user state for redirect

import { useNavigate } from 'react-router-dom';

export function AuthModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
    const [resetSubmitted, setResetSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });

    const { login, register, isLoading, error } = useAuth();

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setView('login');
            setResetSubmitted(false);
            setFormData({ email: '', password: '', fullName: '' });
            // Clear error if possible, but useAuth doesn't expose clean way unless we use store action directly
            // useAuthStore.getState().clearError();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;

        try {
            if (view === 'login') {
                await login({ email: formData.email, password: formData.password });
                success = true;
            } else if (view === 'register') {
                await register({
                    full_name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: 'patient' // Default role
                });
                success = true;
            } else if (view === 'forgot') {
                // Mock Password Reset
                setTimeout(() => {
                    setResetSubmitted(true);
                }, 1000);
                return;
            }

            if (success) {
                onClose();

                // Get user from store after login
                const user = useAuthStore.getState().user;
                console.log('✅ AuthModal - Login successful');
                console.log('🔍 User object:', user);
                console.log('🔍 User role:', user?.role);

                // Check if admin (case-insensitive)
                const isAdmin = user?.role && user.role.toLowerCase() === 'admin';

                if (isAdmin) {
                    console.log('✅ ADMIN USER - Redirecting to /admin');
                    navigate('/admin', { replace: true });
                } else {
                    console.log('📍 REGULAR USER - Redirecting to /dashboard');
                    navigate('/dashboard', { replace: true });
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            // Error handling is managed by store (sets 'error' state)
        }
    };

    const toggleView = (newView) => {
        setView(newView);
        setResetSubmitted(false);
        useAuthStore.setState({ error: null });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    {view === 'login' && 'Welcome Back'}
                    {view === 'register' && 'Create Account'}
                    {view === 'forgot' && 'Reset Password'}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {view === 'forgot' && resetSubmitted ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{
                            mx: 'auto',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'success.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'success.main'
                        }}>
                            <Mail fontSize="large" />
                        </Box>
                        <Typography variant="h6" gutterBottom>Check Your Email</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            We've sent password reset instructions to <strong>{formData.email}</strong>
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => toggleView('login')}
                            sx={{ mt: 2 }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {view === 'login' && 'Enter your credentials to access your dashboard.'}
                            {view === 'register' && 'Join Arohan to protect your loved ones.'}
                            {view === 'forgot' && "Enter your email and we'll send you a reset link."}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2.5}>
                                {view === 'register' && (
                                    <TextField
                                        id="fullName"
                                        label="Full Name"
                                        fullWidth
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}

                                <TextField
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    fullWidth
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {view !== 'forgot' && (
                                    <Box>
                                        <TextField
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            label="Password"
                                            fullWidth
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {view === 'login' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleView('forgot')}
                                                    sx={{ textTransform: 'none', minWidth: 'auto', p: 0.5 }}
                                                >
                                                    Forgot password?
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={isLoading}
                                    sx={{ py: 1.5 }}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : (
                                        view === 'login' ? 'Sign In' :
                                            view === 'register' ? 'Sign Up' : 'Send Reset Link'
                                    )}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {view === 'login' ? "Don't have an account? " :
                                    view === 'register' ? 'Already have an account? ' :
                                        'Remember your password? '}
                                <Box
                                    component="button"
                                    onClick={() => toggleView(view === 'register' ? 'login' : view === 'login' ? 'register' : 'login')}
                                    sx={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        p: 0,
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    {view === 'login' ? 'Sign up' : 'Sign in'}
                                </Box>
                            </Typography>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

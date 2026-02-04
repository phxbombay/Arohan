/**
 * Sign In Page - Refactored with New Architecture
 * Uses: @features/auth for auth logic, @shared/components/ui for UI components
 */

import { useState, FormEvent, ChangeEvent } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Link as MuiLink,
    Button as MuiButton,
    IconButton
} from '@mui/material';
import {
    PersonOutline,
    EmailOutlined,
    LockOutlined,
    PhoneOutlined,
    Favorite,
    ArrowForward,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import type { LoginCredentials, RegisterData } from '@features/auth/types/auth.types';

export function SignInPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isLoading, error, user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: ''
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // Login
                const credentials: LoginCredentials = {
                    email: formData.email,
                    password: formData.password
                };
                await login(credentials);
            } else {
                // Register
                const registerPayload: RegisterData = {
                    full_name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'patient'
                };
                await register(registerPayload);
            }

            // Navigate based on user role
            const from = (location.state as any)?.from || '/dashboard';

            // Get user from store after login/register
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from);
            }
        } catch (err) {
            // Error is already handled by the auth store
            console.error('Auth error:', err);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.50',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 12
            }}
        >
            <Container maxWidth="sm">
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
                        <Favorite sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h4" component="h2" fontWeight="800" align="center" gutterBottom>
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Or{' '}
                        <MuiLink
                            component="button"
                            variant="body2"
                            onClick={() => setIsLogin(!isLogin)}
                            sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'none' }}
                        >
                            {isLogin ? 'create a new account' : 'sign in to existing account'}
                        </MuiLink>
                    </Typography>
                </Box>

                {/* Form */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
                    {/* Error Display */}
                    {error && (
                        <Box
                            sx={{
                                mb: 2,
                                p: 2,
                                bgcolor: 'error.light',
                                color: 'error.dark',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'error.main'
                            }}
                        >
                            <Typography variant="body2" fontWeight="bold">
                                Error: {error}
                            </Typography>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Full Name (Register only) */}
                            {!isLogin && (
                                <TextField
                                    id="name"
                                    name="name"
                                    label="Full Name"
                                    required
                                    fullWidth
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}

                            {/* Email */}
                            <TextField
                                id="email"
                                name="email"
                                label="Email address"
                                type="email"
                                required
                                fullWidth
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Password */}
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                fullWidth
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                helperText={!isLogin ? 'Min 8 characters, with uppercase, lowercase, and number' : ''}
                            />

                            {/* Contact (Register only) */}
                            {!isLogin && (
                                <TextField
                                    id="contact"
                                    name="contact"
                                    label="Contact Number"
                                    type="tel"
                                    fullWidth
                                    placeholder="+91 98765 43210"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneOutlined color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}

                            {/* Submit Button */}
                            <MuiButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                endIcon={!isLoading && <ArrowForward />}
                                sx={{ py: 1.5, fontWeight: 600 }}
                            >
                                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                            </MuiButton>
                        </Box>
                    </form>

                    {/* Footer */}

                </Paper>
            </Container>
        </Box>
    );
}

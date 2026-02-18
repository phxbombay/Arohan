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
    IconButton,
    FormControlLabel,
    Checkbox,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
    PersonOutline,
    EmailOutlined,
    LockOutlined,
    PhoneOutlined,
    Favorite,
    ArrowForward,
    Visibility,
    VisibilityOff,
    ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import type { LoginCredentials, RegisterData } from '@features/auth/types/auth.types';

export function SignInPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, verifyOTP, resendOTP, isLoading, error, user } = useAuth();

    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [unverifiedUserId, setUnverifiedUserId] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const countryConfigs = {
        '+91': { label: 'IN', placeholder: '98765 43210', length: 10 },
        '+1': { label: 'US', placeholder: '(555) 000-0000', length: 10 },
        '+44': { label: 'UK', placeholder: '7700 900000', length: 10 },
        '+971': { label: 'UAE', placeholder: '50 123 4567', length: 9 },
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        countryCode: '+91'
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('🤠 SignInPage: handleSubmit called', { isLogin, formData });

        try {
            if (isLogin) {
                // Login
                const credentials: LoginCredentials = {
                    email: formData.email,
                    password: formData.password
                };
                const result = await login(credentials);

                // Check if result indicates unverified account
                if (result && typeof result === 'object' && 'unverified' in result) {
                    setUnverifiedUserId(result.user_id);
                    setShowOTPVerification(true);
                    startTimer();
                    return;
                }
            } else {
                // Register
                const registerPayload: RegisterData = {
                    full_name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'patient',
                    // @ts-ignore - added to backend
                    phone_number: `${formData.countryCode}${formData.contact}`
                };
                console.log('🤠 SignInPage: Calling register with payload:', registerPayload);
                const response = await register(registerPayload);

                // Auto-login (OTP Disabled)
                console.log('✅ Registration successful, logging in...');
                completeLogin();
                return;
            }

            // If we get here, login was successful and account is active
            completeLogin();
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    const completeLogin = () => {
        const from = (location.state as any)?.from || '/dashboard';
        const role = (user?.role || localStorage.getItem('user_role') || 'patient').toLowerCase();

        if (role === 'admin') {
            console.log('🚀 Navigating to /admin');
            navigate('/admin');
        } else {
            console.log(`🚀 Navigating to ${from}`);
            navigate(from);
        }
    };

    const handleVerifyOTP = async (e: FormEvent) => {
        e.preventDefault();
        if (!unverifiedUserId) return;

        try {
            await verifyOTP(unverifiedUserId, otpCode);
            // After successful verification, navigate
            completeLogin();
        } catch (err) {
            console.error('Verification error:', err);
        }
    };

    const handleResendOTP = async () => {
        if (!unverifiedUserId || resendTimer > 0) return;

        try {
            await resendOTP(unverifiedUserId);
            startTimer();
        } catch (err) {
            console.error('Resend error:', err);
        }
    };

    const startTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        if (name === 'contact') {
            const digitsOnly = (value as string).replace(/\D/g, '');
            const config = countryConfigs[formData.countryCode as keyof typeof countryConfigs];
            if (digitsOnly.length <= config.length) {
                setFormData(prev => ({ ...prev, [name]: digitsOnly }));
            }
            return;
        }

        if (name === 'countryCode') {
            // Reset contact if country changes to avoid invalid length
            setFormData(prev => ({ ...prev, [name]: value as string, contact: '' }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    return (
        <Box
            sx={{
                minHeight: '100dvh',
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

                    {showOTPVerification ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Typography variant="body1" align="center" color="text.secondary">
                                Please enter the 6-digit verification code sent to your email and phone.
                            </Typography>

                            <form onSubmit={handleVerifyOTP}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        id="otp"
                                        label="Verification Code"
                                        required
                                        fullWidth
                                        placeholder="123456"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        inputProps={{
                                            maxLength: 6,
                                            style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                                        }}
                                    />

                                    <MuiButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={isLoading || otpCode.length !== 6}
                                        sx={{ py: 1.5, fontWeight: 600 }}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                    </MuiButton>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <MuiButton
                                            onClick={handleResendOTP}
                                            disabled={resendTimer > 0 || isLoading}
                                            variant="text"
                                            size="small"
                                        >
                                            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Verification Code'}
                                        </MuiButton>
                                    </Box>

                                    <MuiLink
                                        component="button"
                                        variant="body2"
                                        onClick={() => setShowOTPVerification(false)}
                                        sx={{ textAlign: 'center', mt: 1 }}
                                    >
                                        Back to {isLogin ? 'Sign In' : 'Registration'}
                                    </MuiLink>
                                </Box>
                            </form>
                        </Box>
                    ) : (
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
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                        <FormControl sx={{ width: '130px', flexShrink: 0 }}>
                                            <InputLabel id="country-code-label">Country</InputLabel>
                                            <Select
                                                labelId="country-code-label"
                                                name="countryCode"
                                                value={formData.countryCode}
                                                // @ts-ignore
                                                onChange={handleChange}
                                                label="Country"
                                                sx={{
                                                    height: '56px',
                                                    '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
                                                }}
                                            >
                                                {Object.entries(countryConfigs).map(([code, config]) => (
                                                    <MenuItem key={code} value={code}>
                                                        {config.label} ({code})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            id="contact"
                                            name="contact"
                                            label="Phone Number"
                                            type="tel"
                                            required
                                            fullWidth
                                            placeholder={countryConfigs[formData.countryCode as keyof typeof countryConfigs].placeholder}
                                            value={formData.contact}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneOutlined color="action" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{ flexGrow: 1 }}
                                            helperText={
                                                formData.contact.length > 0 &&
                                                    formData.contact.length < countryConfigs[formData.countryCode as keyof typeof countryConfigs].length
                                                    ? `Enter ${countryConfigs[formData.countryCode as keyof typeof countryConfigs].length} digits`
                                                    : ''
                                            }
                                            error={
                                                formData.contact.length > 0 &&
                                                formData.contact.length < countryConfigs[formData.countryCode as keyof typeof countryConfigs].length
                                            }
                                        />
                                    </Box>
                                )}

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="rememberMe"
                                            color="primary"
                                            defaultChecked
                                        />
                                    }
                                    label="Remember me"
                                />

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
                    )}

                    {/* Footer */}

                </Paper>
            </Container>
        </Box>
    );
}

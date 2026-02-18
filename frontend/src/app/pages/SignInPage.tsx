import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  Box,
  Button as MuiButton,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Link as MuiLink,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  PhoneOutlined,
  Favorite,
  ArrowForward,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { RegisterData, LoginCredentials } from "../../features/auth/types/auth.types";


export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, verifyOTP, resendOTP, isLoading, error, user } = useAuth();
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [unverifiedUserId, setUnverifiedUserId] = useState<string | null>(null);

  const countryConfigs = {
    '+91': { label: 'IN', placeholder: '98765 43210', length: 10 },
    '+1': { label: 'US', placeholder: '(555) 000-0000', length: 10 },
    '+44': { label: 'UK', placeholder: '7700 900000', length: 10 },
    '+971': { label: 'UAE', placeholder: '50 123 4567', length: 9 },
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    countryCode: "+91"
  });

  const startTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeLogin = () => {
    // This function is called after successful login/registration (if no OTP is needed)
    // or after successful OTP verification.
    // The useEffect will handle the actual navigation based on the 'user' state.
    // This function primarily exists to make the intent clear and could be expanded
    // for other post-auth actions if needed.
    console.log('Authentication successful, preparing for navigation...');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unverifiedUserId || otpCode.length !== 6) return;

    try {
      await verifyOTP(unverifiedUserId, otpCode);
      setShowOTPVerification(false);
      setOtpCode('');
      setUnverifiedUserId(null);
      completeLogin();
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };

  const handleResendOTP = async () => {
    if (!unverifiedUserId) return;
    try {
      await resendOTP(unverifiedUserId);
      startTimer();
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        const registerPayload: RegisterData = {
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'patient',
          // @ts-ignore
          phone_number: `${formData.countryCode}${formData.contact}`
        };
        const response = await register(registerPayload);

        // @ts-ignore
        setUnverifiedUserId(response.user_id);
        setShowOTPVerification(true);
        startTimer();
        return;
      }

      // If login/register was successful and no OTP is needed, navigate immediately.
      // The useEffect below will also catch this, but this provides immediate feedback.
      completeLogin();

    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  // Effect to handle redirection when user becomes authenticated
  useEffect(() => {
    console.log('🔍 SignInPage useEffect - User changed:', user);
    if (user || localStorage.getItem('token')) {
      const storedRole = localStorage.getItem('user_role');
      const finalRole = (user?.role || storedRole || '').toLowerCase();

      console.log('🔍 SignInPage useEffect - Role:', finalRole);

      // Admin users ALWAYS go to /admin, no exceptions
      if (finalRole === 'admin') {
        console.log('✅ ADMIN DETECTED - REDIRECTING TO /admin');
        navigate('/admin', { replace: true });
      } else {
        // Non-admin users go to dashboard
        const from = location.state?.from || '/dashboard';
        console.log('⚠️ NON-ADMIN - REDIRECTING TO', from);
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, location]);


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
      setFormData(prev => ({ ...prev, [name]: value as string, contact: '' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 12 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
            <Favorite sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" component="h2" fontWeight="800" align="center" gutterBottom>
            {isLogin ? (showOTPVerification ? 'Verify Account' : 'Sign in to your account') : (showOTPVerification ? 'Verify Account' : 'Create your account')}
          </Typography>
          {!showOTPVerification && (
            <Typography variant="body2" color="text.secondary" align="center">
              Or{' '}
              <MuiLink
                component="button"
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ fontWeight: 500, color: 'primary.main', textDecoration: 'none' }}
              >
                {isLogin ? "create a new account" : "sign in to existing account"}
              </MuiLink>
            </Typography>
          )}
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1, border: 1, borderColor: 'error.main' }}>
              <Typography variant="body2" fontWeight="bold">Error: {error}</Typography>
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
                    ),
                  }}
                />

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
                />

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

                <MuiButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  endIcon={!isLoading && <ArrowForward />}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                </MuiButton>
              </Box>
            </form>
          )}

          {isLogin && !showOTPVerification && (
            <Box sx={{ mt: 3, position: 'relative', textAlign: 'center' }}>
              <Box sx={{ position: 'absolute', top: '50%', width: '100%', borderTop: 1, borderColor: 'grey.300' }} />
              <Typography variant="caption" sx={{ position: 'relative', px: 1, bgcolor: 'background.paper', color: 'text.secondary' }}>
                Trusted by 50,000+ users
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

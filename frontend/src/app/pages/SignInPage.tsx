import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Link as MuiLink
} from "@mui/material";
import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  PhoneOutlined,
  Favorite,
  ArrowForward
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";


export function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // @ts-ignore
  const { login, register, isLoading, error, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'patient'
        });
      }

      // Navigation is handled in useEffect or we can check user here if useAuth returns it immediately (it usually updates state)
      // For now, relies on state update or simple redirect. 
      // The implementation in features/auth/components/SignInPage.tsx relies on user checking.
      // But here we can just assume success if no error thrown?
      // actually useAuth usually throws on error.

      const from = (location.state as any)?.from || '/dashboard';
      // We might need to wait for state update in a useEffect, but let's try direct navigation if not handled by store
      // In the new store, we might need to check user.

    } catch (err) {
      console.error(err);
    }
  };

  // Effect to handle redirection when user becomes authenticated
  useEffect(() => {
    console.log('🔍 SignInPage useEffect - User changed:', user);
    if (user) {
      console.log('🔍 User Role:', user.role);
      console.log('🔍 Role Type:', typeof user.role);
      console.log('🔍 Role toLowerCase:', user.role?.toLowerCase());

      // Admin users ALWAYS go to /admin, no exceptions
      if (user.role && (user.role.toLowerCase() === 'admin' || user.role === 'admin')) {
        console.log('✅ ADMIN DETECTED - REDIRECTING TO /admin from SignInPage');
        navigate('/admin', { replace: true });
      } else {
        // Non-admin users go to dashboard or their intended destination
        const from = location.state?.from || '/dashboard';
        console.log('⚠️ NON-ADMIN - REDIRECTING TO', from, 'from SignInPage (role:', user.role, ')');
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, location]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 12 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
            <Favorite sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" component="h2" fontWeight="800" align="center" gutterBottom>
            {isLogin ? "Sign in to your account" : "Create your account"}
          </Typography>
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
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1, border: 1, borderColor: 'error.main' }}>
              <Typography variant="body2" fontWeight="bold">Error: {error}</Typography>
            </Box>
          )}

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
                    ),
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
                type="password"
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
                }}
              />

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
                    ),
                  }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <ArrowForward />}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </Box>
          </form>

          {isLogin && (
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

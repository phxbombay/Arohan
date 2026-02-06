import { Link, useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Box, Container, Grid, Typography, Stack, IconButton, Link as MuiLink } from '@mui/material';
import logo from '../../assets/logo_v2.jpg';

export function Footer() {
    const location = useLocation();

    const FooterLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} style={{ textDecoration: 'none' }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontWeight: isActive ? 600 : 400,
                        '&:hover': { color: 'primary.main' },
                        mb: 1
                    }}
                >
                    {children}
                </Typography>
            </Link>
        );
    };

    return (
        <Box component="footer" sx={{ bgcolor: 'grey.50', borderTop: 1, borderColor: 'grey.200', pt: 8, pb: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand Column */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box component="img" src={logo} alt="Arohan" sx={{ height: 32, borderRadius: 1 }} />
                                <Typography variant="h6" fontWeight="bold" color="primary">Arohan</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                Transforming health monitoring with AI-powered wearable technology.
                                Peace of mind for families, independence for everyone.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton component="a" href="https://facebook.com/arohanhealth" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Facebook size={20} /></IconButton>
                                <IconButton component="a" href="https://twitter.com/arohanhealth" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Twitter size={20} /></IconButton>
                                <IconButton component="a" href="https://instagram.com/arohanhealth" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Instagram size={20} /></IconButton>
                                <IconButton component="a" href="https://linkedin.com/company/arohanhealth" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Linkedin size={20} /></IconButton>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Solutions</Typography>
                        <Stack spacing={0}>
                            <FooterLink to="/for-elderly">Elderly & Families</FooterLink>
                            <FooterLink to="/for-doctors">Healthcare Providers</FooterLink>
                            <FooterLink to="/for-corporate">Corporate & Insurance</FooterLink>
                            <FooterLink to="/products">Arohan Wearable</FooterLink>
                            <FooterLink to="/pricing">Pricing</FooterLink>
                        </Stack>
                    </Grid>

                    {/* Company */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Company</Typography>
                        <Stack spacing={0}>
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/blog">Blog</FooterLink>
                            <FooterLink to="/careers">Careers</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                        </Stack>
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Contact</Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">Hasprana Health Care Solutions Pvt Ltd</Typography>
                            <Typography variant="body2" color="text.secondary">info@haspranahealth.com</Typography>
                            <Typography variant="body2" color="text.secondary">+91 70190 24300</Typography>
                            <Typography variant="body2" color="text.secondary">www.haspranahealth.com</Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'grey.200', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        © 2025 Hasprana Health Care Solutions. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Link to="/privacy" style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>Privacy Policy</Typography>
                        </Link>
                        <Link to="/terms" style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>Terms of Service</Typography>
                        </Link>
                        <Link to="/compliance" style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>Compliance</Typography>
                        </Link>
                        <Link to="/cookies" style={{ textDecoration: 'none' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>Cookies</Typography>
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

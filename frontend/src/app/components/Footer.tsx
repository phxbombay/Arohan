import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link as MuiLink,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Stack
} from "@mui/material";
import {
  LocalHospital as AmbulanceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as MapPinIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedinIcon,
  Language as GlobeIcon,
  Close as CloseIcon
} from "@mui/icons-material";

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);

  const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
    <IconButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        bgcolor: 'grey.800',
        color: 'common.white',
        transition: 'all 0.3s',
        '&:hover': {
          bgcolor: 'primary.main',
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(37, 99, 235, 0.4)'
        }
      }}
      size="small"
    >
      {icon}
    </IconButton>
  );

  return (
    <>
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 10, px: 2 }}>
        <Container maxWidth={false}>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* Brand Section */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex', boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}>
                  <AmbulanceIcon sx={{ color: 'common.white' }} />
                </Box>
                <Typography variant="h5" fontWeight="800" color="common.white" sx={{ letterSpacing: 1 }}>AROHAN</Typography>
              </Box>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3, lineHeight: 1.8 }}>
                Saving lives by providing medical help as fast as possible.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <SocialLink href="https://www.facebook.com/haspranahealth" icon={<FacebookIcon fontSize="small" />} />
                <SocialLink href="https://twitter.com/haspranahealth" icon={<TwitterIcon fontSize="small" />} />
                <SocialLink href="https://www.instagram.com/haspranahealth" icon={<InstagramIcon fontSize="small" />} />
                <SocialLink href="https://www.linkedin.com/company/hasprana-health-care-solutions-private-limited/" icon={<LinkedinIcon fontSize="small" />} />
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="common.white" gutterBottom sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'About Us', path: '/about' },
                  { label: 'How It Works', path: '/how-it-works' },
                  { label: 'Nearby Hospitals', path: '/nearby-hospitals' },
                  { label: 'Partner Hospitals', path: '/partner-hospitals' },
                  { label: 'Careers', path: '/careers' }
                ].map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    to={link.path}
                    color="inherit"
                    underline="none"
                    variant="body2"
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': { color: 'primary.light', transform: 'translateX(4px)' },
                      display: 'inline-block'
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>

            {/* Support */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="common.white" gutterBottom sx={{ mb: 2 }}>
                Support & Emergency
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/help-center" color="inherit" underline="none" variant="body2" sx={{ '&:hover': { color: 'primary.light' } }}>Help Center & FAQ</MuiLink>
                <MuiLink
                  component="button"
                  onClick={() => setShowContactModal(true)}
                  color="inherit"
                  underline="none"
                  variant="body2"
                  sx={{ textAlign: 'left', '&:hover': { color: 'primary.light' } }}
                >
                  Contact Support
                </MuiLink>
              </Stack>
            </Grid>

            {/* Newsletter / Location */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="common.white" gutterBottom sx={{ mb: 2 }}>
                Contact & Location
              </Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <PhoneIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="grey.500" display="block">Phone Support</Typography>
                    <Typography variant="body2" color="grey.300">Enabled Soon</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <EmailIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="grey.500" display="block">Email Us</Typography>
                    <MuiLink href="mailto:info@haspranahealth.com" color="inherit" underline="none" variant="body2" sx={{ wordBreak: 'break-all', '&:hover': { color: 'white' } }}>info@haspranahealth.com</MuiLink>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <MapPinIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="grey.500" display="block">Headquarters</Typography>
                    <Typography variant="body2" color="grey.300">Bengaluru, India</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2" color="grey.500">
                © 2026 AROHAN Emergency Services. All rights reserved.
              </Typography>
              <Stack direction="row" spacing={4}>
                {['Privacy', 'Terms', 'Cookies'].map((text) => (
                  <MuiLink key={text} component={Link} to={`/${text.toLowerCase()}`} variant="body2" color="grey.500" underline="none" sx={{ '&:hover': { color: 'common.white' } }}>
                    {text}
                  </MuiLink>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Contact Modal */}
      <Dialog
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Contact Us</Typography>
          <IconButton onClick={() => setShowContactModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Emergency */}
            <Box sx={{ bgcolor: 'error.50', border: 1, borderColor: 'error.main', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <PhoneIcon sx={{ color: 'error.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="error.dark">Emergency Hotline</Typography>
                  <MuiLink href="tel:112" variant="h5" fontWeight="bold" color="error.main" underline="none">112</MuiLink>
                  <Typography variant="body2" color="error.dark">24/7 Emergency Response</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Support */}
            <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'error.light', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <PhoneIcon sx={{ color: 'error.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Phone Support</Typography>
                  <Typography variant="h6" fontWeight="bold" color="error.main">Coming Soon</Typography>
                  <Typography variant="body2" color="text.secondary">This feature will be enabled soon</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Email */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <EmailIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Email</Typography>
                  <MuiLink href="mailto:info@haspranahealth.com" variant="body1" color="text.primary" underline="hover" sx={{ wordBreak: 'break-all' }}>info@haspranahealth.com</MuiLink>
                </Box>
              </Stack>
            </Box>

            {/* Website */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <GlobeIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Website</Typography>
                  <MuiLink href="https://haspranahealth.com" target="_blank" variant="body1" color="text.primary" underline="hover">haspranahealth.com</MuiLink>
                </Box>
              </Stack>
            </Box>

            {/* Location */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <MapPinIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">Office Location</Typography>
                  <Typography variant="body1" color="text.primary">MG Road, Bengaluru</Typography>
                  <Typography variant="body1" color="text.primary">Karnataka, India 560001</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Our team is here to help you 24/7 for any emergency or support needs.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
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

import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box component="img" src={logo} alt="Arohan" sx={{ height: 40, borderRadius: 1 }} />
                <Typography variant="h5" fontWeight="800" color="common.white" sx={{ letterSpacing: 1 }}>AROHAN</Typography>
              </Box>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3, lineHeight: 1.8 }}>
                {t("footer.tagline")}
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <SocialLink href="https://www.facebook.com/arohanhealth" icon={<FacebookIcon fontSize="small" />} />
                <SocialLink href="https://twitter.com/arohanhealth" icon={<TwitterIcon fontSize="small" />} />
                <SocialLink href="https://www.instagram.com/arohanhealth" icon={<InstagramIcon fontSize="small" />} />
                <SocialLink href="https://www.linkedin.com/company/arohan-health/" icon={<LinkedinIcon fontSize="small" />} />
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="common.white" gutterBottom sx={{ mb: 2 }}>
                {t("footer.quickLinks")}
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: t("nav.about"), path: '/about' },
                  { label: t("nav.howItWorks"), path: '/how-it-works' },
                  { label: t("nav.projectsOverview"), path: '/projects-overview' },
                  { label: t("nav.nearbyHospitals"), path: '/nearby-hospitals' },
                  { label: t("nav.partnerHospitals"), path: '/partner-hospitals' },
                  { label: t("nav.careers"), path: '/careers' }
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
                {t("footer.supportAndEmergency")}
              </Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} to="/help-center" color="inherit" underline="none" variant="body2" sx={{ '&:hover': { color: 'primary.light' } }}>{t("footer.helpCenter")}</MuiLink>
                <MuiLink component={Link} to="/security" color="inherit" underline="none" variant="body2" sx={{ '&:hover': { color: 'primary.light' } }}>{t("footer.security")}</MuiLink>
                <MuiLink
                  component="button"
                  onClick={() => setShowContactModal(true)}
                  color="inherit"
                  underline="none"
                  variant="body2"
                  sx={{ textAlign: 'left', '&:hover': { color: 'primary.light' } }}
                  >
                    {t("footer.contactSupport")}
                  </MuiLink>
                </Stack>
              </Grid>
  
              {/* Newsletter / Location */}
              <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="common.white" gutterBottom sx={{ mb: 2 }}>
                  {t("footer.contactAndLocation")}
                </Typography>
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <PhoneIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="grey.500" display="block">{t("footer.phoneSupport")}</Typography>
                      <MuiLink href="tel:+917019024300" color="inherit" underline="none" variant="body2" sx={{ '&:hover': { color: 'white' } }}>+91 70190 24300</MuiLink>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <EmailIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="grey.500" display="block">{t("footer.emailUs")}</Typography>
                    <MuiLink href="mailto:info@arohanhealth.com" color="inherit" underline="none" variant="body2" sx={{ wordBreak: 'break-all', '&:hover': { color: 'white' } }}>info@arohanhealth.com</MuiLink>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <MapPinIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="grey.500" display="block">{t("footer.headquarters")}</Typography>
                    <Typography variant="body2" color="grey.300">Bengaluru, India</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: 1, borderColor: 'grey.800', pt: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2" color="grey.500">
                {t("footer.copyright")}
              </Typography>
              <Stack direction="row" spacing={4}>
                {[
                  { key: 'privacy', path: '/privacy' },
                  { key: 'terms', path: '/terms' },
                  { key: 'security', path: '/security' },
                  { key: 'cookies', path: '/cookies' }
                ].map((item) => (
                  <MuiLink 
                    key={item.key} 
                    component={Link} 
                    to={item.path} 
                    variant="body2" 
                    color="grey.500" 
                    underline="none" 
                    sx={{ '&:hover': { color: 'common.white' } }}
                  >
                    {t(`footer.bottomLinks.${item.key}`)}
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
          <Typography variant="h5" fontWeight="bold">{t("footer.contactUsTitle")}</Typography>
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
                  <Typography variant="subtitle1" fontWeight="bold" color="error.dark">{t("footer.emergencyHotline")}</Typography>
                  <MuiLink href="tel:112" variant="h5" fontWeight="bold" color="error.main" underline="none">112</MuiLink>
                  <Typography variant="body2" color="error.dark">{t("footer.emergencyResponse")}</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Support */}
            <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'error.light', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <PhoneIcon sx={{ color: 'error.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{t("footer.phoneSupport")}</Typography>
                  <MuiLink href="tel:+917019024300" variant="h6" fontWeight="bold" color="error.main" underline="hover">+91 70190 24300</MuiLink>
                  <Typography variant="body2" color="text.secondary">{t("footer.contactAssistance")}</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Email */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <EmailIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{t("footer.email")}</Typography>
                  <MuiLink href="mailto:info@arohanhealth.com" variant="body1" color="text.primary" underline="hover" sx={{ wordBreak: 'break-all' }}>info@arohanhealth.com</MuiLink>
                </Box>
              </Stack>
            </Box>

            {/* Website */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <GlobeIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{t("footer.website")}</Typography>
                  <MuiLink href="https://arohanhealth.com" target="_blank" variant="body1" color="text.primary" underline="hover">arohanhealth.com</MuiLink>
                </Box>
              </Stack>
            </Box>

            {/* Location */}
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'grey.300', borderRadius: 2, p: 2 }}>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <MapPinIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{t("footer.officeLocation")}</Typography>
                  <Typography variant="body1" color="text.primary">{t("footer.officeAddress1")}</Typography>
                  <Typography variant="body1" color="text.primary">{t("footer.officeAddress2")}</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {t("footer.supportMessage")}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
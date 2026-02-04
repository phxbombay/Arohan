import { Ambulance, Heart, Phone } from "lucide-react";
import { Box, Button, Container, Typography, Chip, Stack, Grid, Paper } from "@mui/material";
import { Link } from 'react-router-dom';

export function HeroSection() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box component="section" sx={{
      position: 'relative',
      minHeight: 600,
      background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #eff6ff 100%)',
      py: { xs: 8, md: 12 },
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
          <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
            <Stack spacing={4}>
              <Box>
                <Chip
                  icon={<Heart size={16} />}
                  label="24/7 Emergency Care Available"
                  sx={{
                    bgcolor: 'error.50',
                    color: 'error.main',
                    fontWeight: 500,
                    px: 1
                  }}
                />
              </Box>

              <Typography variant="h1" sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                color: 'text.primary'
              }}>
                Emergency Help,<br />
                <Box component="span" sx={{ color: 'error.main' }}>Right When You Need It</Box>
              </Typography>

              <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, fontWeight: 400 }}>
                Saving lives with instant access to emergency services. Whether it's an accident, collapse, or heart stroke - every second matters. AI-powered voice assistance in your language, with image and video-guided first aid support.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component="a"
                  href="tel:112"
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<Phone size={20} />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.125rem',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Get Help Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={scrollToHowItWorks}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.125rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'grey.300',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'grey.400',
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  Learn More
                </Button>
              </Stack>

              {/* Stats Removed */}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'common.white'
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1745918949236-3c0fcc0bd13d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhbWJ1bGFuY2UlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2ODY0MTI4MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Emergency Medical Services"
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 3
                  }}
                />
              </Paper>

              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  bottom: -24,
                  left: -24,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'common.white',
                  maxWidth: 240,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: '50%', color: 'success.dark', display: 'flex' }}>
                    <Ambulance size={24} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Ambulance</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">2.5 km away</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
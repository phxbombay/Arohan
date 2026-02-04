import { MapPin, Ambulance, Phone, Clock } from "lucide-react";
import { Box, Container, Typography, Grid, Paper, Stack } from "@mui/material";

export function HowItWorks() {
  const steps = [
    {
      icon: <Phone size={32} />,
      title: "Press SOS",
      description: "Tap the emergency button anywhere on the page. Available 24/7.",
      bgcolor: "error.50",
      color: "error.main",
      borderColor: "error.200"
    },
    {
      icon: <MapPin size={32} />,
      title: "Location Shared",
      description: "Your location is automatically shared with emergency services.",
      bgcolor: "primary.50",
      color: "primary.main",
      borderColor: "primary.200"
    },
    {
      icon: <Ambulance size={32} />,
      title: "Help Dispatched",
      description: "Nearest ambulance and hospital are notified instantly.",
      bgcolor: "success.50",
      color: "success.main",
      borderColor: "success.200"
    },
    {
      icon: <Clock size={32} />,
      title: "Real-time Tracking",
      description: "Track ambulance arrival and get first aid guidance while you wait.",
      bgcolor: "secondary.50",
      color: "secondary.main",
      borderColor: "secondary.200"
    }
  ];

  return (
    <Box component="section" id="how-it-works" sx={{ py: 10, bgcolor: 'common.white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto' }}>
            Getting emergency help has never been simpler. Follow these 4 easy steps.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Box sx={{ position: 'relative' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: 2,
                    borderColor: 'grey.100',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{
                    position: 'absolute',
                    top: -12,
                    left: 24,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    color: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    zIndex: 2,
                    boxShadow: 2
                  }}>
                    {index + 1}
                  </Box>

                  <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: step.bgcolor,
                    color: step.color,
                    mb: 2
                  }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Paper>

                {/* Connector line for large screens */}
                {index < steps.length - 1 && (
                  <Box sx={{
                    display: { xs: 'none', lg: 'block' },
                    position: 'absolute',
                    top: '50%',
                    right: -20,
                    width: 40,
                    height: 2,
                    bgcolor: 'grey.200',
                    zIndex: 1
                  }} />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

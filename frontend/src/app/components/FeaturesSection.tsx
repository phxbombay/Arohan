import { Shield, Clock, MapPin, UserCheck, Stethoscope, Zap } from "lucide-react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap size={24} />,
      title: "Instant Response",
      description: "Connect to emergency services in under 2 seconds. Every second counts.",
      bgcolor: "error.100",
      color: "error.main",
      borderColor: "error.200"
    },
    {
      icon: <MapPin size={24} />,
      title: "Real-Time Tracking",
      description: "Track ambulance location live. Know exactly when help will arrive.",
      bgcolor: "primary.100",
      color: "primary.main",
      borderColor: "primary.200"
    },
    {
      icon: <Stethoscope size={24} />,
      title: "Medical Guidance",
      description: "Get professional first aid instructions while waiting for help.",
      bgcolor: "success.100",
      color: "success.main",
      borderColor: "success.200"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description: "Your medical data is encrypted and HIPAA compliant.",
      bgcolor: "info.100",
      color: "info.main",
      borderColor: "info.200"
    },
    {
      icon: <Clock size={24} />,
      title: "24/7 Availability",
      description: "Emergency support available round the clock, every day of the year.",
      bgcolor: "warning.100",
      color: "warning.main",
      borderColor: "warning.200"
    },
    {
      icon: <UserCheck size={24} />,
      title: "Verified Network",
      description: "All hospitals and ambulances are verified and licensed.",
      bgcolor: "secondary.100",
      color: "secondary.main",
      borderColor: "secondary.200"
    }
  ];

  return (
    <Box component="section" id="services" sx={{
      py: 10,
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fef2f2 100%)'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Why Choose Our Service
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto' }}>
            Trusted by thousands for fast, reliable emergency care when it matters most.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'grey.100',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                    borderColor: feature.borderColor
                  }
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: feature.bgcolor,
                    color: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

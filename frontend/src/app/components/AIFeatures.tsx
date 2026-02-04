import { Mic, Languages, Video, Bot, Smartphone, Globe } from "lucide-react";
import { Box, Container, Typography, Grid, Paper, Chip, Stack } from '@mui/material';

export function AIFeatures() {
  const features = [
    {
      icon: <Mic size={32} />,
      title: "AI Voice Assistant",
      description: "Simply speak and get immediate guidance in critical moments. No need to type or navigate menus.",
      bgcolor: "purple.50",
      color: "purple.600",
      borderColor: "purple.100"
    },
    {
      icon: <Languages size={32} />,
      title: "Multi-Language Support",
      description: "Get help in your own language. Breaking barriers when every second counts.",
      bgcolor: "blue.50",
      color: "blue.600",
      borderColor: "blue.100"
    },
    {
      icon: <Video size={32} />,
      title: "Video Guided Aid",
      description: "Watch step-by-step video instructions for first aid procedures in real-time.",
      bgcolor: "green.50",
      color: "green.600",
      borderColor: "green.100"
    },
    {
      icon: <Bot size={32} />,
      title: "Smart Assistance",
      description: "AI-powered guidance helps you take the right action quickly and confidently.",
      bgcolor: "orange.50",
      color: "orange.600",
      borderColor: "orange.100"
    },
    {
      icon: <Smartphone size={32} />,
      title: "One-Tap Access",
      description: "Emergency help is just one tap away. No complex forms or registration required.",
      bgcolor: "error.50",
      color: "error.main",
      borderColor: "error.100"
    },
    {
      icon: <Globe size={32} />,
      title: "Location Intelligence",
      description: "Automatically finds nearest hospitals and ambulances based on your real-time location.",
      bgcolor: "teal.50",
      color: "teal.600",
      borderColor: "teal.100"
    }
  ];

  return (
    <Box component="section" id="about" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<Bot size={16} />}
            label="Powered by Advanced AI Technology"
            sx={{ bgcolor: 'purple.50', color: 'purple.700', mb: 2, fontWeight: 500 }}
          />
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Technology That Saves Lives
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Every second matters, and no life should be lost when we have such advanced technology.
            We use it the right way to reach people faster, guide them better, and save lives more efficiently than ever before.
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
                    boxShadow: 3,
                    borderColor: feature.borderColor
                  }
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: feature.bgcolor,
                    color: feature.color,
                    borderRadius: 3,
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

        <Box sx={{
          mt: 8,
          background: 'linear-gradient(to right, #dc2626, #9333ea)',
          borderRadius: 6,
          p: { xs: 4, md: 8 },
          color: 'common.white',
          textAlign: 'center'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Our Mission: Be There When It Matters Most
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto', mb: 4, fontWeight: 400 }}>
            Whether it's an accident, a collapse, or a heart stroke - we're here to support people in those critical moments.
            Offering clear, trusted, and instant support that can make a real difference.
          </Typography>

          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={2}>
            {['Instant Response', 'AI-Powered Guidance', 'Multi-Language Support', '24/7 Availability'].map((item) => (
              <Box key={item} sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                px: 3,
                py: 1,
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                ✓ {item}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

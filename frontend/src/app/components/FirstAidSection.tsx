import { Heart, Activity, Thermometer, Bandage, AlertTriangle, Phone } from "lucide-react";
import { Box, Button, Container, Typography, Grid, Paper, Stack, Card, CardContent, Chip } from "@mui/material";
import { useState } from "react";

export function FirstAidSection() {
  const [selectedTip, setSelectedTip] = useState(0);

  const firstAidTips = [
    {
      title: "CPR (Cardiopulmonary Resuscitation)",
      icon: <Heart size={32} />,
      bgcolor: "error.50",
      color: "error.main",
      borderColor: "error.light",
      image: "https://images.unsplash.com/photo-1759872138841-c342bd6410ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcHIlMjB0cmFpbmluZyUyMG1lZGljYWx8ZW58MXx8fHwxNzY4NjQxMzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoLink: "https://www.youtube.com/results?search_query=how+to+do+cpr+first+aid",
      steps: [
        "Call emergency services immediately",
        "Place person on firm, flat surface",
        "Place heel of hand on center of chest",
        "Push hard and fast - 100-120 compressions per minute",
        "Allow chest to return to normal position after each compression"
      ]
    },
    {
      title: "Choking Emergency",
      icon: <AlertTriangle size={32} />,
      bgcolor: "warning.50",
      color: "warning.main",
      borderColor: "warning.light",
      image: "https://images.unsplash.com/photo-1622115585848-1d5b6e8af4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJzdCUyMGFpZCUyMGVtZXJnZW5jeXxlbnwxfHx8fDE3Njg1NzE3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoLink: "https://www.youtube.com/results?search_query=heimlich+maneuver+guide",
      steps: [
        "Encourage coughing if person can breathe",
        "Give 5 back blows between shoulder blades",
        "Perform 5 abdominal thrusts (Heimlich maneuver)",
        "Repeat until object is dislodged",
        "Call emergency services if unsuccessful"
      ]
    },
    {
      title: "Severe Bleeding",
      icon: <Bandage size={32} />,
      bgcolor: "info.50",
      color: "info.main",
      borderColor: "info.light",
      image: "https://images.unsplash.com/photo-1762347920888-508763c652bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYmFuZGFnZSUyMHRyZWF0bWVudHxlbnwxfHx8fDE3Njg2NDEzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoLink: "https://www.youtube.com/results?search_query=stop+severe+bleeding+first+aid",
      steps: [
        "Apply direct pressure with clean cloth",
        "Keep pressure continuous for 10-15 minutes",
        "Elevate injured area above heart if possible",
        "Don't remove cloth if blood soaks through - add more layers",
        "Seek immediate medical attention"
      ]
    },
    {
      title: "Burns Treatment",
      icon: <Thermometer size={32} />,
      bgcolor: "secondary.50",
      color: "secondary.main",
      borderColor: "secondary.light",
      image: "https://images.unsplash.com/photo-1561464494-8253a638f1bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJuJTIwdHJlYXRtZW50JTIwbWVkaWNhbHxlbnwxfHx8fDE3Njg2NDEzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoLink: "https://www.youtube.com/results?search_query=treat+burns+first+aid",
      steps: [
        "Remove from heat source immediately",
        "Cool burn with running water for 10-20 minutes",
        "Remove jewelry/tight clothing before swelling",
        "Cover with sterile, non-stick bandage",
        "Never apply ice, butter, or ointments"
      ]
    }
  ];

  return (
    <Box component="section" sx={{ py: 12, bgcolor: 'common.white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            First Aid Guidance
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Learn essential first aid techniques with step-by-step visual guides. Quick help while emergency services are on the way.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }} justifyContent="center">
          {firstAidTips.map((tip, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                component="button"
                onClick={() => setSelectedTip(index)}
                elevation={selectedTip === index ? 4 : 0}
                sx={{
                  p: 4,
                  width: '100%',
                  borderRadius: 4,
                  border: 2,
                  borderColor: selectedTip === index ? 'error.main' : 'grey.200',
                  bgcolor: selectedTip === index ? 'error.50' : 'common.white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: selectedTip === index ? 'error.50' : 'grey.50',
                    borderColor: selectedTip === index ? 'error.main' : 'grey.300',
                    transform: 'translateY(-4px)'
                  },
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Box sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: tip.bgcolor,
                  color: tip.color,
                  mb: 2,
                  flexShrink: 0
                }}>
                  {tip.icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {tip.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            border: 1,
            borderColor: 'grey.200',
            bgcolor: 'grey.50'
          }}
        >
          <Grid container>
            <Grid size={{ xs: 12, lg: 5 }} sx={{ position: 'relative', minHeight: { xs: 300, lg: 'auto' } }}>
              <Box
                component="img"
                src={firstAidTips[selectedTip].image}
                alt={firstAidTips[selectedTip].title}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
              }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'white' }}>
                  <AlertTriangle size={24} color="#ff9800" fill="#ff9800" />
                  <Typography variant="body1" fontWeight="medium">
                    <strong>Important:</strong> Emergency guidelines only. Call professional help immediately.
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }} sx={{ p: { xs: 4, md: 8 }, bgcolor: 'white' }}>
              <Box sx={{ mb: 6 }}>
                <Chip label="Step-by-Step Guide" color="error" sx={{ mb: 2, fontWeight: 'bold' }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                  {firstAidTips[selectedTip].title}
                </Typography>
              </Box>

              <Stack spacing={4} sx={{ mb: 6 }}>
                {firstAidTips[selectedTip].steps.map((step, index) => (
                  <Stack direction="row" spacing={3} key={index} alignItems="center">
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                      boxShadow: 2
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>{step}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Button
                  component="a"
                  href="tel:112"
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<Phone />}
                  sx={{ py: 2, px: 6, fontSize: '1.1rem', borderRadius: 2 }}
                >
                  Call Emergency
                </Button>
                <Button
                  component="a"
                  href={firstAidTips[selectedTip].videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<Activity />}
                  sx={{ py: 2, px: 6, fontSize: '1.1rem', borderRadius: 2 }}
                >
                  Watch Video Guide
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
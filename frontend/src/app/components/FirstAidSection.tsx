import { Heart, Activity, Thermometer, Bandage, AlertTriangle, Phone } from "lucide-react";
import { Box, Button, Container, Typography, Grid, Paper, Stack, Card, CardContent, Chip } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Import local images
import cprImage from "../../assets/images/first_aid_cpr_local.png";
import burnImage from "../../assets/images/first_aid_burn.jpg";
import bleedingImage from "../../assets/images/first_aid_bleeding_local.png";
import chokingImage from "../../assets/images/first_aid_choking_local.png";

export function FirstAidSection() {
  const { t } = useTranslation();
  const [selectedTip, setSelectedTip] = useState(0);

  const firstAidTips = [
    {
      key: "cpr",
      icon: <Heart size={32} />,
      bgcolor: "error.50",
      color: "error.main",
      borderColor: "error.light",
      image: cprImage,
      videoLink: "https://www.youtube.com/results?search_query=how+to+do+cpr+first+aid"
    },
    {
      key: "choking",
      icon: <AlertTriangle size={32} />,
      bgcolor: "warning.50",
      color: "warning.main",
      borderColor: "warning.light",
      image: chokingImage,
      videoLink: "https://www.youtube.com/results?search_query=heimlich+maneuver+guide"
    },
    {
      key: "bleeding",
      icon: <Bandage size={32} />,
      bgcolor: "info.50",
      color: "info.main",
      borderColor: "info.light",
      image: bleedingImage,
      videoLink: "https://www.youtube.com/results?search_query=stop+severe+bleeding+first+aid"
    },
    {
      key: "burns",
      icon: <Thermometer size={32} />,
      bgcolor: "secondary.50",
      color: "secondary.main",
      borderColor: "secondary.light",
      image: burnImage,
      videoLink: "https://www.youtube.com/results?search_query=treat+burns+first+aid"
    }
  ];

  const currentTip = firstAidTips[selectedTip];

  return (
    <Box component="section" sx={{ py: 12, bgcolor: 'common.white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {t('firstAid.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            {t('firstAid.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }} justifyContent="center">
          {firstAidTips.map((tip, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
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
                  {t(`firstAid.tips.${tip.key}.title`)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Detail Panel — small image left, text right */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            border: 1,
            borderColor: 'grey.200',
            bgcolor: 'white',
            p: { xs: 3, md: 5 }
          }}
        >
          <Grid container spacing={4} alignItems="flex-start">
            {/* Small image column */}
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
                <Box
                  component="img"
                  src={currentTip.image}
                  alt={t(`firstAid.tips.${currentTip.key}.title`)}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: { xs: 200, sm: 240 },
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {/* Gradient overlay with emergency note */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  p: 1.5,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'white' }}>
                    <AlertTriangle size={16} color="#ff9800" fill="#ff9800" />
                    <Typography variant="caption" fontWeight="medium">
                      {t('firstAid.important')} {t('firstAid.emergencyNote')}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Text content column */}
            <Grid item xs={12} sm={8} md={9}>
              <Box sx={{ mb: 3 }}>
                <Chip label={t('firstAid.stepByStep')} color="error" sx={{ mb: 1.5, fontWeight: 'bold' }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                  {t(`firstAid.tips.${currentTip.key}.title`)}
                </Typography>
              </Box>

              <Stack spacing={2.5} sx={{ mb: 4 }}>
                {(t(`firstAid.tips.${currentTip.key}.steps`, { returnObjects: true }) as string[]).map((step, index) => (
                  <Stack direction="row" spacing={2} key={index} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0,
                      boxShadow: 2
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6 }}>{step}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component="a"
                  href="tel:112"
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<Phone />}
                  sx={{ py: 1.5, px: 4, fontSize: '1rem', borderRadius: 2 }}
                >
                  {t('firstAid.callEmergency')}
                </Button>
                <Button
                  component="a"
                  href={currentTip.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<Activity />}
                  sx={{ py: 1.5, px: 4, fontSize: '1rem', borderRadius: 2 }}
                >
                  {t('firstAid.watchVideo')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
import { MapPin, Phone, Navigation, Star } from "lucide-react";
import { Box, Button, Chip, Grid, Paper, Stack, Typography, Container } from "@mui/material";

export function NearbyHospitals() {
  const hospitals = [
    {
      name: "Manipal Hospital",
      distance: "1.2 km",
      rating: 4.8,
      emergency: true,
      waitTime: "5 min",
      contact: "+91 80-2526-6666"
    },
    {
      name: "Fortis Hospital",
      distance: "2.4 km",
      rating: 4.6,
      emergency: true,
      waitTime: "8 min",
      contact: "+91 80-6621-4444"
    },
    {
      name: "Apollo Hospital",
      distance: "3.1 km",
      rating: 4.7,
      emergency: true,
      waitTime: "12 min",
      contact: "+91 80-2630-0400"
    },
    {
      name: "Sakra World Hospital",
      distance: "3.8 km",
      rating: 4.5,
      emergency: false,
      waitTime: "15 min",
      contact: "+91 80-4969-4969"
    }
  ];

  return (
    <Box component="section" id="nearby" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Nearby Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Real-time information about hospitals near your location with live availability.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {hospitals.map((hospital, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'grey.100',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 2 }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {hospital.name}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <MapPin size={16} />
                      </Box>
                      <Typography variant="body2">{hospital.distance} away</Typography>
                      <Typography variant="body2">•</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                        <Star size={16} fill="currentColor" />
                      </Box>
                      <Typography variant="body2">{hospital.rating}</Typography>
                    </Stack>

                    {hospital.emergency && (
                      <Chip
                        label="24/7 Emergency"
                        size="small"
                        sx={{ bgcolor: 'error.main', color: 'common.white', fontWeight: 'bold' }}
                      />
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">Wait Time</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {hospital.waitTime}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<Phone size={18} />}
                    sx={{ py: 1.5 }}
                  >
                    Call Now
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    startIcon={<Navigation size={18} />}
                    sx={{ py: 1.5 }}
                  >
                    Navigate
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <MapPin size={16} />
            Location updated in real-time • Showing 4 nearest facilities
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
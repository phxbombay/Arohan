import { useState } from 'react';
import {
    LocalHospital as HospitalIcon,
    Search as SearchIcon,
    LocationOn as MapPinIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    Paper,
    Button,
    Chip,
    Stack
} from '@mui/material';

export function PartnerHospitals() {
    const [search, setSearch] = useState('');

    const hospitals = [
        { name: "Apollo Hospital", location: "Bannerghatta Road, Bengaluru", phone: "+91 80 2630 4050", type: "Multi-specialty" },
        { name: "Fortis Hospital", location: "Cunningham Road, Bengaluru", phone: "+91 80 4199 4444", type: "Cardiology" },
        { name: "Manipal Hospital", location: "Old Airport Road, Bengaluru", phone: "+91 80 2502 4444", type: "Multi-specialty" },
        { name: "Narayana Health", location: "Bommasandra, Bengaluru", phone: "186 0208 0208", type: "Cardiology" },
        { name: "Aster CMI Hospital", location: "Hebbal, Bengaluru", phone: "+91 80 4342 0100", type: "General" }
    ];

    const filteredHospitals = hospitals.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase()));

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', py: 10 }}>
            <Container>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>Partner Hospitals</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
                        Our network of top-tier healthcare providers ensures you are always in safe hands.
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search hospitals by name or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                        sx={{ maxWidth: 600, bgcolor: 'common.white' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                <Grid container spacing={3}>
                    {filteredHospitals.map((hospital, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box sx={{ bgcolor: 'error.50', p: 1.5, borderRadius: 2 }}>
                                    <HospitalIcon color="error" fontSize="large" />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>{hospital.name}</Typography>
                                        <Chip label={hospital.type} size="small" color="primary" variant="outlined" />
                                    </Stack>

                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MapPinIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">{hospital.location}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">{hospital.phone}</Typography>
                                        </Box>
                                    </Stack>

                                    <Button variant="outlined" color="primary" size="small" sx={{ mt: 2 }}>
                                        Get Directions
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {filteredHospitals.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body1" color="text.secondary">No hospitals found matching your search.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

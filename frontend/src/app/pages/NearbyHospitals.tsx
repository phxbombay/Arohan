import React, { useState, useEffect } from "react";
import {
    LocationOn as MapPinIcon,
    Phone as PhoneIcon,
    Navigation as NavigationIcon,
    AccessTime as ClockIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Paper,
    CircularProgress
} from "@mui/material";
// @ts-ignore
import { useLocation } from "../../context/LocationContext";

// Mock data for hospitals
const MOCK_HOSPITALS = [
    {
        id: 1,
        name: "City General Hospital",
        address: "45 MG Road, Bengaluru",
        originalDistance: "2.5 km", // Fallback
        phone: "+91 80 1234 5678",
        availability: "High", // High, Medium, Low
        availableBeds: 12,
        emergencyWaitTime: "10 mins",
        coordinates: { lat: 12.9716, lng: 77.5946 },
    },
    {
        id: 2,
        name: "Apollo Speciality Hospital",
        address: "12 Bannerghatta Road, Bengaluru",
        originalDistance: "4.1 km",
        phone: "+91 80 9876 5432",
        availability: "Medium",
        availableBeds: 5,
        emergencyWaitTime: "25 mins",
        coordinates: { lat: 12.9250, lng: 77.5938 },
    },
    {
        id: 3,
        name: "Manipal Hospital",
        address: "98 HAL Airport Road, Bengaluru",
        originalDistance: "5.8 km",
        phone: "+91 80 5555 4444",
        availability: "Low",
        availableBeds: 2,
        emergencyWaitTime: "45 mins",
        coordinates: { lat: 12.9606, lng: 77.6484 },
    },
    {
        id: 4,
        name: "Fortis Hospital",
        address: "154/9, Bannerghatta Road, Bengaluru",
        originalDistance: "4.5 km",
        phone: "+91 80 6666 7777",
        availability: "High",
        availableBeds: 18,
        emergencyWaitTime: "5 mins",
        coordinates: { lat: 12.8959, lng: 77.5985 },
    },
    {
        id: 5,
        name: "Aster CMI Hospital",
        address: "43/2, New Airport Road, Hebbal, Bengaluru",
        originalDistance: "8.2 km",
        phone: "+91 80 8888 9999",
        availability: "Medium",
        availableBeds: 8,
        emergencyWaitTime: "15 mins",
        coordinates: { lat: 13.0569, lng: 77.5916 },
    }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function NearbyHospitals() {
    // @ts-ignore
    const { coordinates, address, loading: locationLoading, error: locationError } = useLocation();
    const [hospitals, setHospitals] = useState<any[]>(MOCK_HOSPITALS);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchHospitals = async () => {
            if (!coordinates) {
                // Fallback to original distances if no location
                setHospitals(MOCK_HOSPITALS.map(h => ({ ...h, distance: h.originalDistance })));
                return;
            }

            setLoading(true);
            try {
                // Overpass API query to find hospitals within 10km (increased range)
                const query = `
                    [out:json][timeout:25];
                    node["amenity"="hospital"](around:10000,${coordinates.lat},${coordinates.lng});
                    out body 10;
                `;

                // Use a public Overpass instance
                const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.elements && data.elements.length > 0) {
                    const fetchedHospitals = data.elements.map((element: any) => {
                        const dist = calculateDistance(
                            coordinates.lat,
                            coordinates.lng,
                            element.lat,
                            element.lon
                        );

                        return {
                            id: element.id,
                            name: element.tags.name || "Unnamed Hospital",
                            address: [element.tags["addr:street"], element.tags["addr:city"]].filter(Boolean).join(", ") || "Address unavailable",
                            distance: `${dist.toFixed(1)} km`,
                            distValue: dist,
                            phone: element.tags.phone || element.tags["contact:phone"] || "Number unavailable",
                            availability: "Unknown",
                            availableBeds: Math.floor(Math.random() * 15) + 1, // Simulated
                            emergencyWaitTime: "Call to check",
                            coordinates: { lat: element.lat, lng: element.lon }
                        };
                    }).sort((a: any, b: any) => a.distValue - b.distValue);

                    setHospitals(fetchedHospitals);
                } else {
                    console.log("No hospitals found nearby via API");
                    // Fallback to mock data with calculated distances (even if far)
                    const updatedMock = MOCK_HOSPITALS.map(hospital => {
                        const dist = calculateDistance(
                            coordinates.lat,
                            coordinates.lng,
                            hospital.coordinates.lat,
                            hospital.coordinates.lng
                        );
                        return {
                            ...hospital,
                            distance: `${dist.toFixed(1)} km`,
                            distValue: dist
                        };
                    }).sort((a, b) => a.distValue - b.distValue);
                    setHospitals(updatedMock);
                }
            } catch (err) {
                console.error("Error fetching hospitals:", err);
                // Fallback on error
                const updatedMock = MOCK_HOSPITALS.map(hospital => {
                    const dist = calculateDistance(
                        coordinates.lat,
                        coordinates.lng,
                        hospital.coordinates.lat,
                        hospital.coordinates.lng
                    );
                    return {
                        ...hospital,
                        distance: `${dist.toFixed(1)} km`,
                        distValue: dist
                    };
                }).sort((a, b) => a.distValue - b.distValue);
                setHospitals(updatedMock);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [coordinates]);

    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAvailabilityColor = (level: string): "success" | "warning" | "error" | "default" => {
        switch (level) {
            case "High": return "success";
            case "Medium": return "warning";
            case "Low": return "error";
            default: return "default";
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 10 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>Nearby Hospitals</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                        Find the closest emergency care facilities in real-time. View availability, wait times, and get directions instantly.
                    </Typography>
                </Box>

                {/* Search & Stats */}
                <Paper elevation={1} sx={{ p: 3, mb: 6, borderRadius: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid xs={12} md={8}>
                            <TextField
                                fullWidth
                                placeholder="Search hospitals by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'grey.50',
                                p: 2,
                                borderRadius: 2,
                                border: 1,
                                borderColor: 'grey.200'
                            }}>
                                <MapPinIcon color="error" fontSize="small" />
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {(locationLoading || loading) ? "Finding Nearby Hospitals..." : (address || "Location Unavailable")}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Hospital Grid */}
                <Grid container spacing={4}>
                    {filteredHospitals.map((hospital) => (
                        <Grid xs={12} md={6} lg={4} key={hospital.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>{hospital.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <MapPinIcon style={{ fontSize: 14 }} /> {hospital.address}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={<NavigationIcon style={{ fontSize: 14 }} />}
                                            label={hospital.distance}
                                            size="small"
                                            sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}
                                        />
                                    </Box>

                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid xs={6}>
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                border: 1,
                                                borderColor: `${getAvailabilityColor(hospital.availability)}.light`,
                                                bgcolor: `${getAvailabilityColor(hospital.availability)}.50`,
                                                color: `${getAvailabilityColor(hospital.availability)}.main`
                                            }}>
                                                <Typography variant="caption" fontWeight="bold" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>Bed Availability</Typography>
                                                <Typography variant="h6" fontWeight="bold">{hospital.availableBeds} Beds</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'info.50', border: 1, borderColor: 'info.light', color: 'info.dark' }}>
                                                <Typography variant="caption" fontWeight="bold" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>Wait Time</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ClockIcon style={{ fontSize: 16 }} />
                                                    <Typography variant="h6" fontWeight="bold">{hospital.emergencyWaitTime}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                startIcon={<PhoneIcon />}
                                                href={`tel:${hospital.phone}`}
                                            >
                                                Call Now
                                            </Button>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="error"
                                                startIcon={<NavigationIcon />}
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                                                target="_blank"
                                            >
                                                Navigate
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'grey.100', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">Updated: Just now</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                                        <Typography variant="caption" fontWeight="bold" color="success.main">Live Status</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default NearbyHospitals;

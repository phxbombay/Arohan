import {
    Users as UsersIcon,
    Briefcase as BriefcaseIcon,
    HeartHandshake as HandshakeIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';

export function Corporate() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Complete Care for Your <br /> Employees' Families
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                                Elevate your corporate wellness program by supporting your employees in their caregiving journey.
                                Reduce stress and absenteeism with Arohan.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    component={Link}
                                    to="/contact"
                                    variant="contained"
                                    size="large"
                                    sx={{ px: 4 }}
                                >
                                    Contact Sales
                                </Button>
                                <Button
                                    component={Link}
                                    to="/brochure"
                                    variant="outlined"
                                    size="large"
                                    sx={{ px: 4 }}
                                >
                                    Download Brochure
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ bgcolor: 'info.50', p: 4, borderRadius: 4 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Why Corporate Wellness?</Typography>
                                <List>
                                    {[
                                        "Increased Employee Retention",
                                        "Reduced Caregiving Anxiety",
                                        "Demonstrated Care & Empathy"
                                    ].map((text, i) => (
                                        <ListItem key={i} disableGutters>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                                            </ListItemIcon>
                                            <ListItemText primary={text} primaryTypographyProps={{ variant: 'body1', color: 'text.primary' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>
                        Partnership Models
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main', borderWidth: 2, borderStyle: 'solid' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <UsersIcon size={40} color="#dc2626" />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Employee Perk</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                        Exclusive discounts for your employees to purchase Arohan devices for their parents.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main', borderWidth: 2, borderStyle: 'solid' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <BriefcaseIcon size={40} color="#dc2626" />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Corporate Subsidized</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                        Company covers basic subscription costs as part of the benefits package.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main', borderWidth: 2, borderStyle: 'solid' } }}>
                                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <HandshakeIcon size={40} color="#dc2626" />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Insurance Partners</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                        Bulk licensing and data integration for insurance providers to reduce long-term risk.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

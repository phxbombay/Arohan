import { Box, Container, Typography, Grid, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Api as ApiIcon, Payment as PaymentIcon, Router as RouterIcon, Storage as StorageIcon, CheckCircle as CheckCircleIcon, Security as SecurityIcon } from '@mui/icons-material';
import SEO from '../components/SEO';

export function Integrations() {
    return (
        <Box>
            <SEO 
                title="API & Integrations - Arohan Health"
                description="Connect Arohan's AI emergency detection with your existing healthcare ecosystem. API documentation, Payment gateway integration, and device connectivity details."
                keywords="API integration, payment gateway, healthcare API, medical device connectivity, PayTM integration"
            />

            {/* Header */}
            <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Integrations & Connectors
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Seamlessly link Arohan to your clinical systems, apps, and payout workflows
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={8}>
                    {/* API Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                            <ApiIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="bold">Healthcare APIs</Typography>
                        </Box>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Our RESTful APIs allow hospitals and gated communities to pull real-time health alerts and historical vitals into their own management dashboards.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                <ListItemText primary="Webhook notifications for emergency events" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                <ListItemText primary="Batch retrieval of heart rate and SpO2 data" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                <ListItemText primary="FHIR/HL7 compliant data formatting" />
                            </ListItem>
                        </List>
                        <Button variant="outlined" sx={{ mt: 3 }}>Request API Docs</Button>
                    </Grid>

                    {/* Payment Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                            <PaymentIcon color="secondary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="bold">Payment Gateways</Typography>
                        </Box>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We support localized payment ecosystems for subscription management and hardware purchases, ensuring a smooth experience for users in India.
                        </Typography>
                        <Grid container spacing={2}>
                            {['PayTM', 'Razorpay', 'UPI / PhonePe', 'Stripe (Global)'].map((p, i) => (
                                <Grid item xs={6} key={i}>
                                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                                        <Typography fontWeight="bold">{p}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
                            Secure 3D-Authentication and recurring billing support are standard across all integrations.
                        </Typography>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Hardware Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <RouterIcon sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Connectivity</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dual-band WiFi, Bluetooth 5.0 Low Energy, and optional 4G LTE fallover support.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Cloud Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <StorageIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Cloud Storage</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Encrypted archival of health data on AWS Mumbai region servers for low latency.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Security Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <SecurityIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>IAM Control</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Identity and Access Management for role-based dashboard access (Admin/Doctor/Nurse).
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom CTA */}
            <Box sx={{ py: 8, bgcolor: 'grey.50', textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Need a Custom Integration?</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Our engineering team can build custom connectors for specialized medical equipment.
                    </Typography>
                    <Button variant="contained" size="large">Talk to an Engineer</Button>
                </Container>
            </Box>
        </Box>
    );
}

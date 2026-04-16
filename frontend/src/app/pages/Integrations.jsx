import { Box, Container, Typography, Grid, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Api as ApiIcon, Payment as PaymentIcon, Router as RouterIcon, Storage as StorageIcon, CheckCircle as CheckCircleIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export function Integrations() {
    const { t } = useTranslation();
    return (
        <Box>
            <SEO 
                title={t('integrationsPage.heroTitle')}
                description={t('integrationsPage.heroSubtitle')}
                keywords="API integration, payment gateway, healthcare API, medical device connectivity, PayTM integration"
            />

            {/* Header */}
            <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        {t('integrationsPage.heroTitle')}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        {t('integrationsPage.heroSubtitle')}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={8}>
                    {/* API Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                            <ApiIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="bold">{t('integrationsPage.apiTitle')}</Typography>
                        </Box>
                        <Typography variant="body1" paragraph color="text.secondary">
                            {t('integrationsPage.apiDesc')}
                        </Typography>
                        <List>
                            {(t('integrationsPage.apiPoints', { returnObjects: true }) || []).map((point, i) => (
                                <ListItem key={i}>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary={point} />
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="outlined" sx={{ mt: 3 }}>Request API Docs</Button>
                    </Grid>

                    {/* Payment Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                            <PaymentIcon color="secondary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="bold">{t('integrationsPage.paymentTitle')}</Typography>
                        </Box>
                        <Typography variant="body1" paragraph color="text.secondary">
                            {t('integrationsPage.paymentDesc')}
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
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{t('integrationsPage.hardwareTitle')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('integrationsPage.hardwareDesc')}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Cloud Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <StorageIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{t('integrationsPage.cloudTitle')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('integrationsPage.cloudDesc')}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Security Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <SecurityIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{t('integrationsPage.iamTitle')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('integrationsPage.iamDesc')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom CTA */}
            <Box sx={{ py: 8, bgcolor: 'grey.50', textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>{t('integrationsPage.ctaTitle')}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {t('integrationsPage.ctaDesc')}
                    </Typography>
                    <Button variant="contained" size="large">{t('integrationsPage.ctaButton')}</Button>
                </Container>
            </Box>
        </Box>
    );
}

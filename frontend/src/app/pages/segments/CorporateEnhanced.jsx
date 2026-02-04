import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Button,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Business as BusinessIcon, TrendingDown as ROIIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function CorporateEnhanced() {
    const roiMetrics = [
        { metric: 'Absenteeism Reduction', value: '-25%', desc: 'Healthier employees, fewer sick days' },
        { metric: 'Healthcare Cost Savings', value: 'Significant', desc: 'Preventive care reduces claims' },
        { metric: 'Productivity Increase', value: '+15%', desc: 'Healthier workforce performs better' },
        { metric: 'Employee Retention', value: '+12%', desc: 'Premium wellness perks attract talent' }
    ];

    const features = [
        'HR wellness dashboard with aggregate analytics',
        'Anonymous health trends (GDPR compliant)',
        'Customizable wellness challenges & gamification',
        'Integration with existing health insurance',
        'Quarterly ROI reports for C-suite',
        'On-site health screening partnerships'
    ];

    return (
        <Box>
            <Helmet>
                <title>Arohan for Corporate & Insurance - Employee Wellness & Risk Reduction</title>
                <meta name="description" content="Corporate wellness programs with ROI tracking. Reduce healthcare costs by 25%. Employee health monitoring for insurance risk pooling. Volume discounts available." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'warning.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <BusinessIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        For Corporate & Insurance
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Employee wellness programs. Risk reduction. Measurable ROI.
                    </Typography>
                </Container>
            </Box>

            {/* ROI Metrics */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Proven Return on Investment
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                    Data from corporate partners (thousands of employees monitored)
                </Typography>
                <Grid container spacing={4}>
                    {roiMetrics.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                                    {item.value}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {item.metric}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.desc}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* For Corporate */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Corporate Wellness Programs
                    </Typography>
                    <Grid container spacing={6} sx={{ mt: 2 }} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                What You Get
                            </Typography>
                            <List>
                                {features.map((feature, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                        <ListItemText primary={feature} />
                                    </ListItem>
                                ))}
                            </List>
                            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                                Volume Pricing
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Chip label="50-99 devices: 10% off" color="primary" />
                                <Chip label="100-499: 20% off" color="primary" />
                                <Chip label="500+: 30% off" color="primary" />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 4, bgcolor: 'success.50' }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Case Study: Tech Corp India
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>Company:</strong> Mid-sized IT firm, Pune
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>Challenge:</strong> High stress, sedentary work → 40% of employees aged 35+ had pre-diabetes
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>Solution:</strong> Arohan wellness program with step challenges, health coaching
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    <strong>Results (6 months):</strong>
                                </Typography>
                                <List dense>
                                    <ListItem><ListItemText primary="• 18% reduction in healthcare claims" /></ListItem>
                                    <ListItem><ListItemText primary="• 12% improvement in employee NPS" /></ListItem>
                                    <ListItem><ListItemText primary="• Substantial annual savings" /></ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* For Insurance */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    For Health Insurance Providers
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <ROIIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Claims Reduction
                            </Typography>
                            <Typography variant="body2">
                                Early detection reduces emergency claims by 30%. Preventive alerts mean fewer hospitalizations.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Risk Pooling
                            </Typography>
                            <Typography variant="body2">
                                Vitals data enables smarter underwriting. Offer discounted premiums to healthy policyholders.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                            <CheckIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                White-Label Option
                            </Typography>
                            <Typography variant="body2">
                                Rebrand Arohan as your own wellness program. Full API access for custom integrations.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'warning.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Ready to Transform Employee Health?
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Schedule a pilot program for your employees
                    </Typography>
                    <Button
                        component={Link}
                        to="/contact"
                        variant="contained"
                        size="large"
                        sx={{ bgcolor: 'white', color: 'warning.main' }}
                    >
                        Request Enterprise Quote
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

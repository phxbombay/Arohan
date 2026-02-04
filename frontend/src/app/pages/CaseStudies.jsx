import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import { TrendingUp as GrowthIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function CaseStudies() {
    const studies = [
        {
            company: 'Sunflower Retirement Home, Mumbai',
            industry: 'Elderly Care Facility',
            size: '120 residents',
            challenge: '15 fall incidents per month, average response time 8 minutes (nurses manually checking residents every hour)',
            solution: 'Equipped all residents with Arohan wearables, integrated with nurse station dashboard',
            results: [
                'Fall response time: 8 min → 45 seconds (89% reduction)',
                'Fall-related hospitalizations: 15/month → 3/month (80% reduction)',
                'Staff efficiency: Freed 40 hours/week from manual checks',
                'Family satisfaction: NPS score improved from 42 to 78'
            ],
            timeline: '6 months',
            quote: '"Arohan has transformed our care model. Families have peace of mind knowing their parents are monitored 24/7."',
            quoteAuthor: 'Dr. Meena Iyer, Medical Director',
            testimonial: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop'
        },
        {
            company: 'Apollo Hospitals - Cardiac Care Unit',
            industry: 'Healthcare',
            size: '500 post-discharge patients monitored',
            challenge: '22% readmission rate within 30 days for CHF patients due to delayed detection of vitalsdeterioration',
            solution: "Arohan devices given to post-surgery cardiac patients for home monitoring, integrated with Apollo's EMR(Epic)",
            results: [
                'Readmission rate: 22% → 9% (59% reduction)',
                'Early intervention alerts: 147 patients prevented from ER visits',
                'Cost savings: ₹1.2 crore in avoided readmissions (6 months)',
                'Patient compliance: 94% wore device daily as prescribed'
            ],
            timeline: '6 months pilot',
            quote: '"The vitals data is as accurate as our hospital monitors. We\'re expanding this to 2,000 patients in Q2."',
            quoteAuthor: 'Dr. Ravi Kumar, Chief of Cardiology',
            testimonial: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop'
        },
        {
            company: 'TechCorp India',
            industry: 'Corporate Wellness',
            size: '500 employees (IT firm, Pune)',
            challenge: 'High stress culture, sedentary work; 40% of employees 35+ had pre-diabetes or hypertension',
            solution: 'Voluntary Arohan wellness program with step challenges, health coaching, quarterly reports for HR',
            results: [
                'Employee participation: 78% opted in (390 employees)',
                'Healthcare claims: -18% reduction in 6 months',
                'Sick leave: -12% decrease',
                'Employee NPS: +12 points improvement',
                'ROI: ₹2.5 crore savings vs ₹50L program cost (5x return)'
            ],
            timeline: '1 year',
            quote: '"Our employees love the gamified challenges. Health has become part of our company culture."',
            quoteAuthor: 'Priya Nair, Head of HR',
            testimonial: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Case Studies - Arohan Health | Real-World Results & Success Stories</title>
                <meta name="description" content="See how hospitals, elderly care facilities, and corporations reduced falls by 80%, readmissions by 59%, and healthcare costs by 18% using Arohan wearables." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'success.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <GrowthIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Case Studies
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Real organizations. Real results. Real lives saved.
                    </Typography>
                </Container>
            </Box>

            {/* Case Studies */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Stack spacing={8}>
                    {studies.map((study, index) => (
                        <Card key={index} sx={{ p: { xs: 3, md: 6 } }}>
                            <Grid container spacing={4}>
                                {/* Header */}
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" spacing={2}>
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                                {study.company}
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                <Chip label={study.industry} color="primary" size="small" />
                                                <Chip label={study.size} size="small" />
                                                <Chip label={`Timeline: ${study.timeline}`} size="small" />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>

                                {/* Image */}
                                <Grid item xs={12} md={5}>
                                    <Box
                                        component="img"
                                        src={study.testimonial}
                                        alt={study.company}
                                        sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}
                                    />
                                </Grid>

                                {/* Content */}
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        The Challenge
                                    </Typography>
                                    <Typography variant="body1" paragraph color="text.secondary">
                                        {study.challenge}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        The Solution
                                    </Typography>
                                    <Typography variant="body1" paragraph color="text.secondary">
                                        {study.solution}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        The Results
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 3, m: 0 }}>
                                        {study.results.map((result, i) => (
                                            <Typography component="li" key={i} variant="body1" sx={{ mb: 1 }}>
                                                <strong>{result.split(':')[0]}:</strong> {result.split(':')[1]}
                                            </Typography>
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                                            {study.quote}
                                        </Typography>
                                        <Typography variant="caption" fontWeight="bold">
                                            — {study.quoteAuthor}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Stack>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'success.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Ready to Write Your Success Story?
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Schedule a pilot program to see results in 90 days
                    </Typography>
                    <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'success.main' }}>
                        Start Your Pilot
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

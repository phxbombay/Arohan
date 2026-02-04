import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Avatar,
    Stack,
    Chip,
    Button,
    Paper
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { StructuredData } from '../components/StructuredData';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '../../utils/structuredData';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function About() {
    // Core Leadership
    const leadership = [
        {
            name: 'Mrudhula Uriti',
            title: 'Founder & CEO',
            role: 'HR & Marketing',
            bio: 'Strong marketing and HR strategy acumen, enriched by leadership stints at global organizations like Siemens and Accor.',
            linkedin: '#',
            expertise: ['Marketing', 'HR Strategy', 'Business Development']
        }
    ];

    // Advisory Board
    const advisors = [
        {
            name: 'Dr. Ravi Kiran',
            title: 'Startup Advisor',
            bio: 'PhD in Biomedical Engineering (USA) and runs a thriving healthcare deep-tech startup.',
            linkedin: '#',
            expertise: ['Biomedical Engineering', 'Healthcare Tech', 'Startups']
        }
    ];

    // Medical Advisory Panel
    const medicalAdvisors = [
        {
            name: 'Dr. Uday Shankar',
            title: 'Medical Advisor',
            specialty: 'Paediatrician'
        },
        {
            name: 'Dr. Anna Das',
            title: 'Medical Advisor',
            specialty: 'Rheumatologist'
        }
    ];

    // Technical & Operations Team
    const technicalTeam = [
        { name: 'Mayur S', role: 'Technical Architect', institution: 'VIT/Ramaiah/Dayananda Sagar/Alliance' },
        { name: 'Eswar Goud', role: 'Operations Management', institution: 'MBA Student' },
        { name: 'Pracheth Singh', role: 'Software Engineer', institution: 'Engineering Student' },
        { name: 'Dheeraj A U', role: 'Software Engineer', institution: 'Engineering Student' }
    ];

    const values = [
        {
            title: 'Patient-Centric',
            description: 'Every decision prioritizes patient safety and well-being',
            icon: '❤️'
        },
        {
            title: 'Innovation',
            description: 'Pushing boundaries of AI and wearable technology',
            icon: '💡'
        },
        {
            title: 'Trust',
            description: 'Transparent data practices and HIPAA/GDPR compliance',
            icon: '🔒'
        },
        {
            title: 'Accessibility',
            description: 'Affordable care for 159M elderly Indians',
            icon: '🌏'
        }
    ];

    const milestones = [
        { year: '2025', event: 'Company founded in Bengaluru' },
        { year: '2025 Q4', event: 'Completed 50-subject clinical trial (95% accuracy)' },
        { year: '2026 Q1', event: 'Secured seed funding' },
        { year: '2026 Q2', event: 'Partnership with Apollo Hospitals (planned)' },
        { year: '2026 Q3', event: 'CDSCO approval process initiated' }
    ];

    const breadcrumbs = [
        { name: 'Home', url: 'https://arohan-health.com/' },
        { name: 'About Us', url: 'https://arohan-health.com/about' }
    ];

    return (
        <Box>
            <StructuredData schema={generateOrganizationSchema()} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

            <Helmet>
                <title>About Arohan Health | Mission to Save Lives with AI</title>
                <meta name="description" content="Learn about Arohan's mission to protect India's elderly with AI technology. Meet our team of doctors, engineers, and healthcare innovators." />
                <link rel="canonical" href="https://arohanhealth.com/about" />
            </Helmet>

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        About Arohan
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto', fontWeight: 500 }}>
                        Pioneering AI-powered emergency care to protect India's 159M elderly population
                    </Typography>
                </Container>
            </Box>

            {/* Mission & Vision */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                        <Paper elevation={0} sx={{ p: 4, bgcolor: 'primary.50', borderRadius: 4, height: '100%' }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                                Our Vision
                            </Typography>
                            <Typography variant="body1" fontSize={18}>
                                Transforming emergency care by delivering timely life-saving notifications and enabling prompt first aid through AI-powered biosensors and personalized healthcare insights.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                        <Paper elevation={0} sx={{ p: 4, bgcolor: 'secondary.50', borderRadius: 4, height: '100%' }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="secondary.main">
                                Our Mission
                            </Typography>
                            <Typography variant="body1" fontSize={18}>
                                Enable elderly urban individuals to stay worry-free by instantly notifying loved ones during health emergencies and equipping first responders with evidence-based guidance.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Origin Story */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Why We Built Arohan
                    </Typography>
                    <Typography variant="body1" fontSize={18} sx={{ textAlign: 'center', mb: 4, lineHeight: 1.8 }}>
                        Hasprana Health Care Solutions Private Limited is a Bengaluru-based health-tech startup building deep-tech solutions for emergency and elder-care. Arohan is our flagship product, born from personal experiences of delayed emergency response and informed by discussions with clinicians, caregivers and technologists.
                    </Typography>
                    <Paper elevation={0} sx={{ p: 4, borderLeft: '6px solid', borderColor: 'error.main', bgcolor: 'white', textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight="bold" color="error.main" gutterBottom>
                            40% of cardiac & stroke deaths occur due to delayed emergency response
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Source: National Institute of Health, India (2024)
                        </Typography>
                    </Paper>
                </Container>
            </Box>

            {/* Team */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Meet Our Team
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    Passionate innovators committed to saving lives
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6, fontStyle: 'italic' }}>
                    Driven by a common mission, every team member is personally invested in this initiative's success
                </Typography>

                {/* Core Leadership */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 4 }}>
                        Core Leadership
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {leadership.map((member, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-12px)', boxShadow: 16 }, borderRadius: 4 }}>
                                    <Avatar
                                        alt={member.name}
                                        sx={{ width: 140, height: 140, mx: 'auto', mb: 3, border: '4px solid', borderColor: 'primary.light', boxShadow: 3, fontSize: '3rem', bgcolor: 'primary.main' }}
                                    >
                                        {member.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                                        {member.title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                                        {member.bio}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                                        {member.expertise.map((skill, i) => (
                                            <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'grey.100' }} />
                                        ))}
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Advisory Board */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 4 }}>
                        Advisory Board
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {advisors.map((member, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-12px)', boxShadow: 16 }, borderRadius: 4 }}>
                                    <Avatar
                                        alt={member.name}
                                        sx={{ width: 120, height: 120, mx: 'auto', mb: 3, border: '4px solid', borderColor: 'secondary.light', boxShadow: 3, fontSize: '2.5rem', bgcolor: 'secondary.main' }}
                                    >
                                        {member.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="secondary" fontWeight="bold" gutterBottom>
                                        {member.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                                        {member.bio}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {member.expertise.map((skill, i) => (
                                            <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'grey.100' }} />
                                        ))}
                                    </Stack>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Medical Advisory Panel */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 2 }}>
                        Medical Advisory Panel
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4, fontStyle: 'italic' }}>
                        A trusted network of doctors unified by their belief in the mission
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {medicalAdvisors.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }, borderRadius: 4, bgcolor: 'success.50' }}>
                                    <Avatar
                                        alt={member.name}
                                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid', borderColor: 'success.main', boxShadow: 2, fontSize: '2rem', bgcolor: 'success.light' }}
                                    >
                                        {member.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {member.title}
                                    </Typography>
                                    <Chip label={member.specialty} size="small" color="success" sx={{ mx: 'auto', mt: 1 }} />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Technical & Operations Team */}
                <Box>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 2 }}>
                        Technical & Operations Team
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4, fontStyle: 'italic' }}>
                        Passionate engineering and MBA students from premier institutions
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {technicalTeam.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 3, transition: 'all 0.2s', '&:hover': { bgcolor: 'grey.200', transform: 'translateY(-4px)' } }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="body2" color="primary" fontWeight="medium" gutterBottom>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {member.institution}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Company Values */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom color="white">
                        Our Values
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
                        {values.map((value, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ textAlign: 'center', p: 4, height: '100%', bgcolor: 'grey.800', color: 'white', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)', bgcolor: 'grey.700', boxShadow: 8 } }}>
                                    <Typography variant="h2" sx={{ mb: 2 }}>{value.icon}</Typography>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body2" color="grey.400">
                                        {value.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Milestones */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Our Journey
                </Typography>
                <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5 }}>
                    {milestones.map((milestone, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4, textAlign: { xs: 'center', sm: 'left' } }}>
                            <Chip label={milestone.year} color="primary" sx={{ minWidth: 100, fontWeight: 'bold', fontSize: '1rem', py: 2, mb: { xs: 1, sm: 0 }, mr: { sm: 3 } }} />
                            <Typography variant="h6" color="text.primary">{milestone.event}</Typography>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                        Join Us in Saving Lives
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                        Careers, partnerships, and investment opportunities
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            component={Link}
                            to="/contact"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem',
                                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            <EmailIcon sx={{ mr: 1 }} /> Contact Us
                        </Button>
                        <Button
                            component={Link}
                            to="/careers"
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white', color: 'white', fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1.1rem',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                            }}
                        >
                            View Careers
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

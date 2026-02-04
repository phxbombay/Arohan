import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Avatar,
    Chip,
    Stack,
    IconButton
} from '@mui/material';
import { LinkedIn as LinkedInIcon, Twitter as TwitterIcon, Email as EmailIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function Team() {
    const teamMembers = [
        {
            name: 'Eswar Prasad M',
            role: 'Director of R&D',
            bio: 'PhD in Biomedical Engineering from IIT Madras. 8 years at Philips Healthcare developing cardiac monitors. Published 12 research papers on wearable sensors. Leads hardware and AI algorithm development at Arohan.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/eswar-prasad',
            twitter: 'https://twitter.com/eswarprasad',
            email: 'eswar@arohanhealth.com'
        },
        {
            name: 'Mrudhula U',
            role: 'CEO & Co-Founder',
            bio: "MBA from ISB Hyderabad, B.Tech from NIT Trichy. Former Product Manager at Practo. Lost her grandfather to a preventable fall, inspiring Arohan's mission.Oversees strategy, fundraising, and partnerships.",
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/mrudhula-u',
            twitter: 'https://twitter.com/mrudhula',
            email: 'mrudhula@arohanhealth.com'
        },
        {
            name: 'Dr. Ravi Kiran',
            role: 'Medical Advisor',
            bio: 'MD in Cardiology, 20 years at Apollo Hospitals. Specialist in geriatric cardiac care. Advises on clinical protocols, medical certifications (HIPAA, FDA), and doctor partnerships.',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/dr-ravi-kiran',
            email: 'ravi.kiran@arohanhealth.com'
        },
        {
            name: 'Ananya Sharma',
            role: 'Head of Engineering',
            bio: 'B.Tech from IIT Bombay, ex-Google India. 6 years building scalable cloud infrastructure. Leads backend development, mobile apps, and dev ops at Arohan.',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/ananya-sharma',
            twitter: 'https://twitter.com/ananyasharma',
            email: 'ananya@arohanhealth.com'
        },
        {
            name: 'Vikram Patel',
            role: 'Hardware Engineer',
            bio: "M.Sc. in Electronics from BITS Pilani. 5 years at Texas Instruments designing low-power embedded systems. Responsible for Arohan's PCB design, sensor integration, and battery optimization.",
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/vikram-patel',
            email: 'vikram@arohanhealth.com'
        },
        {
            name: 'Priya Menon',
            role: 'Head of Customer Success',
            bio: 'Former Customer Experience lead at Cure.fit. Expert in elderly care and family communication. Manages onboarding, support, and user training programs.',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
            linkedin: 'https://linkedin.com/in/priya-menon',
            twitter: 'https://twitter.com/priyamenon',
            email: 'priya@arohanhealth.com'
        }
    ];

    const advisors = [
        {
            name: 'Dr. Naresh Trehan',
            role: 'Medical Advisor',
            org: 'Founder, Medanta Hospitals'
        },
        {
            name: 'Rajan Anandan',
            role: 'Business Advisor',
            org: 'Former VP, Google India'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Our Team - Arohan Health | Wearable Health Tech Experts</title>
                <meta name="description" content="Meet the Arohan team: PhD engineers, doctors, and healthcare experts building AI-powered emergency detection wearables. IIT alumni, ex-Google, Apollo Hospitals." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Meet Our Team
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                        Healthcare experts, engineers, and dreamers on a mission to save lives
                    </Typography>
                </Container>
            </Box>

            {/* Core Team */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Core Team
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {teamMembers.map((member, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card sx={{ p: 4, height: '100%' }}>
                                <Stack direction="row" spacing={3} alignItems="flex-start">
                                    <Avatar src={member.avatar} sx={{ width: 100, height: 100 }} />
                                    <Box flexGrow={1}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {member.name}
                                        </Typography>
                                        <Chip label={member.role} color="primary" size="small" sx={{ mb: 2 }} />
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {member.bio}
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            {member.linkedin && (
                                                <IconButton size="small" href={member.linkedin} target="_blank">
                                                    <LinkedInIcon />
                                                </IconButton>
                                            )}
                                            {member.twitter && (
                                                <IconButton size="small" href={member.twitter} target="_blank">
                                                    <TwitterIcon />
                                                </IconButton>
                                            )}
                                            <IconButton size="small" href={`mailto:${member.email}`}>
                                                <EmailIcon />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Advisors */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Advisory Board
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
                        {advisors.map((advisor, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {advisor.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {advisor.role}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {advisor.org}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Join Us CTA */}
            <Container sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Want to Join Us?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    We're hiring engineers, doctors, and business professionals
                </Typography>
                <Button variant="contained" size="large">
                    View Open Positions
                </Button>
            </Container>
        </Box>
    );
}

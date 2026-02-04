import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    Button,
    Chip,
    Stack,
    Link
} from '@mui/material';
import { Article as ArticleIcon, Download as DownloadIcon, Language as WebIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

export function Press() {
    const mediaKitItems = [
        { name: 'Company Fact Sheet', size: '250 KB', link: '/press/factsheet.pdf' },
        { name: 'High-Res Logo Pack', size: '5 MB', link: '/press/logos.zip' },
        { name: 'Product Images', size: '12 MB', link: '/press/product-images.zip' },
        { name: 'Team Photos', size: '8 MB', link: '/press/team-photos.zip' }
    ];

    const pressReleases = [
        {
            date: 'January 15, 2026',
            title: 'Arohan Raises $5M in Seed Funding Led by Sequoia India',
            excerpt: 'Funding will accelerate R&D, expand to 10 cities, and scale manufacturing to 10,000 devices/month by Q3 2026.',
            link: '/press/seed-funding-2026'
        },
        {
            date: 'December 1, 2025',
            title: 'Arohan Partners with Apollo Hospitals for Pilot Program',
            excerpt: '500 cardiac patients will receive Arohan devices for post-discharge monitoring in Bengaluru, Hyderabad, and Chennai.',
            link: '/press/apollo-partnership'
        },
        {
            date: 'November 10, 2025',
            title: "Arohan Launches India's First AI-Powered Fall Detection Wearable",
            excerpt: '98% accuracy in clinical trials. Addresses critical gap in elderly care infrastructure.',
            link: '/press/product-launch-2025'
        }
    ];

    const mediaMentions = [
        {
            outlet: 'The Economic Times',
            title: 'This IIT Startup is Saving Seniors with AI',
            date: 'Jan 20, 2026',
            link: 'https://economictimes.com'
        },
        {
            outlet: 'YourStory',
            title: 'Meet Arohan: Wearable Tech for Elderly Safety',
            date: 'Dec 15, 2025',
            link: 'https://yourstory.com'
        },
        {
            outlet: 'Inc42',
            title: "Arohan's $5M Seed Round to Disrupt HealthTech",
            date: 'Jan 16, 2026',
            link: 'https://inc42.com'
        }
    ];

    return (
        <Box>
            <Helmet>
                <title>Press & Media - Arohan Health | News, Media Kit, Press Releases</title>
                <meta name="description" content="Latest press releases, media coverage, and media kit for Arohan Health. Featured in ET, YourStory, Inc42. Contact press@arohanhealth.com for inquiries." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <ArticleIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Press & Media
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
                        Latest news, press releases, and media assets
                    </Typography>
                    <Button variant="contained" sx={{ bgcolor: 'white', color: 'secondary.main' }}>
                        Download Media Kit
                    </Button>
                </Container>
            </Box>

            {/* Press Releases */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Press Releases
                </Typography>
                <Stack spacing={3} sx={{ mt: 4, maxWidth: 900, mx: 'auto' }}>
                    {pressReleases.map((release, index) => (
                        <Card key={index} sx={{ p: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                                {release.date}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {release.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {release.excerpt}
                            </Typography>
                            <Button variant="text" endIcon={<WebIcon />}>
                                Read Full Release
                            </Button>
                        </Card>
                    ))}
                </Stack>
            </Container>

            {/* Media Coverage */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        In the News
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {mediaFeatures.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ p: 3, height: '100%' }}>
                                    <Chip label={feature.outlet} color="primary" size="small" sx={{ mb: 2 }} />
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                        {feature.date}
                                    </Typography>
                                    <Link href={feature.link} target="_blank" rel="noopener">
                                        Read Article →
                                    </Link>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Media Kit */}
            <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Media Kit
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
                    {mediaKitItems.map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.size}
                                        </Typography>
                                    </Box>
                                    <IconButton>
                                        <DownloadIcon />
                                    </IconButton>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Contact */}
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Media Inquiries
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                        For interviews, quotes, or press questions
                    </Typography>
                    <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'secondary.main' }} href="mailto:press@arohanhealth.com">
                        Email: press@arohanhealth.com
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

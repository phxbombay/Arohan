import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Stack,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    Alert
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Code as CodeIcon,
    Cloud as CloudIcon,
    Psychology as AIIcon,
    PhoneAndroid as MobileIcon,
    Web as WebIcon,
    ExpandMore as ExpandMoreIcon,
    TrendingUp as TrendingUpIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import SEO from '../components/SEO';

export function Consulting() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        serviceType: '',
        budget: '',
        timeline: '',
        description: ''
    });

    const services = [
        {
            title: 'Website Development',
            icon: <WebIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            description: 'Modern, responsive websites built with cutting-edge technologies',
            technologies: ['React', 'Next.js', 'Vite', 'Material-UI', 'TailwindCSS'],
            features: [
                'Responsive design for all devices',
                'SEO optimization',
                'Performance optimization',
                'Progressive Web Apps (PWA)',
                'E-commerce integration'
            ],
            pricing: 'Starting from ₹50,000'
        },
        {
            title: 'Mobile App Development',
            icon: <MobileIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
            description: 'Native and cross-platform mobile applications',
            technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
            features: [
                'Cross-platform development',
                'Native performance',
                'Offline functionality',
                'Push notifications',
                'App Store deployment'
            ],
            pricing: 'Starting from ₹1,00,000'
        },
        {
            title: 'Healthcare IT Consulting',
            icon: <SecurityIcon sx={{ fontSize: 48, color: 'success.main' }} />,
            description: 'HIPAA-compliant healthcare technology solutions',
            technologies: ['HL7 FHIR', 'EHR Integration', 'Telemedicine', 'IoT Devices'],
            features: [
                'HIPAA/GDPR compliance',
                'EHR/EMR integration',
                'Telemedicine platforms',
                'Medical device integration',
                'Data security & encryption'
            ],
            pricing: 'Custom pricing'
        },
        {
            title: 'AI/ML Integration',
            icon: <AIIcon sx={{ fontSize: 48, color: 'error.main' }} />,
            description: 'Intelligent systems powered by machine learning',
            technologies: ['TensorFlow', 'PyTorch', 'Python', 'OpenAI', 'Computer Vision'],
            features: [
                'Predictive analytics',
                'Natural language processing',
                'Computer vision',
                'Recommendation systems',
                'Anomaly detection'
            ],
            pricing: 'Starting from ₹2,00,000'
        },
        {
            title: 'Cloud Infrastructure',
            icon: <CloudIcon sx={{ fontSize: 48, color: 'info.main' }} />,
            description: 'Scalable cloud solutions and DevOps',
            technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'],
            features: [
                'Cloud migration',
                'Auto-scaling infrastructure',
                'DevOps automation',
                'Monitoring & logging',
                'Cost optimization'
            ],
            pricing: 'Starting from ₹75,000'
        },
        {
            title: 'Full-Stack Development',
            icon: <CodeIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
            description: 'End-to-end application development',
            technologies: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'],
            features: [
                'RESTful API development',
                'Database design & optimization',
                'Authentication & authorization',
                'Real-time features (WebSocket)',
                'Microservices architecture'
            ],
            pricing: 'Starting from ₹1,50,000'
        }
    ];

    const caseStudies = [
        {
            title: 'Arohan Health Platform',
            category: 'Healthcare Tech',
            description: 'AI-powered health monitoring platform for elderly care with real-time emergency detection',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'AI/ML', 'IoT'],
            metrics: [
                { label: 'Users', value: '1,000+' },
                { label: 'Accuracy', value: '95%' },
                { label: 'Response Time', value: '<2s' }
            ],
            image: '/images/arohan-case-study.jpg'
        },
        {
            title: 'E-Commerce Platform',
            category: 'Retail',
            description: 'Scalable e-commerce solution with payment gateway integration and inventory management',
            technologies: ['Next.js', 'Stripe', 'MongoDB', 'AWS'],
            metrics: [
                { label: 'Transactions', value: '10K+/month' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Load Time', value: '<1s' }
            ],
            image: '/images/ecommerce-case-study.jpg'
        },
        {
            title: 'Telemedicine App',
            category: 'Healthcare',
            description: 'HIPAA-compliant telemedicine platform with video consultations and prescription management',
            technologies: ['React Native', 'WebRTC', 'Node.js', 'PostgreSQL'],
            metrics: [
                { label: 'Consultations', value: '5K+/month' },
                { label: 'Doctors', value: '200+' },
                { label: 'Rating', value: '4.8/5' }
            ],
            image: '/images/telemedicine-case-study.jpg'
        }
    ];

    const techStack = {
        frontend: ['React', 'Next.js', 'Vite', 'Material-UI', 'TailwindCSS', 'TypeScript'],
        backend: ['Node.js', 'Express', 'Python', 'FastAPI', 'GraphQL'],
        database: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
        cloud: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Nginx'],
        aiml: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn', 'Computer Vision']
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.serviceType) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/v1/leads/consulting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Thank you! We will contact you within 24 hours.');

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    serviceType: '',
                    budget: '',
                    timeline: '',
                    description: ''
                });
            } else {
                toast.error(data.message || 'Failed to submit inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit inquiry. Please try again.');
        }
    };

    const estimateBudget = () => {
        const { serviceType, timeline } = formData;

        if (!serviceType || !timeline) {
            toast.info('Please select service type and timeline for budget estimation');
            return;
        }

        let basePrice = 0;
        switch (serviceType) {
            case 'Website Development':
                basePrice = 50000;
                break;
            case 'Mobile App Development':
                basePrice = 100000;
                break;
            case 'Healthcare IT Consulting':
                basePrice = 150000;
                break;
            case 'AI/ML Integration':
                basePrice = 200000;
                break;
            case 'Cloud Infrastructure':
                basePrice = 75000;
                break;
            case 'Full-Stack Development':
                basePrice = 150000;
                break;
            default:
                basePrice = 50000;
        }

        // Adjust for timeline
        let multiplier = 1;
        if (timeline === '1-2 weeks') multiplier = 1.5;
        else if (timeline === '1 month') multiplier = 1.2;
        else if (timeline === '2-3 months') multiplier = 1;
        else if (timeline === '3-6 months') multiplier = 0.9;

        const estimatedBudget = Math.round(basePrice * multiplier);
        toast.success(`Estimated Budget: ₹${estimatedBudget.toLocaleString('en-IN')} - ₹${(estimatedBudget * 1.5).toLocaleString('en-IN')}`);
    };

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50' }}>
            <SEO
                title="Consulting & Development Services"
                description="Professional web development, mobile app development, healthcare IT consulting, AI/ML integration, and cloud infrastructure services. Expert team delivering cutting-edge technology solutions."
                keywords="web development, mobile app development, healthcare IT, AI ML consulting, cloud infrastructure, full stack development, React development, Node.js development"
                canonical="https://arohanhealth.com/consulting"
                type="website"
                image="https://arohanhealth.com/images/consulting-services.jpg"
            />

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        Technology Consulting & Development
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                        Transform your ideas into reality with our expert team of developers, designers, and consultants
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', px: 4 }}
                            href="#contact-form"
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, fontWeight: 'bold', px: 4 }}
                            href="#services"
                        >
                            View Services
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Services Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }} id="services">
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Our Services
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                    Comprehensive technology solutions tailored to your needs
                </Typography>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }, borderRadius: 3 }}>
                                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph align="center">
                                        {service.description}
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                                        Technologies:
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                                        {service.technologies.map((tech, i) => (
                                            <Chip key={i} label={tech} size="small" />
                                        ))}
                                    </Stack>

                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        Features:
                                    </Typography>
                                    <List dense>
                                        {service.features.map((feature, i) => (
                                            <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2' }} />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Typography variant="h6" color="primary" fontWeight="bold" align="center" sx={{ mt: 3 }}>
                                        {service.pricing}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Case Studies */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom color="white">
                        Case Studies
                    </Typography>
                    <Typography variant="h6" color="grey.400" align="center" sx={{ mb: 6 }}>
                        Real projects, real results
                    </Typography>

                    <Grid container spacing={4}>
                        {caseStudies.map((study, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', bgcolor: 'grey.800', color: 'white', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Chip label={study.category} color="primary" size="small" sx={{ mb: 2 }} />
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {study.title}
                                        </Typography>
                                        <Typography variant="body2" color="grey.400" paragraph>
                                            {study.description}
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                            {study.technologies.map((tech, i) => (
                                                <Chip key={i} label={tech} size="small" variant="outlined" sx={{ borderColor: 'grey.600', color: 'grey.300' }} />
                                            ))}
                                        </Stack>

                                        <Grid container spacing={2}>
                                            {study.metrics.map((metric, i) => (
                                                <Grid item xs={4} key={i}>
                                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.700' }}>
                                                        <Typography variant="h6" fontWeight="bold" color="primary.light">
                                                            {metric.value}
                                                        </Typography>
                                                        <Typography variant="caption" color="grey.400">
                                                            {metric.label}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Technology Stack */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Our Technology Stack
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                    Cutting-edge technologies for modern solutions
                </Typography>

                <Grid container spacing={3}>
                    {Object.entries(techStack).map(([category, technologies], index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textTransform: 'capitalize' }}>
                                    {category === 'aiml' ? 'AI/ML' : category}
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {technologies.map((tech, i) => (
                                        <Chip key={i} label={tech} color="primary" variant="outlined" size="small" />
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Contact Form */}
            <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 10 } }} id="contact-form">
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Start Your Project
                    </Typography>
                    <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                        Tell us about your project and we'll get back to you within 24 hours
                    </Typography>

                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Company (Optional)"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Service Type"
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {services.map((service) => (
                                            <MenuItem key={service.title} value={service.title}>
                                                {service.title}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Budget Range"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="< ₹50,000">&lt; ₹50,000</MenuItem>
                                        <MenuItem value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</MenuItem>
                                        <MenuItem value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</MenuItem>
                                        <MenuItem value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</MenuItem>
                                        <MenuItem value="> ₹5,00,000">&gt; ₹5,00,000</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Timeline"
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="1-2 weeks">1-2 weeks</MenuItem>
                                        <MenuItem value="1 month">1 month</MenuItem>
                                        <MenuItem value="2-3 months">2-3 months</MenuItem>
                                        <MenuItem value="3-6 months">3-6 months</MenuItem>
                                        <MenuItem value="6+ months">6+ months</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Project Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                        placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Submit Inquiry
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            size="large"
                                            fullWidth
                                            onClick={estimateBudget}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Estimate Budget
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>

                    <Alert severity="info" sx={{ mt: 4 }}>
                        <Typography variant="body2">
                            <strong>Response Time:</strong> We typically respond within 24 hours. For urgent inquiries, call us at +91-XXXX-XXXXXX
                        </Typography>
                    </Alert>
                </Container>
            </Box>

            {/* Why Choose Us */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Why Choose Us
                </Typography>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                            <TrendingUpIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Proven Track Record
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Successfully delivered 50+ projects across healthcare, e-commerce, and enterprise sectors
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                            <SpeedIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Fast Delivery
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Agile development methodology ensures rapid iterations and on-time delivery
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                            <SecurityIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Security First
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                HIPAA, GDPR compliant solutions with industry-standard security practices
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

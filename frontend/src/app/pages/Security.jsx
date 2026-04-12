import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Stack,
    Divider
} from '@mui/material';
import {
    Https as LockIcon,
    Security as ShieldIcon,
    CloudDone as CloudIcon,
    GppGood as VerifiedIcon,
    PrivacyTip as PrivacyIcon,
    SyncLock as EncryptionIcon
} from '@mui/icons-material';
import SEO from '../components/SEO';

const securityFeatures = [
    {
        icon: <EncryptionIcon sx={{ fontSize: 40 }} />,
        title: "End-to-End Encryption",
        desc: "All health data is encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3 protocols. Your private health information is accessible only to you and your authorized caregivers."
    },
    {
        icon: <ShieldIcon sx={{ fontSize: 40 }} />,
        title: "AWS Advanced Infrastructure",
        desc: "Our platform leverages AWS Shield and Web Application Firewall (WAF) to defend against DDoS attacks and common web vulnerabilities. We utilize VPC isolation to keep your data in a secure, private network."
    },
    {
        icon: <CloudIcon sx={{ fontSize: 40 }} />,
        title: "HIPAA-Ready Architecture",
        desc: "Designed with strict compliance in mind, our data storage and processing workflows follow HIPAA and GDPR guidelines for Protected Health Information (PHI)."
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
        title: "Audit Logging & Monitoring",
        desc: "Every access request to your data is logged and audited. Our 24/7 security monitoring team receives instant alerts for any suspicious activity or unauthorized access attempts."
    },
    {
        icon: <PrivacyIcon sx={{ fontSize: 40 }} />,
        title: "Spam & Bot Protection",
        desc: "Integrated AI-driven filters protect our emergency response channels from spam and malicious traffic, ensuring that real emergency signals always get through without delay."
    },
    {
        icon: <LockIcon sx={{ fontSize: 40 }} />,
        title: "Identity Protection",
        desc: "Multi-factor authentication (MFA) and role-based access control (RBAC) ensure that even within a family or clinical setting, data viewable permissions are strictly enforced."
    }
];

export function Security() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', py: 12 }}>
            <SEO 
                title="Security & Data Privacy | Arohan Health"
                description="Learn about Arohan Health's advanced security measures, including AES-256 encryption, AWS infrastructure protection, and HIPAA-ready data privacy standards."
                canonical="https://arohanhealth.com/security"
            />
            
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Box 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'primary.main', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mx: 'auto', 
                            mb: 3,
                            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <ShieldIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 2 }}>
                        Security & Privacy
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}>
                        Your health data is sacred. We protect it with the same urgency as the emergencies we detect.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 10 }} />

                {/* Features Grid */}
                <Grid container spacing={4}>
                    {securityFeatures.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: 4, 
                                    height: '100%', 
                                    borderRadius: 4, 
                                    border: 1, 
                                    borderColor: 'grey.200',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                                        transform: 'translateY(-4px)',
                                        borderColor: 'primary.light'
                                    }
                                }}
                            >
                                <Box sx={{ color: 'primary.main', mb: 3 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {feature.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Trust Footer */}
                <Paper 
                    sx={{ 
                        mt: 10, 
                        p: 6, 
                        bgcolor: 'grey.900', 
                        color: 'white', 
                        borderRadius: 6,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                        Continuous Clinical & Security Validation
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'grey.400', maxWidth: 800, mx: 'auto', mb: 4, fontSize: '1.2rem' }}>
                        Security is not a one-time setup; it's a constant process. We perform regular penetration testing and vulnerability scans to ensure our infrastructure remains impenetrable.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Box sx={{ border: 1, borderColor: 'grey.700', borderRadius: 2, px: 3, py: 1 }}>
                            <Typography variant="caption" color="grey.500" display="block">ENCRYPTION</Typography>
                            <Typography variant="body1" fontWeight="bold">AES-256-GCM</Typography>
                        </Box>
                        <Box sx={{ border: 1, borderColor: 'grey.700', borderRadius: 2, px: 3, py: 1 }}>
                            <Typography variant="caption" color="grey.500" display="block">INFRASTRUCTURE</Typography>
                            <Typography variant="body1" fontWeight="bold">AWS Cloud</Typography>
                        </Box>
                        <Box sx={{ border: 1, borderColor: 'grey.700', borderRadius: 2, px: 3, py: 1 }}>
                            <Typography variant="caption" color="grey.500" display="block">AVAILABILITY</Typography>
                            <Typography variant="body1" fontWeight="bold">99.9% SLA</Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

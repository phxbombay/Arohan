import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Stack,
    Paper,
    Divider
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Security as SecurityIcon,
    VerifiedUser as VerifiedIcon,
    Lock as LockIcon,
    Shield as ShieldIcon,
    Gavel as GavelIcon,
    ExpandMore as ExpandMoreIcon,
    Description as DocumentIcon
} from '@mui/icons-material';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export function Compliance() {
    const certifications = [
        {
            name: 'ISO 27001',
            status: 'In Progress',
            description: 'Information Security Management System',
            icon: <VerifiedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            details: [
                'Risk assessment and management',
                'Security policies and procedures',
                'Access control mechanisms',
                'Incident response protocols',
                'Regular security audits'
            ]
        },
        {
            name: 'SOC 2 Type II',
            status: 'Planned',
            description: 'Service Organization Control',
            icon: <ShieldIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
            details: [
                'Security controls validation',
                'Availability monitoring',
                'Processing integrity',
                'Confidentiality measures',
                'Privacy protection'
            ]
        },
        {
            name: 'HIPAA Compliance',
            status: 'Active',
            description: 'Health Insurance Portability and Accountability Act',
            icon: <SecurityIcon sx={{ fontSize: 48, color: 'success.main' }} />,
            details: [
                'PHI encryption at rest and in transit',
                'Access controls and audit logs',
                'Business Associate Agreements',
                'Breach notification procedures',
                'Regular compliance training'
            ]
        }
    ];

    const regulations = [
        {
            title: 'HIPAA (United States)',
            icon: <GavelIcon color="primary" />,
            description: 'Health Insurance Portability and Accountability Act',
            compliance: [
                {
                    rule: 'Privacy Rule',
                    details: 'Protects patient health information (PHI) and controls its use and disclosure'
                },
                {
                    rule: 'Security Rule',
                    details: 'Requires administrative, physical, and technical safeguards for electronic PHI'
                },
                {
                    rule: 'Breach Notification Rule',
                    details: 'Mandates notification of breaches affecting 500+ individuals within 60 days'
                }
            ],
            measures: [
                'End-to-end AES-256 encryption',
                'Role-based access control (RBAC)',
                'Comprehensive audit logging',
                'Regular security risk assessments',
                'Employee HIPAA training programs'
            ]
        },
        {
            title: 'GDPR (European Union)',
            icon: <GavelIcon color="secondary" />,
            description: 'General Data Protection Regulation',
            compliance: [
                {
                    rule: 'Right to Access',
                    details: 'Users can request copies of their personal data'
                },
                {
                    rule: 'Right to Erasure',
                    details: 'Users can request deletion of their data ("right to be forgotten")'
                },
                {
                    rule: 'Data Portability',
                    details: 'Users can transfer their data to another service provider'
                }
            ],
            measures: [
                'Explicit consent mechanisms',
                'Data minimization practices',
                'Privacy by design and default',
                'Data Protection Impact Assessments (DPIA)',
                'EU representative appointed'
            ]
        },
        {
            title: 'DPDPA 2023 (India)',
            icon: <GavelIcon color="success" />,
            description: 'Digital Personal Data Protection Act',
            compliance: [
                {
                    rule: 'Consent Framework',
                    details: 'Clear, specific, and informed consent required for data processing'
                },
                {
                    rule: 'Data Principal Rights',
                    details: 'Right to access, correction, erasure, and grievance redressal'
                },
                {
                    rule: 'Data Localization',
                    details: 'Certain data categories must be stored within India'
                }
            ],
            measures: [
                'Consent management platform',
                'Data localization infrastructure',
                'Grievance redressal mechanism',
                'Data breach notification (72 hours)',
                'Compliance with Data Protection Board'
            ]
        }
    ];

    const securityMeasures = [
        {
            category: 'Data Encryption',
            icon: <LockIcon color="primary" />,
            measures: [
                'AES-256-GCM encryption for data at rest',
                'TLS 1.3 for data in transit',
                'End-to-end encryption for sensitive communications',
                'Encrypted database backups',
                'Hardware Security Modules (HSM) for key management'
            ]
        },
        {
            category: 'Access Control',
            icon: <SecurityIcon color="secondary" />,
            measures: [
                'Multi-factor authentication (MFA)',
                'Role-based access control (RBAC)',
                'Principle of least privilege',
                'Session management and timeout',
                'IP whitelisting for admin access'
            ]
        },
        {
            category: 'Monitoring & Auditing',
            icon: <VerifiedIcon color="success" />,
            measures: [
                'Real-time security event monitoring',
                'Comprehensive audit logs (7-year retention)',
                'Automated threat detection',
                'Regular penetration testing',
                'Security Information and Event Management (SIEM)'
            ]
        },
        {
            category: 'Infrastructure Security',
            icon: <ShieldIcon color="error" />,
            measures: [
                'AWS Shield for DDoS protection',
                'Web Application Firewall (WAF)',
                'Network segmentation and isolation',
                'Regular security patches and updates',
                'Disaster recovery and business continuity plans'
            ]
        }
    ];

    const dataHandling = [
        {
            question: 'What data do we collect?',
            answer: 'We collect health vitals (heart rate, blood pressure, oxygen levels), location data (for emergency response), device information, and user profile data (name, age, emergency contacts). All data collection is transparent and requires explicit consent.'
        },
        {
            question: 'How do we use your data?',
            answer: 'Data is used exclusively for: (1) Health monitoring and emergency detection, (2) Providing personalized health insights, (3) Notifying emergency contacts, (4) Improving our AI algorithms (anonymized), and (5) Regulatory compliance.'
        },
        {
            question: 'Who has access to your data?',
            answer: 'Access is strictly limited to: (1) You and your authorized emergency contacts, (2) Healthcare providers (with your consent), (3) Our technical team (for support, with audit logs), and (4) Legal authorities (only with valid court orders).'
        },
        {
            question: 'How long do we retain data?',
            answer: 'Active health data: 7 days (free tier), 365 days (premium). Inactive accounts: 90 days after last activity. Audit logs: 7 years (regulatory requirement). You can request data deletion anytime via Settings > Privacy > Delete My Data.'
        },
        {
            question: 'Is data shared with third parties?',
            answer: 'We do NOT sell your data. Limited sharing occurs only with: (1) Cloud providers (AWS - encrypted storage), (2) Payment processors (Razorpay - transaction data only), (3) Emergency services (location during emergencies). All third parties sign Data Processing Agreements.'
        },
        {
            question: 'How can I exercise my rights?',
            answer: 'You can: (1) Access your data via Dashboard > Export Data, (2) Correct data via Profile Settings, (3) Delete data via Settings > Privacy, (4) Withdraw consent anytime, (5) File complaints with our Data Protection Officer at privacy@arohanhealth.com.'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <SEO
                title="Compliance & Data Privacy - HIPAA, GDPR, DPDPA"
                description="Arohan Health's commitment to data privacy and regulatory compliance. HIPAA, GDPR, and DPDPA 2023 compliant. ISO 27001 and SOC 2 certifications. Comprehensive data security measures."
                keywords="HIPAA compliance, GDPR compliance, DPDPA 2023, data privacy, healthcare data security, ISO 27001, SOC 2, data protection"
                canonical="https://arohanhealth.com/compliance"
                type="website"
                image="https://arohanhealth.com/images/compliance-security.jpg"
            />

            {/* Hero Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <ShieldIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        Compliance & Data Privacy
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                        Your health data is sacred. We protect it with industry-leading security and full regulatory compliance.
                    </Typography>
                </Container>
            </Box>

            {/* Certifications */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Certifications & Standards
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                    Industry-recognized security and privacy certifications
                </Typography>

                <Grid container spacing={4}>
                    {certifications.map((cert, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }, borderRadius: 3 }}>
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    {cert.icon}
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                                        {cert.name}
                                    </Typography>
                                    <Chip
                                        label={cert.status}
                                        color={cert.status === 'Active' ? 'success' : cert.status === 'In Progress' ? 'warning' : 'default'}
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {cert.description}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <List dense>
                                        {cert.details.map((detail, i) => (
                                            <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={detail} primaryTypographyProps={{ variant: 'body2' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Regulatory Compliance */}
            <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                        Regulatory Compliance
                    </Typography>
                    <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                        Full compliance with global and regional data protection laws
                    </Typography>

                    <Stack spacing={4}>
                        {regulations.map((reg, index) => (
                            <Paper key={index} sx={{ p: 4, borderRadius: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                    {reg.icon}
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {reg.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {reg.description}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Key Requirements:
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    {reg.compliance.map((item, i) => (
                                        <Grid item xs={12} md={4} key={i}>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.50', height: '100%' }}>
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                                    {item.rule}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.details}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Our Compliance Measures:
                                </Typography>
                                <List dense>
                                    {reg.measures.map((measure, i) => (
                                        <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={measure} primaryTypographyProps={{ variant: 'body2' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* Security Measures */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
                    Data Security Measures
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
                    Multi-layered security architecture protecting your health data
                </Typography>

                <Grid container spacing={4}>
                    {securityMeasures.map((category, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card sx={{ height: '100%', borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                        {category.icon}
                                        <Typography variant="h5" fontWeight="bold">
                                            {category.category}
                                        </Typography>
                                    </Stack>
                                    <List dense>
                                        {category.measures.map((measure, i) => (
                                            <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={measure} primaryTypographyProps={{ variant: 'body2' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Data Handling FAQ */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" fontWeight="bold" align="center" gutterBottom color="white">
                        Data Handling & Privacy
                    </Typography>
                    <Typography variant="h6" color="grey.400" align="center" sx={{ mb: 6 }}>
                        Transparent answers to your privacy questions
                    </Typography>

                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                        {dataHandling.map((item, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    mb: 2,
                                    bgcolor: 'grey.800',
                                    color: 'white',
                                    '&:before': { display: 'none' },
                                    borderRadius: '8px !important'
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                    <Typography fontWeight="bold" fontSize="1.1rem">
                                        {item.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color="grey.300">
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Contact & Resources */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 4, height: '100%', borderRadius: 3 }}>
                            <DocumentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Privacy Resources
                            </Typography>
                            <List>
                                <ListItem component={Link} to="/privacy-policy" sx={{ pl: 0, color: 'primary.main', textDecoration: 'none' }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Privacy Policy" />
                                </ListItem>
                                <ListItem component={Link} to="/terms-of-service" sx={{ pl: 0, color: 'primary.main', textDecoration: 'none' }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Terms of Service" />
                                </ListItem>
                                <ListItem component={Link} to="/cookies" sx={{ pl: 0, color: 'primary.main', textDecoration: 'none' }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Cookie Policy" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 4, height: '100%', borderRadius: 3, bgcolor: 'primary.50' }}>
                            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Data Protection Officer
                            </Typography>
                            <Typography variant="body1" paragraph>
                                For privacy concerns, data requests, or compliance inquiries:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>Email:</strong> privacy@arohanhealth.com<br />
                                <strong>Response Time:</strong> Within 48 hours<br />
                                <strong>Grievance Redressal:</strong> Within 30 days
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Our Data Protection Officer is available Monday-Friday, 9 AM - 6 PM IST
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

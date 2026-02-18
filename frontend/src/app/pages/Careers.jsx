import { useState } from 'react';
import { Briefcase, ArrowRight, Check, X, Mail, User, FileText, Phone } from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    Stack,
    Paper
} from '@mui/material';

const jobOpenings = [];

export function Careers() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationData, setApplicationData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: ''
    });

    const scrollToOpenings = () => {
        document.getElementById('openings-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationModal(true);
    };

    const handleApplicationSubmit = (e) => {
        e.preventDefault();

        // Mock submission
        alert(`Application submitted for ${selectedJob.title}!\n\nWe'll review your application and get back to you within 3-5 business days.\n\n(Demo mode: No real submission)`);

        setShowApplicationModal(false);
        setApplicationData({
            name: '',
            email: '',
            phone: '',
            resume: null,
            coverLetter: ''
        });
    };

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'common.white', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <Box component="section" sx={{
                position: 'relative',
                py: { xs: 10, md: 15 },
                background: 'linear-gradient(to right, #dc2626, #b91c1c)', // from-red-600 to-red-700
                color: 'common.white',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 384,
                    height: 384,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(64px)',
                    transform: 'translate(50%, -50%)'
                }} />

                <Container sx={{ position: 'relative', zIndex: 10 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                        Build Technology that <br />
                        <Box component="span" sx={{ color: 'red.100' }}>Saves Lives</Box>
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'red.100', mb: 5, maxWidth: 672, mx: 'auto', lineHeight: 1.6 }}>
                        Join us in our mission to provide dignity and safety to millions of seniors.
                        We're looking for passionate problem solvers.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={scrollToOpenings}
                        sx={{
                            bgcolor: 'common.white',
                            color: 'error.main',
                            px: 4,
                            '&:hover': { bgcolor: 'red.50' }
                        }}
                    >
                        View Openings
                    </Button>
                </Container>
            </Box>

            {/* Culture Section */}
            <Box component="section" sx={{ py: 10, bgcolor: 'grey.50' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                            Why Join Arohan?
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            We believe that work should be meaningful. Here, your code doesn't just run—it protects.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {[
                            {
                                icon: "💓",
                                title: "Mission-Driven Work",
                                desc: "Every feature we build directly impacts the safety of someone's loved one."
                            },
                            {
                                icon: "🏠",
                                title: "Remote Friendly",
                                desc: "Work from where you are most productive. We value output over hours."
                            },
                            {
                                icon: "📚",
                                title: "Continuous Growth",
                                desc: "Generous learning budget and opportunities to work on cutting-edge IoT & AI."
                            },
                            {
                                icon: "💰",
                                title: "Competitive Pay",
                                desc: "Market-leading salaries with equity options for early team members."
                            },
                            {
                                icon: "🏥",
                                title: "Healthcare Benefits",
                                desc: "Comprehensive health insurance for you and your family."
                            },
                            {
                                icon: "⚖️",
                                title: "Work-Life Balance",
                                desc: "Flexible hours, unlimited PTO, and a culture that respects personal time."
                            }
                        ].map((item, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        borderRadius: 2,
                                        transition: 'box-shadow 0.3s',
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                >
                                    <Typography variant="h3" sx={{ mb: 2 }}>{item.icon}</Typography>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Openings Section */}
            <Box component="section" id="openings-section" sx={{ py: 10, bgcolor: 'common.white' }}>
                <Container>
                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
                                <Briefcase size={32} color="#dc2626" />
                                <Typography variant="h3" fontWeight="bold" color="text.primary">
                                    Open Positions
                                </Typography>
                            </Stack>
                            <Typography variant="body1" color="text.secondary">
                                {jobOpenings.length} roles available
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                As our prototype undergoes clinical validation, we are preparing to scale our team across engineering, clinical research, and operations.
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                While we don't have active positions listed today, we are always eager to meet passionate individuals interested in health-tech.
                            </Typography>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                mt: 8,
                                p: 4,
                                textAlign: 'center',
                                background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold" color="primary.dark" gutterBottom>
                                Don't see a fit?
                            </Typography>
                            <Typography variant="body1" color="primary.main">
                                We are always looking for talent. Send your resume to{' '}
                                <Box component="a" href="mailto:careers@haspranahealth.com" sx={{ fontWeight: 'bold', textDecoration: 'underline', color: 'inherit' }}>
                                    careers@haspranahealth.com
                                </Box>
                            </Typography>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Application Modal */}
            <Dialog
                open={showApplicationModal}
                onClose={() => setShowApplicationModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Apply for {selectedJob?.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {selectedJob?.department} • {selectedJob?.location}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setShowApplicationModal(false)}>
                        <X />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} component="form" onSubmit={handleApplicationSubmit} sx={{ mt: 1 }}>
                        <TextField
                            label="Full Name"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: <User size={20} color="gray" style={{ marginRight: 8 }} />
                            }}
                            value={applicationData.name}
                            onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: <Mail size={20} color="gray" style={{ marginRight: 8 }} />
                            }}
                            value={applicationData.email}
                            onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                        />
                        <TextField
                            label="Phone"
                            type="tel"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: <Phone size={20} color="gray" style={{ marginRight: 8 }} />
                            }}
                            value={applicationData.phone}
                            onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                        />

                        <Box>
                            <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Resume/CV *</Typography>
                            <TextField
                                type="file"
                                required
                                fullWidth
                                InputProps={{
                                    startAdornment: <FileText size={20} color="gray" style={{ marginRight: 8 }} />
                                }}
                                inputProps={{ accept: ".pdf,.doc,.docx" }}
                                onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.files[0] })}
                                helperText="PDF, DOC, or DOCX (max 5MB)"
                            />
                        </Box>

                        <TextField
                            label="Cover Letter (Optional)"
                            multiline
                            rows={4}
                            fullWidth
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                            placeholder="Tell us why you're a great fit..."
                        />

                        <Alert severity="warning" icon={<Typography variant="h6" sx={{ mr: 1 }}>⚠️</Typography>}>
                            <strong>Demo Mode:</strong> This is a prototype application form. No real submission will occur.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setShowApplicationModal(false)} variant="outlined" color="inherit" fullWidth>
                        Cancel
                    </Button>
                    <Button onClick={handleApplicationSubmit} variant="contained" color="error" fullWidth>
                        Submit Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

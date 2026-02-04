import { TrendingUp, Users, Target, Calendar, DollarSign, Award } from 'lucide-react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, Stack, Chip, Divider, Paper, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from '@mui/material';

export function Investors() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'common.white' }}>
            {/* Hero */}
            <Box component="section" sx={{
                background: 'linear-gradient(to right, #dc2626, #b91c1c)', // from-red-600 to-red-700
                color: 'common.white',
                py: 10,
                textAlign: 'center'
            }}>
                <Container>
                    <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }}>
                        Investor Information
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'red.100' }}>
                        Transforming Elder-Care with AI-Powered Emergency Detection
                    </Typography>
                </Container>
            </Box>

            {/* Market Opportunity */}
            <Box component="section" sx={{ py: 8 }}>
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 6 }}>
                        <TrendingUp size={40} color="#dc2626" />
                        <Typography variant="h3" fontWeight="bold" color="text.primary">
                            Market Opportunity
                        </Typography>
                    </Stack>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        {[
                            { label: "TAM", val: "₹6,400 Cr", desc: "Total Addressable Market", color: "primary" },
                            { label: "SAM", val: "₹130 Cr", desc: "Serviceable Addressable Market", color: "success" },
                            { label: "SOM", val: "₹4 Cr", desc: "Serviceable Obtainable Market", color: "error" }
                        ].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        bgcolor: `${item.color}.50`, // using light variant
                                        background: `linear-gradient(135deg, var(--mui-palette-${item.color}-50) 0%, var(--mui-palette-${item.color}-100) 100%)`
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight="bold" color={`${item.color}.main`} gutterBottom>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color={`${item.color}.dark`} gutterBottom>
                                        {item.val}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {item.desc}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Market Data */}
                    <Paper elevation={0} sx={{ border: 2, borderColor: 'grey.200', borderRadius: 2, p: 4 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                            Market Size & Target Demographics
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                    {[
                                        { label: "Elderly Population (55+) in India", val: "159M", color: "text.primary" },
                                        { label: "With CVD Prevalence", val: "4 Cr", color: "error.main" },
                                        { label: "Wearable Device Adoption", val: "32%", color: "primary.main" },
                                        { label: "Average Device Price", val: "Affordable", color: "success.main" }
                                    ].map((row, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: 1, borderColor: 'grey.100' }}>
                                            <Typography color="text.secondary">{row.label}</Typography>
                                            <Typography variant="h5" fontWeight="bold" color={row.color}>{row.val}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                        <Users size={20} color="#dc2626" />
                                        <Typography variant="h6" fontWeight="bold">Ideal Customer Profile (ICP)</Typography>
                                    </Stack>
                                    <List dense>
                                        {[
                                            "Elderly (55+) with existing CVD",
                                            "Living alone or with spouse",
                                            "Children residing overseas",
                                            "Urban, health-conscious"
                                        ].map((pt, i) => (
                                            <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <Typography color="error.main" fontWeight="bold">•</Typography>
                                                </ListItemIcon>
                                                <ListItemText primary={pt} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>

            {/* Development Roadmap */}
            <Box component="section" sx={{ py: 8, bgcolor: 'grey.50' }}>
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 6 }}>
                        <Calendar size={40} color="#dc2626" />
                        <Typography variant="h3" fontWeight="bold">
                            Development Roadmap 2026
                        </Typography>
                    </Stack>

                    <Stack spacing={3}>
                        {[
                            {
                                phase: "Phase 1: MVP & Clinical Validation",
                                period: "Jan–Apr 2026",
                                color: "primary",
                                goals: [
                                    "Validated prototype ready",
                                    "50-subject clinical trial completed",
                                    "95% detection accuracy achieved",
                                    "Technical specs frozen"
                                ]
                            },
                            {
                                phase: "Phase 2: Regulatory Compliance",
                                period: "Feb–Sep 2026",
                                color: "success",
                                goals: [
                                    "Regulatory certificates obtained",
                                    "Manufacturing-ready certification",
                                    "Quality systems in place"
                                ]
                            },
                            {
                                phase: "Phase 3: Manufacturing & Scale",
                                period: "Mar–Aug 2026",
                                color: "secondary",
                                goals: [
                                    "OEM partnership finalized",
                                    "10K units/year capacity established",
                                    "Pilot production of 1,000 units"
                                ]
                            },
                            {
                                phase: "Phase 4: Cloud & AI Platform",
                                period: "Jan–Jul 2026",
                                color: "warning",
                                goals: [
                                    "99.9% uptime infrastructure",
                                    "Mobile app (iOS & Android) live",
                                    "Web dashboard deployed",
                                    "AI models in production"
                                ]
                            }
                        ].map((phase, idx) => (
                            <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderLeft: 6,
                                    borderColor: `${phase.color}.main`,
                                    bgcolor: `${phase.color}.50` // Approximation, ideally lighter
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" color="text.primary">{phase.phase}</Typography>
                                    <Chip label={phase.period} size="small" sx={{ bgcolor: 'common.white', fontWeight: 'bold' }} />
                                </Box>
                                <Grid container spacing={1}>
                                    {phase.goals.map((goal, gIdx) => (
                                        <Grid item xs={12} md={6} key={gIdx} display="flex" alignItems="center" gap={1}>
                                            <Typography color="success.main" fontWeight="bold">✓</Typography>
                                            <Typography variant="body2" color="text.secondary">{goal}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* Pilot Launch */}
            <Box component="section" sx={{ py: 8 }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Pilot Launch & Market Validation
                        </Typography>
                        <Typography variant="h5" color="text.secondary">
                            May–Oct 2026
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ border: 2, borderColor: 'error.200', p: 4, height: '100%' }}>
                                <Typography variant="h5" fontWeight="bold" color="error.main" gutterBottom>
                                    Deployment Targets
                                </Typography>
                                <Stack spacing={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: 'error.50',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography variant="h5" fontWeight="bold" color="error.main">200</Typography>
                                        </Box>
                                        <Box>
                                            <Typography fontWeight="bold">Users</Typography>
                                            <Typography variant="body2" color="text.secondary">Across 3 partner sites</Typography>
                                        </Box>
                                    </Box>
                                    <List dense>
                                        {["Senior homes", "Hospitals", "Community centers"].map((t, i) => (
                                            <ListItem key={i} disablePadding>
                                                <Typography color="text.secondary">• {t}</Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ border: 2, borderColor: 'success.200', p: 4, height: '100%' }}>
                                <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
                                    Success Metrics
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {[
                                        { label: "Net Promoter Score (NPS)", val: "≥ 40" },
                                        { label: "Case Studies", val: "3+" },
                                        { label: "B2B LOI Pipeline", val: "₹25 Cr" },
                                        { label: "B2B LOIs Secured", val: "35+" }
                                    ].map((m, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: 1, borderColor: 'grey.100' }}>
                                            <Typography color="text.secondary">{m.label}</Typography>
                                            <Typography variant="h6" fontWeight="bold" color="success.main">{m.val}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Funding */}
            <Box component="section" sx={{ py: 8, bgcolor: 'grey.50' }}>
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 6 }}>
                        <DollarSign size={40} color="#dc2626" />
                        <Typography variant="h3" fontWeight="bold">
                            Seed Funding
                        </Typography>
                    </Stack>

                    <Paper elevation={0} sx={{ border: 2, borderColor: 'grey.200', p: 4, mb: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Seed Round Target</Typography>
                            <Typography variant="h2" fontWeight="bold" color="error.main">₹10-12 Cr</Typography>
                        </Box>

                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Budget Allocation
                        </Typography>
                        <Stack spacing={2}>
                            {[
                                { item: "MVP & Clinical Validation", amount: "₹3 Cr", percent: 30, color: "primary" },
                                { item: "Cloud Platform & AI", amount: "₹2.5 Cr", percent: 25, color: "success" },
                                { item: "Regulatory & Compliance", amount: "₹2 Cr", percent: 20, color: "secondary" },
                                { item: "Manufacturing Setup & R&D", amount: "₹1.5 Cr", percent: 15, color: "warning" },
                                { item: "Brand, GTM & Sales", amount: "₹0.5 Cr", percent: 5, color: "info" },
                                { item: "Investor Relations & Legal", amount: "₹0.5 Cr", percent: 5, color: "error" }
                            ].map((item, idx) => (
                                <Box key={idx}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight="medium">{item.item}</Typography>
                                        <Typography variant="body2" fontWeight="bold">{item.amount} ({item.percent}%)</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.percent}
                                        color={item.color}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>

                    {/* Series A Readiness */}
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            background: 'linear-gradient(to right, #dc2626, #b91c1c)', // Red gradient
                            color: 'common.white',
                            borderRadius: 2
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                            <Award size={32} />
                            <Typography variant="h4" fontWeight="bold">Series-A Readiness by Dec 2026</Typography>
                        </Stack>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Seed Milestones</Typography>
                                <Stack spacing={1}>
                                    {[
                                        "MVP validated with clinical trials",
                                        "Regulatory approvals filed",
                                        "Manufacturing partners signed",
                                        "Pilots generating case studies"
                                    ].map((txt, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                                            <Typography color="success.light">✓</Typography>
                                            <Typography variant="body2">{txt}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Series-A Targets</Typography>
                                <Stack spacing={1}>
                                    {[
                                        "₹25+ Cr revenue pipeline",
                                        "Proven product-market fit",
                                        "Strong team & advisors",
                                        "Scalable infrastructure (99.9% uptime)"
                                    ].map((txt, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                                            <Typography color="warning.light">→</Typography>
                                            <Typography variant="body2">{txt}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>

            {/* CTA */}
            <Box component="section" sx={{ py: 8 }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Join Us in Saving Lives
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        Be part of the revolution transforming emergency care for millions
                    </Typography>
                    <Button
                        component="a"
                        href="mailto:info@haspranahealth.com"
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'error.main',
                            '&:hover': { bgcolor: 'error.dark' },
                            px: 4,
                            py: 1.5,
                            fontSize: '1.125rem'
                        }}
                    >
                        Contact Investor Relations
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

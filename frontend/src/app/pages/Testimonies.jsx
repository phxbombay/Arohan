import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Divider,
    Paper
} from '@mui/material';
import {
    RemoveRedEye as EyeIcon,
    WorkOutline as PortfolioIcon,
    AutoAwesome as SparkleIcon,
    FormatQuote as QuoteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// ─── Project Data ────────────────────────────────────────────────────────────
const projects = [
    {
        number: '01',
        icon: <EyeIcon sx={{ fontSize: 36 }} />,
        category: 'Computer Vision · Healthcare',
        categoryColor: 'primary',
        title: 'Limbus and Pupil Detector App',
        description:
            'Developed an eye-tracking application that detects and tracks both the pupil center and the limbus (iris boundary) to estimate gaze direction with improved accuracy. The system uses computer vision techniques to process real-time video input, enabling robust eye movement tracking even under varying lighting conditions. By combining pupil and limbus detection, the application enhances precision and stability, making it suitable for use in assistive technologies, medical analysis, and human-computer interaction systems.',
        tags: ['Computer Vision', 'Real-Time Processing', 'Assistive Tech', 'Medical Analysis'],
        accentColor: '#1976d2',
        bgGradient: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0.02) 100%)',
        borderColor: 'rgba(25,118,210,0.18)'
    },
    {
        number: '02',
        icon: <PortfolioIcon sx={{ fontSize: 36 }} />,
        category: 'Web Development · Design',
        categoryColor: 'success',
        title: 'Portfolio Platform',
        description:
            'Designed and developed a dynamic portfolio platform that allows users to create, manage, and showcase their professional profiles and projects in a structured and visually appealing manner. The platform supports customizable layouts, project uploads, and user-friendly navigation, helping individuals effectively present their skills and achievements online.',
        tags: ['Full-Stack', 'UI/UX Design', 'Dynamic Layouts', 'User Management'],
        accentColor: '#2e7d32',
        bgGradient: 'linear-gradient(135deg, rgba(46,125,50,0.08) 0%, rgba(46,125,50,0.02) 100%)',
        borderColor: 'rgba(46,125,50,0.18)'
    }
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut', delay }
});

import { useTranslation } from 'react-i18next';

// ─── Component ────────────────────────────────────────────────────────────────
export function ProjectsOverview() {
    const { t } = useTranslation();

    // Map visual properties to localized items
    const rawProjects = t('projects.items', { returnObjects: true }) || [];
    const visualProps = [
        {
            number: '01',
            icon: <EyeIcon sx={{ fontSize: 36 }} />,
            categoryColor: 'primary',
            accentColor: '#1976d2',
            bgGradient: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0.02) 100%)',
            borderColor: 'rgba(25,118,210,0.18)'
        },
        {
            number: '02',
            icon: <PortfolioIcon sx={{ fontSize: 36 }} />,
            categoryColor: 'success',
            accentColor: '#2e7d32',
            bgGradient: 'linear-gradient(135deg, rgba(46,125,50,0.08) 0%, rgba(46,125,50,0.02) 100%)',
            borderColor: 'rgba(46,125,50,0.18)'
        },
        {
            number: '03',
            icon: <SparkleIcon sx={{ fontSize: 36 }} />,
            categoryColor: 'secondary',
            accentColor: '#9c27b0',
            bgGradient: 'linear-gradient(135deg, rgba(156,39,176,0.08) 0%, rgba(156,39,176,0.02) 100%)',
            borderColor: 'rgba(156,39,176,0.18)'
        }
    ];

    const projects = rawProjects.map((rp, i) => ({
        ...rp,
        ...(visualProps[i] || visualProps[0])
    }));

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
            <SEO
                title={t('projects.title') + " — Arohan Health"}
                description={t('projects.subtitle')}
                canonical="https://arohanhealth.com/projects-overview"
                type="website"
            />

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    pt: { xs: 10, md: 16 },
                    pb: { xs: 8, md: 12 },
                    bgcolor: 'background.paper'
                }}
            >
                {/* Decorative blobs */}
                <Box sx={{
                    position: 'absolute', top: -80, right: -80,
                    width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(25,118,210,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <Box sx={{
                    position: 'absolute', bottom: -60, left: -60,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(46,125,50,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <MotionBox {...fadeUp(0)} sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                            <SparkleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Chip
                                label={t('projects.featured')}
                                size="small"
                                sx={{
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    border: '1px solid',
                                    borderColor: 'primary.100',
                                    letterSpacing: 0.5
                                }}
                            />
                            <SparkleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        </Stack>

                        <Typography
                            variant="h2"
                            fontWeight={900}
                            sx={{
                                color: 'text.primary',
                                fontSize: { xs: '2.4rem', md: '3.5rem' },
                                lineHeight: 1.15,
                                mb: 3,
                                letterSpacing: '-1px'
                            }}
                        >
                            {t('projects.title')}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 400,
                                lineHeight: 1.7,
                                maxWidth: 580,
                                mx: 'auto'
                            }}
                        >
                            {t('projects.subtitle')}
                        </Typography>
                    </MotionBox>

                </Container>
            </Box>

            {/* ── Project Cards ──────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {projects.map((project, i) => (
                            <Grid item xs={12} key={i}>
                                <MotionCard
                                    {...fadeUp(i * 0.15)}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 5,
                                        border: `1px solid ${project.borderColor}`,
                                        overflow: 'hidden',
                                        background: project.bgGradient,
                                        transition: 'all 0.35s ease',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            boxShadow: `0 24px 64px ${project.accentColor}22`,
                                            border: `1px solid ${project.accentColor}55`
                                        }
                                    }}
                                >
                                    {/* Top accent bar */}
                                    <Box sx={{ height: 5, bgcolor: project.accentColor }} />

                                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                        <Grid container spacing={4} alignItems="flex-start">

                                            {/* Left column — meta */}
                                            <Grid item xs={12} md={3}>
                                                <Stack spacing={2.5}>
                                                    {/* Large number */}
                                                    <Typography
                                                        sx={{
                                                            fontSize: '5rem',
                                                            fontWeight: 900,
                                                            lineHeight: 1,
                                                            color: `${project.accentColor}22`,
                                                            letterSpacing: '-4px',
                                                            userSelect: 'none'
                                                        }}
                                                    >
                                                        {project.number}
                                                    </Typography>

                                                    {/* Icon bubble */}
                                                    <Box
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            borderRadius: 3,
                                                            bgcolor: `${project.accentColor}18`,
                                                            border: `1.5px solid ${project.accentColor}33`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: project.accentColor
                                                        }}
                                                    >
                                                        {project.icon}
                                                    </Box>

                                                    {/* Category chip */}
                                                    <Chip
                                                        label={project.category}
                                                        size="small"
                                                        color={project.categoryColor}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600, fontSize: '0.7rem', width: 'fit-content' }}
                                                    />

                                                    {/* Tags */}
                                                    <Stack spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                                        {(project.tags || []).map((tag, ti) => (
                                                            <Box
                                                                key={ti}
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    fontSize: '0.75rem',
                                                                    color: 'text.secondary',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: 6,
                                                                        height: 6,
                                                                        borderRadius: '50%',
                                                                        bgcolor: project.accentColor,
                                                                        flexShrink: 0
                                                                    }}
                                                                />
                                                                {tag}
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Grid>

                                            {/* Right column — content */}
                                            <Grid item xs={12} md={9}>
                                                {/* Quote icon */}
                                                <QuoteIcon sx={{ color: project.accentColor, opacity: 0.25, fontSize: 56, mb: -1, ml: -1 }} />

                                                {/* Title */}
                                                <Typography
                                                    variant="h4"
                                                    fontWeight={800}
                                                    sx={{
                                                        mb: 3,
                                                        lineHeight: 1.25,
                                                        fontSize: { xs: '1.6rem', md: '2rem' },
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    {project.title}
                                                </Typography>

                                                {/* Divider with accent */}
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 3,
                                                        bgcolor: project.accentColor,
                                                        borderRadius: 2,
                                                        mb: 3
                                                    }}
                                                />

                                                {/* Description */}
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={{
                                                        lineHeight: 1.9,
                                                        fontSize: { xs: '0.92rem', md: '1rem' }
                                                    }}
                                                >
                                                    {project.description}
                                                </Typography>

                                                {/* Mobile tags */}
                                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3, display: { xs: 'flex', md: 'none' } }}>
                                                    {(project.tags || []).map((tag, ti) => (
                                                        <Chip key={ti} label={tag} size="small"
                                                            sx={{ bgcolor: `${project.accentColor}12`, color: project.accentColor, fontWeight: 600, fontSize: '0.7rem' }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper', textAlign: 'center' }}>
                <Container maxWidth="sm">
                    <MotionBox {...fadeUp(0)}>
                        <SparkleIcon sx={{ color: 'primary.main', fontSize: 36, mb: 2 }} />
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            {t('projects.status')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {t('projects.statusDesc')}
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    );
}

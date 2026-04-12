import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    HelpOutline as HelpCircleIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid,
    Paper,
    Stack
} from '@mui/material';


export function FAQ() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Fallback in case of loading state or missing translations
    const faqCategories = t('faq.categories', { returnObjects: true }) || [];

    useEffect(() => {
        if (searchTerm) {
            setSelectedCategory('All');
        }
    }, [searchTerm]);

    const filteredCategories = faqCategories
        .map(cat => ({
            ...cat,
            questions: cat.questions.filter(item =>
                searchTerm === '' ||
                item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.a.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }))
        .filter(cat =>
            (selectedCategory === 'All' || cat.category === selectedCategory) &&
            cat.questions.length > 0
        );

    const categories = ['All', ...faqCategories.map(c => c.category)];

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', py: 10, px: 2 }}>
            <SEO
                title={t('faq.title')}
                description={t('faq.subtitle')}
                keywords="Arohan FAQ, health wearable questions, emergency monitoring help, AI device support India"
                canonical="https://arohanhealth.com/faq"
            />
            <Container>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'error.50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <HelpCircleIcon sx={{ fontSize: 32, color: 'error.main' }} />
                    </Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>{t('faq.title')}</Typography>
                    <Typography variant="h6" color="text.secondary">{t('faq.subtitle')}</Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder={t('faq.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 6, bgcolor: 'common.white' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                    }}
                />

                {/* Category Filter */}
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 6, justifyContent: 'center' }}>
                    {categories.map(cat => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            color={selectedCategory === cat ? 'error' : 'default'}
                            variant={selectedCategory === cat ? 'filled' : 'outlined'}
                            clickable
                            sx={{ fontWeight: 'medium' }}
                        />
                    ))}
                </Stack>

                {/* FAQ Content */}
                {filteredCategories.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>{t('faq.noResults')} "{searchTerm}"</Typography>
                        <Button onClick={() => setSearchTerm('')} color="error">{t('faq.clearSearch')}</Button>
                    </Paper>
                ) : (
                    <Stack spacing={4}>
                        {filteredCategories.map((category, catIdx) => (
                            <Paper key={catIdx} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: 'error.50', px: 3, py: 2, borderBottom: 1, borderColor: 'error.100', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="h5">{category.icon}</Typography>
                                    <Typography variant="h6" fontWeight="bold" color="text.primary">{category.category}</Typography>
                                </Box>
                                <Box>
                                    {category.questions.map((item, qIdx) => (
                                        <Accordion key={qIdx} disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: 1, borderColor: 'grey.100' }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography fontWeight="medium">{item.q}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ bgcolor: 'grey.50' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{item.a}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* Still Have Questions */}
                <Paper
                    elevation={4}
                    sx={{
                        mt: 8,
                        p: 6,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                        color: 'common.white',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>{t('faq.stillQuestions.title')}</Typography>
                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>{t('faq.stillQuestions.desc')}</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" sx={{ bgcolor: 'common.white', color: 'error.main', '&:hover': { bgcolor: 'grey.100' } }} href="/contact">
                            {t('faq.stillQuestions.contact')}
                        </Button>
                        <Button variant="outlined" sx={{ color: 'common.white', borderColor: 'common.white', '&:hover': { borderColor: 'grey.200', bgcolor: 'rgba(255,255,255,0.1)' } }} href="mailto:support@arohanhealth.com">
                            {t('faq.stillQuestions.email')}
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

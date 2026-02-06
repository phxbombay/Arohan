import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Grid,
    Card,
    Button
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, HelpOutline as HelpIcon } from '@mui/icons-material';
import { generateFAQSchema, generateBreadcrumbSchema } from '../../utils/structuredData';
import { StructuredData } from '../components/StructuredData';

export function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Topics', count: 20 },
        { id: 'getting-started', label: 'Getting Started', count: 5 },
        { id: 'technical', label: 'Technical Support', count: 6 },
        { id: 'privacy', label: 'Privacy & Security', count: 4 },
        { id: 'billing', label: 'Billing & Pricing', count: 5 }
    ];

    const faqs = [
        {
            category: 'getting-started',
            question: 'How do I set up my Arohan device?',
            answer: 'Setting up is easy: (1) Download the Arohan app from App Store/Play Store, (2) Create an account, (3) Turn on your device and enable Bluetooth, (4) Follow in-app pairing instructions (takes 2 minutes), (5) Calibrate your baseline vitals by sitting calmly for 1 minute, (6) Add emergency contacts. Done! Your device is now monitoring 24/7.'
        },
        {
            category: 'getting-started',
            question: 'Do I need a smartphone to use Arohan?',
            answer: 'Yes, a smartphone (iOS 15+ or Android 10+) is required for initial setup and to receive detailed alerts. However, emergency contacts can be notified via SMS even if your phone is turned off or lost. The device can also work standalone with basic alerts if configured.'
        },
        {
            category: 'getting-started',
            question: 'Can elderly people with limited tech skills use Arohan?',
            answer: 'Absolutely! Arohan is designed for simplicity. Once set up by a family member, the elderly user just wears the device—no buttons to press, no apps to open. Emergency alerts trigger automatically. We also offer video tutorials and phone support in English and Hindi.'
        },
        {
            category: 'getting-started',
            question: 'How long does the battery last?',
            answer: 'The battery is designed for multi-day continuous monitoring. Detailed battery specifications and charging times will be finalized while the prototype is undergoing clinical validation.'
        },
        {
            category: 'getting-started',
            question: 'Is the device waterproof?',
            answer: 'Arohan is designed with splash resistance for everyday use. Detailed IP ratings will be provided as the prototype undergoes clinical validation.'
        },
        {
            category: 'technical',
            question: 'What happens if the device detects a fall?',
            answer: 'When a fall is detected, the device: (1) Waits 10 seconds for you to cancel if it\'s a false alarm, (2) If no response, sends SMS/call alerts to all emergency contacts with your location, (3) Displays a notification on your phone, (4) Logs the event in your health dashboard. You can review all fall events in the app.'
        },
        {
            category: 'technical',
            question: 'How accurate is the fall detection?',
            answer: 'Arohan uses advanced sensor fusion and machine learning to distinguish falls from normal movements. We are currently establishing our validated accuracy metrics as the prototype undergoes clinical validation.'
        },
        {
            category: 'technical',
            question: 'Can Arohan detect heart attacks?',
            answer: 'Arohan monitors heart rate and rhythm for anomalies that may indicate potential cardiac concerns. Our system is designed to provide high sensitivity in pattern detection. However, it is NOT a medical diagnostic device. Always consult a doctor for diagnosis.'
        },
        {
            category: 'technical',
            question: 'What if I don\'t have internet or WiFi?',
            answer: 'Arohan works via Bluetooth (to sync with your phone) and cellular SMS (for emergency alerts). You don\'t need WiFi. If you\'re in an area without cellular coverage, alerts won\'t send until you regain signal, but the device continues monitoring and logs all events.'
        },
        {
            category: 'technical',
            question: 'How do I add or remove emergency contacts?',
            answer: 'Open the Arohan app → Settings → Emergency Contacts → Add/Edit/Delete. You can add up to 5 contacts on Premium plan (unlimited on VIP). Each contact receives SMS and automated voice calls during emergencies. You can also set a primary contact who is called first.'
        },
        {
            category: 'technical',
            question: 'Can multiple family members monitor the same elderly relative?',
            answer: 'Yes! The Premium and VIP plans include "Family Sharing." Add family members as caregivers in the app. They\'ll receive emergency alerts and can view health summaries (with the user\'s consent). Each caregiver logs in with their own account.'
        },
        {
            category: 'privacy',
            question: 'Is my health data secure?',
            answer: 'Absolutely. Your data is encrypted end-to-end using AES-256 encryption. We are HIPAA and GDPR compliant. Health data is stored on secure servers in India (Mumbai region). We never sell your data to third parties. You can delete your data anytime via the app.'
        },
        {
            category: 'privacy',
            question: 'Who can see my health data?',
            answer: 'Only you and people you explicitly authorize (family caregivers, doctors). Even Arohan staff cannot access your health data without your written consent. Data is anonymized for analytics and AI model improvement (opt-out available).'
        },
        {
            category: 'privacy',
            question: 'Do you share data with insurance companies or employers?',
            answer: 'Never without your explicit written consent. If you\'re part of a corporate wellness program, only aggregated, anonymized data (e.g., "20% of employees improved sleep") is shared with HR—individual data stays private.'
        },
        {
            category: 'privacy',
            question: 'Can I export or delete my data?',
            answer: 'Yes! GDPR gives you the right to data portability and deletion. Go to Settings → Privacy → Download My Data (CSV/JSON format) or Delete My Account (irreversible, all data erased within 30 days).'
        },
        {
            category: 'billing',
            question: 'What\'s the total cost to get started?',
            answer: 'Device: One-time purchase. Basic app: Free forever. Premium app: Subscription (optional). First-year includes device + optional Premium subscription.'
        },
        {
            category: 'billing',
            question: 'Can I cancel my Premium subscription anytime?',
            answer: 'Yes, cancel anytime with no penalties. You\'ll continue to have access until the end of your billing cycle. If you cancel mid-month, you can request a pro-rated refund within 7 days of cancellation.'
        },
        {
            category: 'billing',
            question: 'Do you offer a free trial for Premium?',
            answer: 'Yes! New users get 14 days of Premium features free (no credit card required). After the trial, you\'ll automatically downgrade to Basic unless you subscribe.'
        },
        {
            category: 'billing',
            question: 'What\'s your refund policy?',
            answer: '30-day money-back guarantee on devices (must be in original condition with packaging). Subscriptions are non-refundable except for pro-rated refunds on cancellations. If you encounter a defect, we offer free replacement within warranty (1 year).'
        },
        {
            category: 'billing',
            question: 'Do you offer student or senior citizen discounts?',
            answer: 'Yes! Senior citizens (65+) get discounted Premium subscriptions. Students and NGOs receive custom pricing—email sales@arohanhealth.com with proof of eligibility.'
        }
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const breadcrumbs = [
        { name: 'Home', url: 'https://arohan-health.com/' },
        { name: 'FAQ', url: 'https://arohan-health.com/faq' }
    ];

    return (
        <Box>
            <StructuredData schema={generateFAQSchema(faqs)} />
            <StructuredData schema={generateBreadcrumbSchema(breadcrumbs)} />

            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container>
                    <HelpIcon sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                        Find answers to common questions about Arohan
                    </Typography>

                    {/* Search */}
                    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                        <TextField
                            fullWidth
                            placeholder="Search for answers..."
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                sx: {
                                    bgcolor: 'white',
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container sx={{ py: { xs: 6, md: 10 } }}>
                <Grid container spacing={4}>
                    {/* Categories Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Card sx={{ p: 2, position: 'sticky', top: 24 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Categories
                            </Typography>
                            <Stack spacing={1}>
                                {categories.map((cat) => (
                                    <Chip
                                        key={cat.id}
                                        label={`${cat.label} (${cat.count})`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        color={selectedCategory === cat.id ? 'primary' : 'default'}
                                        variant={selectedCategory === cat.id ? 'filled' : 'outlined'}
                                        sx={{ justifyContent: 'flex-start' }}
                                    />
                                ))}
                            </Stack>
                        </Card>
                    </Grid>

                    {/* FAQ List */}
                    <Grid item xs={12} md={9}>
                        {filteredFAQs.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No questions found. Try a different search term or category.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.label}
                                    <Chip label={`${filteredFAQs.length} results`} size="small" sx={{ ml: 2 }} />
                                </Typography>
                                {filteredFAQs.map((faq, index) => (
                                    <Accordion key={index} sx={{ mb: 1 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography fontWeight="bold">{faq.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                                {faq.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Still Have Questions CTA */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Didn't Find Your Answer?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Our support team is here to help 24/7
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button variant="contained" size="large">
                            Contact Support
                        </Button>
                        <Button variant="outlined" size="large">
                            Schedule a Call
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

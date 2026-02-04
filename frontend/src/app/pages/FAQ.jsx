import { useState, useEffect } from 'react';
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

const faqCategories = [
    {
        category: "Getting Started",
        icon: "🚀",
        questions: [
            {
                q: "What is Arohan?",
                a: "Arohan is an AI-powered wearable health monitoring system designed specifically for elderly care. It provides 24/7 monitoring of vital signs, instant emergency detection (falls, cardiac events), and automatic alerts to family members and emergency services."
            },
            {
                q: "How does Arohan work?",
                a: "Arohan consists of a comfortable wearable device that continuously monitors your health vitals (heart rate, blood pressure, activity, sleep). Our AI analyzes this data in real-time to detect emergencies. If an anomaly is detected, the system automatically alerts your emergency contacts and can coordinate with nearby hospitals."
            },
            {
                q: "Who should use Arohan?",
                a: "Arohan is ideal for: (1) Elderly individuals living alone or with limited supervision, (2) Seniors with chronic health conditions like hypertension or arrhythmia, (3) Families who want peace of mind about their aging relatives, (4) Healthcare facilities managing multiple elderly patients."
            },
            {
                q: "Do I need a smartphone to use Arohan?",
                a: "No! The Arohan device works independently with cellular connectivity. However, having the mobile app enhances your experience with detailed health insights, but it's not required for emergency alerts to function."
            }
        ]
    },
    {
        category: "Device & Technology",
        icon: "⌚",
        questions: [
            {
                q: "What health metrics does Arohan monitor?",
                a: "Arohan tracks: Heart rate (continuous), Blood pressure, Oxygen saturation (SpO2), Body temperature, Respiratory rate, Activity (steps, calories, distance), Sleep quality and duration, Fall detection via accelerometer."
            },
            {
                q: "How accurate is the fall detection?",
                a: "Our fall detection algorithm has 98% accuracy in clinical trials. It uses advanced motion sensors and AI to distinguish between actual falls and normal activities like sitting down quickly or exercising."
            },
            {
                q: "What is the battery life?",
                a: "The Arohan device lasts 7 days on a single charge with typical use. Charging takes approximately 2 hours using the included magnetic charger."
            },
            {
                q: "Is the device waterproof?",
                a: "Yes, Arohan is water-resistant (IP67 rating), meaning it can withstand splashes, rain, and handwashing. However, it's not designed for swimming or showering. We recommend removing it during water activities."
            },
            {
                q: "How do I set up my Arohan device?",
                a: "Setup is simple: (1) Charge the device fully, (2) Download the Arohan app (iOS/Android), (3) Create your account, (4) Pair the device via Bluetooth, (5) Complete the health profile, (6) Add emergency contacts. The entire process takes about 10 minutes."
            },
            {
                q: "Can I wear Arohan during sleep?",
                a: "Absolutely! In fact, we encourage nighttime wear as Arohan monitors sleep quality and can detect emergencies that occur during sleep, which are often the most dangerous."
            }
        ]
    },
    {
        category: "Health & Safety",
        icon: "🏥",
        questions: [
            {
                q: "How does emergency detection work?",
                a: "Arohan uses rule-based medical algorithms to analyze your vitals against personalized thresholds. For example, if your heart rate exceeds 140 BPM while resting, or if blood pressure reaches crisis levels (>180/120), the system immediately triggers an emergency alert."
            },
            {
                q: "What happens when an emergency is detected?",
                a: "Within seconds: (1) Your emergency contacts receive SMS/call alerts, (2) Your GPS location is shared, (3) The nearest hospital is notified (if enrolled), (4) Ambulance dispatch is coordinated via 112, (5) Your health data is transmitted to responders."
            },
            {
                q: "Can I manually trigger an emergency alert?",
                a: "Yes! Press and hold the SOS button on the device for 3 seconds, or use the Emergency SOS button in the mobile app/web dashboard. This is useful if you feel unwell but sensors haven't detected an anomaly yet."
            },
            {
                q: "Is my health data secure and private?",
                a: "Your privacy is our top priority. All health data is encrypted end-to-end (AES-256), stored on HIPAA-compliant servers, and never shared with third parties without your explicit consent. You can delete your data anytime from the app."
            },
            {
                q: "Does Arohan replace my doctor?",
                a: "No. Arohan is a monitoring and alert system, not a medical diagnostic tool. It helps detect emergencies and track health trends, but you should always consult your healthcare provider for medical advice, diagnosis, or treatment."
            },
            {
                q: "What if I have a pacemaker or other medical devices?",
                a: "Arohan is safe to use with most medical devices, including pacemakers. However, we recommend consulting your doctor before use if you have any implanted medical devices to ensure compatibility."
            }
        ]
    },
    {
        category: "Pricing & Subscription",
        icon: "💳",
        questions: [
            {
                q: "How much does Arohan cost?",
                a: "Device: One-time purchase. Mobile App: Free (basic features) or Subscription (Premium). Premium includes: AI health insights, family member access, priority customer support, advanced analytics, and API access."
            },
            {
                q: "Is there a free trial?",
                a: "Yes! New users get a 30-day free trial of Premium features. No credit card required for the device purchase, and you can cancel Premium anytime."
            },
            {
                q: "What's included in the device purchase?",
                a: "Your purchase includes: Arohan wearable device, Magnetic charging cable, User manual, 1-year manufacturer warranty, Free basic app access (forever), Setup and onboarding support."
            },
            {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel Premium anytime from your account settings. You'll continue to have access until the end of your billing cycle, and your data is retained. The basic app remains free forever."
            },
            {
                q: "Do you offer bulk discounts for families or organizations?",
                a: "Yes! Family packs: 3+ devices get 10% off. Corporate/Hospital bulk orders: 10+ devices get 15% off, 50+ get 20% off. Contact sales@arohanhealth.com for custom quotes."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept: Credit/Debit cards (Visa, Mastercard, Amex, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, Wallets (Paytm, Mobikwik). All transactions are secured by Razorpay."
            }
        ]
    },
    {
        category: "Technical Support",
        icon: "🛠️",
        questions: [
            {
                q: "My device isn't connecting to the app. What should I do?",
                a: "Try these steps: (1) Ensure Bluetooth is enabled on your phone, (2) Restart the Arohan device (hold power button for 10 seconds), (3) Force close and reopen the app, (4) Ensure device is charged (>20%), (5) If issue persists, unpair and re-pair via app settings."
            },
            {
                q: "How do I update my device firmware?",
                a: "Firmware updates are automatic when connected to the app and WiFi. You'll receive a notification when an update is available. The device must have >50% battery. Updates typically take 5-10 minutes and happen in the background."
            },
            {
                q: "What if my device gets lost or stolen?",
                a: "Log into your web dashboard → Settings → Device Management → Mark as Lost. This will: (1) Disable the device remotely, (2) Show last known GPS location, (3) Enable tracking alerts if it comes online. We can also help replace lost devices at a discounted rate."
            },
            {
                q: "How do I add or change emergency contacts?",
                a: "In the mobile app: Profile → Emergency Contacts → Add/Edit. You can add up to 5 contacts. We recommend: Primary: Family member, Secondary: Neighbor/friend, Tertiary: Doctor. Test alerts by using the 'Send Test Alert' button."
            },
            {
                q: "Can I use Arohan internationally?",
                a: "Currently, Arohan works best in India with our local emergency integration (112). International use is possible for health tracking, but emergency dispatch may not be automated. We're expanding to USA, UAE, and Singapore in 2026."
            },
            {
                q: "What's your return/warranty policy?",
                a: "30-day money-back guarantee if unsatisfied (device must be in original condition). 1-year manufacturer warranty covers defects. Extended warranty available. Accidental damage not covered (but we offer repair at cost)."
            }
        ]
    },
    {
        category: "Privacy & Compliance",
        icon: "🔒",
        questions: [
            {
                q: "Is Arohan HIPAA compliant?",
                a: "Yes, our platform is HIPAA-compliant for healthcare partners. We have executed Business Associate Agreements (BAAs) with hospitals and clinics. All PHI (Protected Health Information) is encrypted, access-controlled, and audit-logged."
            },
            {
                q: "Who can access my health data?",
                a: "Only you and people you explicitly authorize (emergency contacts, caregivers, doctors). Arohan staff cannot access your data without your written consent, except for aggregated, anonymized analytics to improve our AI models."
            },
            {
                q: "Do you sell my data to third parties?",
                a: "Absolutely not. We will never sell, rent, or share your personal health data with advertisers, insurance companies, or any third party without your explicit, informed consent. Our revenue comes from device sales and subscriptions, not data."
            },
            {
                q: "How can I delete my account and data?",
                a: "Settings → Privacy → Delete Account. This will: (1) Permanently erase all your health data within 30 days, (2) Disable device remotely, (3) Notify emergency contacts of discontinuation, (4) Send data export (if requested) before deletion."
            }
        ]
    }
];

export function FAQ() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

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
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 10, px: 2 }}>
            <Container>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'error.50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <HelpCircleIcon sx={{ fontSize: 32, color: 'error.main' }} />
                    </Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>Frequently Asked Questions</Typography>
                    <Typography variant="h6" color="text.secondary">Everything you need to know about Arohan</Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search for questions..."
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
                        <Typography variant="body1" color="text.secondary" gutterBottom>No questions found matching "{searchTerm}"</Typography>
                        <Button onClick={() => setSearchTerm('')} color="error">Clear search</Button>
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
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Still have questions?</Typography>
                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>Can't find the answer you're looking for? Our support team is here to help.</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" sx={{ bgcolor: 'common.white', color: 'error.main', '&:hover': { bgcolor: 'grey.100' } }} href="/contact">
                            Contact Support
                        </Button>
                        <Button variant="outlined" sx={{ color: 'common.white', borderColor: 'common.white', '&:hover': { borderColor: 'grey.200', bgcolor: 'rgba(255,255,255,0.1)' } }} href="mailto:support@arohanhealth.com">
                            Email Us
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

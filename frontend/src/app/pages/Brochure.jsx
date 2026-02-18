import { Heart, Activity, Phone, ShieldCheck, Battery, Zap, MapPin, CheckCircle, Smartphone } from 'lucide-react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, Stack, Chip, Divider, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
// import seniorImage from '../../assets/images/ideal-lifestyle.jpg'; // Removed broken import
// import productImage from '../../assets/images/hero-ring.jpg'; // Reusing hero ring image

export function Brochure() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'grey.50', fontFamily: 'sans-serif', color: 'text.primary' }}>
            {/* PANEL 1: Front Cover (Hero) */}
            <Box component="section" sx={{
                position: 'relative',
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.900',
                color: 'common.white',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
                    <ImageWithFallback
                        src="../../assets/images/ideal-lifestyle.jpg"
                        alt="Happy Senior Couple"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a, rgba(15,23,42,0.5), transparent)' }} />
                </Box>

                <Container sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        border: 1,
                        borderColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 50,
                        typography: 'body2',
                        fontWeight: 'light',
                        mb: 4,
                        letterSpacing: 1,
                        textTransform: 'uppercase'
                    }}>
                        Arohan by Hasprana Health Care Solutions
                    </Box>
                    <Typography variant="h1" fontWeight="bold" sx={{ mb: 3, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1 }}>
                        Peace of Mind. <br />
                        <Box component="span" sx={{ color: 'secondary.main' }}>Right on Your Finger.</Box>
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'grey.300', maxWidth: 600, mx: 'auto', mb: 6, fontWeight: 'light' }}>
                        India's First AI-Powered Emergency Detection Wearable for Seniors.
                    </Typography>

                    <Stack direction="row" justifyContent="center" spacing={{ xs: 2, md: 8 }} textAlign="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', p: 1.5, borderRadius: '50%' }}>
                                <Heart size={24} color="#f87171" style={{ display: 'block' }} />
                            </Box>
                            <Typography variant="body2" fontWeight="medium">Cardiac Monitoring</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ bgcolor: 'rgba(249, 115, 22, 0.2)', p: 1.5, borderRadius: '50%' }}>
                                <Activity size={24} color="#fb923c" style={{ display: 'block' }} />
                            </Box>
                            <Typography variant="body2" fontWeight="medium">Fall Detection</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', p: 1.5, borderRadius: '50%' }}>
                                <Phone size={24} color="#4ade80" style={{ display: 'block' }} />
                            </Box>
                            <Typography variant="body2" fontWeight="medium">Instant SOS</Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ mt: 6, animation: 'bounce 1s infinite' }}>
                        <Typography variant="caption" color="grey.400">Scroll to Read Brochure</Typography>
                    </Box>
                </Container>
            </Box>

            {/* PANEL 2: The Problem (Urgency) */}
            <Box component="section" sx={{ py: 12, bgcolor: 'common.white' }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                        Seconds Matter When You Are Alone.
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6, lineHeight: 1.6 }}>
                        Did you know that <Box component="strong" color="error.main">40% of cardiac deaths</Box> and severe injuries from falls occur simply because help didn't arrive in time?
                        <br /><br />
                        For elderly individuals living alone, or those whose children live overseas, a sudden fall or a silent heart irregularity can be life-threatening if undetected.
                    </Typography>

                    <Grid container spacing={4} sx={{ my: 8 }}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: 'error.50', border: 1, borderColor: 'error.100', borderRadius: 4 }}>
                                <Typography variant="h6" fontStyle="italic" color="error.dark">
                                    "What if I fall in the bathroom and can't reach the phone?"
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: 'error.50', border: 1, borderColor: 'error.100', borderRadius: 4 }}>
                                <Typography variant="h6" fontStyle="italic" color="error.dark">
                                    "What if my parents face a medical emergency while I am miles away?"
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Box sx={{
                        display: 'inline-block',
                        bgcolor: 'grey.900',
                        color: 'common.white',
                        px: 4,
                        py: 2,
                        borderRadius: 50,
                        fontWeight: 'bold',
                        boxShadow: 4
                    }}>
                        The Answer: You need a guardian that never sleeps. You need Arohan.
                    </Box>
                </Container>
            </Box>

            {/* PANEL 3: The Solution (Features) */}
            <Box component="section" sx={{ py: 12, bgcolor: 'grey.100' }}>
                <Container>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                position: 'relative',
                                pt: '100%',
                                bgcolor: 'common.white',
                                borderRadius: '3rem',
                                boxShadow: 6,
                                overflow: 'hidden',
                                border: 4,
                                borderColor: 'common.white'
                            }}>
                                <ImageWithFallback
                                    src="../../assets/images/hero-ring.jpg"
                                    alt="Arohan Ring Device"
                                    sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '33%', background: 'linear-gradient(to top, rgba(15,23,42,0.4), transparent)' }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight="bold" color="text.primary">
                                Smart Technology.
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom sx={{ mb: 5 }}>
                                Simple Protection.
                            </Typography>

                            <Stack spacing={4}>
                                {[
                                    { icon: <Activity />, title: "Automatic Fall Detection", desc: "No buttons to press. Our advanced AI detects sudden falls and impacts instantly." },
                                    { icon: <Heart />, title: "Cardiac Anomaly Alerts", desc: "Monitors heart rhythm 24/7. Detects irregularities before they become critical emergencies." },
                                    { icon: <Zap />, title: "One-Touch SOS", desc: "Feeling unwell? Press and hold for 3 seconds to manually summon help." },
                                    { icon: <Battery />, title: "Long Battery Life", desc: "Designed to work for days on a single charge. Water-resistant and durable." }
                                ].map((feature, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ bgcolor: 'common.white', p: 1.5, borderRadius: 3, boxShadow: 1, height: 'fit-content', color: 'primary.main' }}>
                                            {feature.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* PANEL 4: The Connection (App) */}
            <Box component="section" sx={{ py: 12, bgcolor: 'grey.900', color: 'common.white' }}>
                <Container>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Stay Connected, No Matter the Distance.
                            </Typography>
                            <Typography variant="h6" color="grey.300" paragraph sx={{ mb: 4 }}>
                                The Arohan Companion App keeps you in the loop, whether you are in the next room or another country.
                            </Typography>

                            <Stack spacing={3} sx={{ mb: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Smartphone color="#ef4444" />
                                    <Typography><strong>Real-Time Vitals:</strong> Check heart rate and activity levels anytime.</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Phone color="#ef4444" />
                                    <Typography><strong>Instant Notifications:</strong> Get woken up immediately via SMS/Call if an emergency strikes.</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <MapPin color="#ef4444" />
                                    <Typography><strong>GPS Location:</strong> Know exactly where your loved one is during an emergency.</Typography>
                                </Box>
                            </Stack>

                            <Paper sx={{ p: 3, bgcolor: 'grey.800', borderLeft: 4, borderColor: 'secondary.main', color: 'grey.300' }}>
                                <Typography fontStyle="italic" gutterBottom>
                                    "Living in Dubai, I worried constantly about my mother in Bengaluru. Arohan gives me sleep. I know I'll be the first to know if she needs me."
                                </Typography>
                                <Typography variant="caption" fontWeight="bold" color="grey.500">— Rohan K., Loving Son</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} display="flex" justifyContent="center">
                            {/* Visual representation of Distance/App */}
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 256, height: 256, bgcolor: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', filter: 'blur(40px)' }} />
                                <Box sx={{
                                    position: 'relative',
                                    zIndex: 10,
                                    bgcolor: 'grey.800',
                                    p: 4,
                                    borderRadius: 4,
                                    border: 1,
                                    borderColor: 'grey.700',
                                    boxShadow: 24,
                                    maxWidth: 320
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, borderBottom: 1, borderColor: 'grey.700' }}>
                                        <Box sx={{ width: 48, height: 48, bgcolor: 'grey.200', borderRadius: '50%' }} />
                                        <Box>
                                            <Typography fontWeight="bold">Mom (Home)</Typography>
                                            <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', display: 'inline-block' }} /> Safe
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Stack spacing={2}>
                                        <Box sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="grey.300">Heart Rate</Typography>
                                            <Typography variant="h6" fontFamily="monospace" fontWeight="bold">72 BPM</Typography>
                                        </Box>
                                        <Box sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="grey.300">Battery</Typography>
                                            <Typography variant="h6" fontFamily="monospace" fontWeight="bold" color="success.main">84%</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* PANEL 5: Tech / Trust */}
            <Box component="section" sx={{ py: 12, bgcolor: 'common.white', borderBottom: 1, borderColor: 'divider' }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={2} gutterBottom>
                        Precision Technology
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                        Powered by Precision AI
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 8 }}>
                        Arohan isn't just a tracker; it's a medical-grade assistant.
                    </Typography>

                    <Grid container spacing={4}>
                        {[
                            { val: "98%", label: "Accuracy in Fall Detection" },
                            { val: "HIPAA", label: "Compliant Data Security" },
                            { val: "24/7", label: "Monitoring Logic" }
                        ].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Paper elevation={0} sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 4 }}>
                                    <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>{item.val}</Typography>
                                    <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">{item.label}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={3} sx={{ mt: 8 }}>
                        {["Made in India", "Secure Data", "Doctor Recommended"].map((tag, idx) => (
                            <Chip
                                key={idx}
                                icon={<CheckCircle size={16} />}
                                label={tag}
                                variant="outlined"
                                sx={{ px: 1, py: 2, borderRadius: 50, fontWeight: 'bold', color: 'text.secondary' }}
                            />
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* PANEL 6: Back Cover (CTA) */}
            <Box component="section" sx={{ py: 12, bgcolor: 'success.50' }}>{/* Using Success/Blue tint as per original blue-50, sticking to theme */}
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom sx={{ mb: 6 }}>
                        Don't Wait for an Emergency. <br />
                        Protect Your Loved Ones Today.
                    </Typography>

                    <Paper elevation={4} sx={{ maxWidth: 500, mx: 'auto', borderRadius: 4, overflow: 'hidden', border: 1, borderColor: 'primary.100' }}>
                        <Box sx={{ bgcolor: 'primary.main', color: 'common.white', py: 2, fontWeight: 'bold', fontSize: '1.125rem' }}>
                            Launch Offer
                        </Box>
                        <Box sx={{ p: 4 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h3" fontWeight="bold" color="text.primary">Device</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>(One-time cost)</Typography>
                            </Box>
                            <Box sx={{ color: 'text.secondary', mb: 4, pb: 4, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                + <Box component="strong" color="primary.main">Subscription</Box> App <br />
                                <Chip label="First Month Free" size="small" color="success" sx={{ mt: 1, bgcolor: 'success.50', color: 'success.dark', fontWeight: 'bold' }} />
                            </Box>

                            <Stack spacing={1} sx={{ textAlign: 'left', fontSize: '0.875rem', color: 'text.secondary', mb: 4, maxWidth: 280, mx: 'auto' }}>
                                <Typography variant="body2">🌐 Visit: <strong>www.arohanhealth.com</strong></Typography>
                                <Typography variant="body2">📧 Email: <strong>info@haspranahealth.com</strong></Typography>
                                <Typography variant="body2">📞 Call: <strong>+91 70190 24300</strong></Typography>
                                <Typography variant="body2">📍 Office: <strong>Hasprana Health Care Solutions, Bengaluru</strong></Typography>
                            </Stack>

                            <Button component={Link} to="/contact" variant="contained" size="large" fullWidth sx={{ mb: 2 }}>
                                Order Now
                            </Button>

                            <Button variant="outlined" fullWidth onClick={() => window.print()}>
                                Print Brochure (PDF)
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}

export default Brochure;

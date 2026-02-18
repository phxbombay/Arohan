import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Email as MailIcon,
    Phone as PhoneIcon,
    LocationOn as MapPinIcon,
    Send as SendIcon
} from '@mui/icons-material';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Stack,
    Paper
} from '@mui/material';
import axios from 'axios';

import { toast } from 'sonner';
import smartRingImage from '../../assets/smart_ring.png';

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export function Contact() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/v1';
            await axios.post(`${API_URL}/contact`, data);
            toast.success("Message sent successfully! We will get back to you soon.");
            reset();
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.");
        }
    };

    return (
        <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 10, textAlign: 'center' }}>
                <Container>
                    <Typography variant="h3" fontWeight="bold" gutterBottom align="center">Get in Touch</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }} align="center">We're here to answer any questions you may have.</Typography>
                </Container>
            </Box>

            <Box sx={{ py: 10, bgcolor: 'grey.50', flexGrow: 1 }}>
                <Container>
                    <Grid container spacing={8}>
                        {/* Row 1: Image - Centered */}
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                            <Box
                                component="img"
                                src={smartRingImage}
                                alt="Arohan Smart Ring"
                                sx={{
                                    width: '100%',
                                    maxWidth: 450,
                                    height: 'auto',
                                    borderRadius: 4,
                                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            />
                        </Grid>

                        {/* Row 2: Contact Info - Centered */}
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, textAlign: 'center', width: '100%' }}>Contact Information</Typography>
                            <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
                                <Card>
                                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}>
                                        <MapPinIcon color="primary" fontSize="large" />
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="h6" fontWeight="bold">Head Office</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hasprana Health Care Solutions Pvt Ltd<br />
                                                Bengaluru, Karnataka<br />
                                                India
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 } }}>
                                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}>
                                        <MailIcon color="primary" fontSize="large" />
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="h6" fontWeight="bold">Email</Typography>
                                            <a href="mailto:info@haspranahealth.com" style={{ textDecoration: 'none', color: '#d32f2f', fontWeight: 500 }}>
                                                info@haspranahealth.com
                                            </a>
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}>
                                        <PhoneIcon color="primary" fontSize="large" />
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="h6" fontWeight="bold">Phone Support</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                This feature will be enabled soon.
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>



                        {/* Row 2: Contact Form */}
                        <Grid item xs={12}>
                            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                                <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>Send us a Message</Typography>
                                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                {...register("name")}
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                type="email"
                                                {...register("email")}
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                type="tel"
                                                {...register("phone")}
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                multiline
                                                rows={4}
                                                {...register("message")}
                                                error={!!errors.message}
                                                helperText={errors.message?.message}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    endIcon={<SendIcon />}
                                                    sx={{
                                                        py: 1.5,
                                                        px: 6,
                                                        fontSize: '1.1rem',
                                                        borderRadius: 8,
                                                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                                        transition: 'all 0.3s',
                                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)' },
                                                        minWidth: '200px'
                                                    }}
                                                >
                                                    {isSubmitting ? "Sending..." : "Send Message"}
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

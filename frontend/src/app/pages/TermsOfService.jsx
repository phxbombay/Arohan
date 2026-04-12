import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import SEO from '../components/SEO';

export function TermsOfService() {
    return (
        <Box sx={{ py: 12, bgcolor: 'grey.50', minHeight: '100dvh' }}>
            <SEO
                title="Terms of Service"
                description="Read Arohan Health's Terms of Service. By using the Arohan platform (device and app) you agree to these terms governing data use, liability, subscriptions, and emergency response."
                keywords="Arohan Health terms of service, wearable health device terms, user agreement Arohan"
                canonical="https://arohanhealth.com/terms"
            />
            <Container maxWidth="md">
                <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 3 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Terms of Service
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Last Updated: January 26, 2026
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" fontWeight="bold" gutterBottom>1. Acceptance of Terms</Typography>
                    <Typography paragraph>
                        By accessing or using the Arohan platform (device and app), operated by Arohan Health, you agree to be bound by these Terms of Service.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>2. Medical Disclaimer</Typography>
                    <Typography paragraph sx={{ bgcolor: 'error.50', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'error.main', color: 'error.dark' }}>
                        <strong>Arohan is an emergency response aid, NOT a substitute for professional medical advice, diagnosis, or treatment.</strong> While our AI aims to detect anomalies, it may not detect all medical emergencies. In life-threatening situations, always call emergency services immediately if possible.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>3. User Responsibilities</Typography>
                    <Typography paragraph>
                        You relate that you will:<br />
                        • Keep the Arohan device charged and properly worn.<br />
                        • Provide accurate emergency contact information.<br />
                        • Use the service only for lawful purposes.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>4. Limitation of Liability</Typography>
                    <Typography paragraph>
                        Arohan Health shall not be liable for any indirect, incidental, or consequential damages arising from the failure of the device to detect an emergency due to connectivity issues, battery failure, or improper usage.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>5. Termination</Typography>
                    <Typography paragraph>
                        We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

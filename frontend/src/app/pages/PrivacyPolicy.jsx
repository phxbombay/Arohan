import { Box, Container, Typography, Paper, Divider } from '@mui/material';

export function PrivacyPolicy() {
    return (
        <Box sx={{ py: 12, bgcolor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 3 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Privacy Policy
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Last Updated: January 26, 2026
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" fontWeight="bold" gutterBottom>1. Introduction</Typography>
                    <Typography paragraph>
                        Hasprana Health Care Solutions Pvt Ltd ("Arohan", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Arohan devices and mobile application.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>2. Information We Collect</Typography>
                    <Typography paragraph>
                        <strong>Personal Information:</strong> Name, age, emergency contact details, and medical history you voluntarily provide.<br />
                        <strong>Health Data:</strong> Vital signs (heart rate, SpO2) collected securely via the Arohan plugin chip.<br />
                        <strong>Device Data:</strong> Location data (GPS) ensuring accurate emergency response dispatch.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>3. How We Use Your Data</Typography>
                    <Typography paragraph>
                        We use your data solely for:<br />
                        • Real-time health monitoring and anomaly detection.<br />
                        • Triggering emergency alerts to your designated contacts and hospitals.<br />
                        • Improving our AI algorithms (anonymized data only).
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>4. Data Security</Typography>
                    <Typography paragraph>
                        We implement industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Your health data is stored in HIPAA and GDPR compliant servers.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>5. Your Rights</Typography>
                    <Typography paragraph>
                        You have the right to access, correct, or delete your personal data at any time through the Arohan app settings or by contacting our Data Protection Officer.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>6. Contact Us</Typography>
                    <Typography paragraph>
                        or any privacy-related questions, please contact us at <a href="mailto:privacy@haspranahealth.com" style={{ color: '#dc2626' }}>privacy@haspranahealth.com</a>.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

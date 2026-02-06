import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Tab,
    Tabs,
    Stack,
    Chip,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Payment as PaymentIcon,
    Devices as DevicesIcon,
    Code as CodeIcon,
    Security as SecurityIcon,
    CheckCircle as CheckIcon,
    Api as ApiIcon,
    CloudUpload as CloudIcon,
    Description as DocsIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';


export function Integrations() {
    const [activeTab, setActiveTab] = useState(0);

    const paymentGateways = [
        {
            name: 'Razorpay',
            logo: '💳',
            description: 'Primary payment gateway for India',
            features: [
                'UPI, Cards, Net Banking, Wallets',
                'Subscription & recurring billing',
                'Automatic payment retries',
                'Instant refunds',
                'Dashboard analytics'
            ],
            status: 'Active',
            integration: 'REST API',
            docs: 'https://razorpay.com/docs/'
        },
        {
            name: 'Stripe',
            logo: '🌐',
            description: 'International payment processing',
            features: [
                'Global payment methods',
                'Subscription management',
                'Invoice generation',
                'Fraud detection',
                'Multi-currency support'
            ],
            status: 'Active',
            integration: 'REST API',
            docs: 'https://stripe.com/docs'
        },
        {
            name: 'PayPal',
            logo: '💰',
            description: 'Alternative payment option',
            features: [
                'PayPal balance payments',
                'Credit/Debit cards',
                'Buyer protection',
                'Express checkout',
                'Mobile SDK'
            ],
            status: 'Coming Soon',
            integration: 'SDK',
            docs: 'https://developer.paypal.com/'
        }
    ];

    const deviceIntegrations = [
        {
            name: 'Wearable Plugins',
            icon: '⌚',
            description: 'Bluetooth/BLE enabled health monitoring devices',
            protocols: ['Bluetooth 5.0', 'BLE', 'ANT+'],
            dataTypes: ['Heart Rate', 'SpO2', 'Temperature', 'Activity'],
            sdkAvailable: true
        },
        {
            name: 'Smart Watches',
            icon: '📱',
            description: 'Apple Watch, Wear OS, Samsung Galaxy Watch',
            protocols: ['HealthKit', 'Google Fit', 'Samsung Health'],
            dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'ECG'],
            sdkAvailable: true
        },
        {
            name: 'Medical Devices',
            icon: '🏥',
            description: 'FDA/CE approved medical monitoring devices',
            protocols: ['HL7 FHIR', 'DICOM', 'IEEE 11073'],
            dataTypes: ['BP', 'Glucose', 'Weight', 'ECG'],
            sdkAvailable: false
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
            <Helmet>
                <title>Integrations - Payment Gateway & Device Integration | Arohan Health</title>
                <meta name="description" content="Integrate with Arohan Health platform. Payment gateways (Razorpay, Stripe), device integrations, and API documentation for partners and developers." />
            </Helmet>

            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Integrations & API
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Connect your systems with Arohan Health. Payment processing, device integration, and developer APIs.
                    </Typography>
                </Box>

                {/* Tabs */}
                <Paper sx={{ mb: 4 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered>
                        <Tab icon={<PaymentIcon />} label="Payment Gateways" />
                        <Tab icon={<DevicesIcon />} label="Device Integration" />
                        <Tab icon={<ApiIcon />} label="API Documentation" />
                    </Tabs>
                </Paper>

                {/* Tab 1: Payment Gateways */}
                {activeTab === 0 && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 4 }}>
                            <Typography variant="body2">
                                <strong>Secure Payment Processing:</strong> All transactions are encrypted with TLS 1.3 and comply with PCI DSS standards.
                            </Typography>
                        </Alert>

                        <Grid container spacing={3}>
                            {paymentGateways.map((gateway, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card sx={{ height: '100%', position: 'relative' }}>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="h1" sx={{ fontSize: 48 }}>
                                                        {gateway.logo}
                                                    </Typography>
                                                    <Chip
                                                        label={gateway.status}
                                                        color={gateway.status === 'Active' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {gateway.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {gateway.description}
                                                    </Typography>
                                                </Box>

                                                <Divider />

                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        Features:
                                                    </Typography>
                                                    <List dense>
                                                        {gateway.features.map((feature, i) => (
                                                            <ListItem key={i} sx={{ py: 0.5 }}>
                                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                                    <CheckIcon color="success" fontSize="small" />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={feature}
                                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>

                                                <Stack direction="row" spacing={1}>
                                                    <Chip label={gateway.integration} size="small" variant="outlined" />
                                                </Stack>

                                                <Button
                                                    variant="outlined"
                                                    href={gateway.docs}
                                                    target="_blank"
                                                    startIcon={<DocsIcon />}
                                                    fullWidth
                                                >
                                                    Documentation
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Integration Flow */}
                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Payment Integration Flow
                            </Typography>
                            <Paper sx={{ p: 3, mt: 2 }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label="1" color="primary" />
                                        <Typography>User initiates subscription/payment</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label="2" color="primary" />
                                        <Typography>Arohan platform creates payment order</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label="3" color="primary" />
                                        <Typography>Payment gateway processes transaction</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label="4" color="primary" />
                                        <Typography>Webhook notification sent to Arohan</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label="5" color="primary" />
                                        <Typography>Subscription status updated</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </Box>
                )}

                {/* Tab 2: Device Integration */}
                {activeTab === 1 && (
                    <Box>
                        <Alert severity="info" sx={{ mb: 4 }}>
                            <Typography variant="body2">
                                <strong>End-to-End Encryption:</strong> All device data is encrypted in transit and at rest using AES-256-GCM.
                            </Typography>
                        </Alert>

                        <Grid container spacing={3}>
                            {deviceIntegrations.map((device, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Typography variant="h1" sx={{ fontSize: 48, textAlign: 'center' }}>
                                                    {device.icon}
                                                </Typography>

                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold" textAlign="center">
                                                        {device.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                                        {device.description}
                                                    </Typography>
                                                </Box>

                                                <Divider />

                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        Protocols:
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {device.protocols.map((protocol, i) => (
                                                            <Chip key={i} label={protocol} size="small" />
                                                        ))}
                                                    </Stack>
                                                </Box>

                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        Data Types:
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {device.dataTypes.map((type, i) => (
                                                            <Chip key={i} label={type} size="small" variant="outlined" />
                                                        ))}
                                                    </Stack>
                                                </Box>

                                                {device.sdkAvailable && (
                                                    <Chip
                                                        label="SDK Available"
                                                        color="success"
                                                        icon={<CodeIcon />}
                                                    />
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* SDK Features */}
                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Arohan Device SDK Features
                            </Typography>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Stack spacing={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Security
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="End-to-end encryption (AES-256)" />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="Device authentication & pairing" />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="Secure key exchange" />
                                                </ListItem>
                                            </List>
                                        </Stack>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Stack spacing={2}>
                                            <Typography variant="h6" fontWeight="bold">
                                                <CloudIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Data Management
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="Real-time data synchronization" />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="Offline data buffering" />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                                    <ListItemText primary="Automatic conflict resolution" />
                                                </ListItem>
                                            </List>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                )}

                {/* Tab 3: API Documentation */}
                {activeTab === 2 && (
                    <Box>
                        <Alert severity="warning" sx={{ mb: 4 }}>
                            <Typography variant="body2">
                                <strong>API Access:</strong> Contact our team at <strong>api@arohanhealth.com</strong> to request API credentials.
                            </Typography>
                        </Alert>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Authentication
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <Typography variant="body2">
                                                All API requests require Bearer token authentication.
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace' }}>
                                                <pre style={{ margin: 0, overflow: 'auto' }}>
                                                    {`POST /api/auth/login
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "your_password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}`}
                                                </pre>
                                            </Paper>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Submit Vitals Data
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <Typography variant="body2">
                                                Submit vital signs data from wearable devices.
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace' }}>
                                                <pre style={{ margin: 0, overflow: 'auto' }}>
                                                    {`POST /api/integrations/vitals
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json

{
  "deviceId": "device_12345",
  "userId": "user_67890",
  "timestamp": "2026-02-06T12:00:00Z",
  "vitals": {
    "heartRate": 72,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "oxygenSaturation": 98,
    "temperature": 36.6
  }
}`}
                                                </pre>
                                            </Paper>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Retrieve Alerts
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <Typography variant="body2">
                                                Get health alerts for integrated devices.
                                            </Typography>
                                            <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'white', fontFamily: 'monospace' }}>
                                                <pre style={{ margin: 0, overflow: 'auto' }}>
                                                    {`GET /api/integrations/alerts?userId=user_67890
Authorization: Bearer YOUR_API_TOKEN

Response:
{
  "alerts": [
    {
      "alertId": "alert_123",
      "type": "high_heart_rate",
      "severity": "medium",
      "timestamp": "2026-02-06T11:45:00Z",
      "value": 145,
      "threshold": 120
    }
  ]
}`}
                                                </pre>
                                            </Paper>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Webhooks
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={2}>
                                            <Typography variant="body2">
                                                Configure webhooks to receive real-time notifications for critical events.
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Supported Events:
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="alert.created"
                                                        secondary="New health alert generated"
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="vitals.received"
                                                        secondary="New vitals data received"
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="device.connected"
                                                        secondary="Device connected/disconnected"
                                                    />
                                                </ListItem>
                                            </List>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>

                        {/* Rate Limits */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Rate Limits
                            </Typography>
                            <Paper sx={{ p: 3, mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Standard API:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            100 requests per 15 minutes
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Vitals Upload:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            1000 requests per hour
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Box>
                )}

                {/* Contact Section */}
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Paper sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Need Integration Support?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Our integration team is here to help you get started.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" color="secondary" href="mailto:api@arohanhealth.com">
                                Contact API Team
                            </Button>
                            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} href="/partners">
                                Partner with Us
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}

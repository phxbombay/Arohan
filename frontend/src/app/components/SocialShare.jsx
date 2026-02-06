import { useState } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Share as ShareIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    WhatsApp as WhatsAppIcon,
    Email as EmailIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';

export function SocialShare({
    url = window.location.href,
    title = 'Arohan Health - AI-Powered Health Monitoring',
    description = 'Transform health monitoring with AI-powered wearable technology',
    hashtags = ['ArohanHealth', 'HealthTech', 'AIHealth'],
    compact = false
}) {
    const [showCopyAlert, setShowCopyAlert] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    const hashtagString = hashtags.join(',');

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
    };

    const handleShare = (platform) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setShowCopyAlert(true);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
    };

    const socialButtons = [
        {
            name: 'Facebook',
            icon: <FacebookIcon />,
            color: '#1877F2',
            onClick: () => handleShare('facebook')
        },
        {
            name: 'Twitter',
            icon: <TwitterIcon />,
            color: '#1DA1F2',
            onClick: () => handleShare('twitter')
        },
        {
            name: 'LinkedIn',
            icon: <LinkedInIcon />,
            color: '#0A66C2',
            onClick: () => handleShare('linkedin')
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon />,
            color: '#25D366',
            onClick: () => handleShare('whatsapp')
        },
        {
            name: 'Email',
            icon: <EmailIcon />,
            color: '#EA4335',
            onClick: () => handleShare('email')
        },
        {
            name: 'Copy Link',
            icon: <CopyIcon />,
            color: '#666',
            onClick: handleCopyLink
        }
    ];

    if (compact) {
        return (
            <>
                <Stack direction="row" spacing={1}>
                    {navigator.share && (
                        <Tooltip title="Share">
                            <IconButton
                                size="small"
                                onClick={handleNativeShare}
                                sx={{ color: 'text.secondary' }}
                            >
                                <ShareIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {socialButtons.slice(0, 4).map((button) => (
                        <Tooltip key={button.name} title={button.name}>
                            <IconButton
                                size="small"
                                onClick={button.onClick}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: button.color }
                                }}
                            >
                                {button.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Stack>
                <Snackbar
                    open={showCopyAlert}
                    autoHideDuration={2000}
                    onClose={() => setShowCopyAlert(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" variant="filled">
                        Link copied to clipboard!
                    </Alert>
                </Snackbar>
            </>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Share this page
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {navigator.share && (
                    <Tooltip title="Share via...">
                        <IconButton
                            onClick={handleNativeShare}
                            sx={{
                                bgcolor: 'grey.100',
                                '&:hover': { bgcolor: 'grey.200' }
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {socialButtons.map((button) => (
                    <Tooltip key={button.name} title={button.name}>
                        <IconButton
                            onClick={button.onClick}
                            sx={{
                                bgcolor: 'grey.100',
                                color: button.color,
                                '&:hover': {
                                    bgcolor: button.color,
                                    color: 'white'
                                }
                            }}
                        >
                            {button.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Stack>
            <Snackbar
                open={showCopyAlert}
                autoHideDuration={2000}
                onClose={() => setShowCopyAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
}

import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 2
            }}
        >
            <CircularProgress size={48} thickness={4} />
            <Typography variant="body1" color="text.secondary">
                Loading...
            </Typography>
        </Box>
    );
}

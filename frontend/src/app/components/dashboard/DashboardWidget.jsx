import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    LinearProgress
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

export function DashboardWidget({ title, children, action = null, headerIcon = null, loading = false, sx = {} }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {headerIcon}
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    {action || (
                        <IconButton size="small">
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress />
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1 }}>
                        {children}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

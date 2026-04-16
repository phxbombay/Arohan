import { Phone as PhoneIcon } from "@mui/icons-material";
import { Box, Fab, Typography, keyframes } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { EmergencyAlertDialog } from "./emergency/EmergencyAlertDialog";

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

export function SOSButton() {
    const [isPressed, setIsPressed] = useState(false);
    const { socket } = useSocket();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!socket) return;

        const handleAlertUpdate = (data: any) => {
            if (data.status === 'dispatched') {
                toast.success('Ambulance dispatched! ETA: ' + (data.eta || 'unknown'));
            }
        };

        socket.on('alert:update', handleAlertUpdate);

        return () => {
            socket.off('alert:update', handleAlertUpdate);
        };
    }, [socket]);

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 'calc(16px + env(safe-area-inset-bottom, 0px))', md: 32 },
                    right: { xs: 16, md: 32 },
                    zIndex: 1200
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            bgcolor: 'error.main',
                            animation: `${ripple} 1.5s infinite ease-in-out`,
                            zIndex: -1
                        }}
                    />
                    <Fab
                        color="error"
                        aria-label="SOS"
                        data-testid="sos-button"
                        onClick={() => setIsPressed(true)}
                        sx={{ width: { xs: 56, md: 64 }, height: { xs: 56, md: 64 } }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                            <PhoneIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
                            <Typography variant="caption" sx={{ fontSize: { xs: 10, md: 12 }, fontWeight: 'bold' }}>
                                SOS
                            </Typography>
                        </Box>
                    </Fab>
                </Box>
            </Box>

            <EmergencyAlertDialog
                open={isPressed}
                onClose={() => setIsPressed(false)}
                isAuthenticated={isAuthenticated}
            />
        </>
    );
}

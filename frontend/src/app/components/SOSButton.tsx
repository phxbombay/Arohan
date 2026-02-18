import {
  Phone as PhoneIcon,
  LocalHospital as AmbulanceIcon
} from "@mui/icons-material";
import {
  Fab,
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  keyframes
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { toast } from 'sonner';

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

  useEffect(() => {
    if (!socket) return;

    const handleAlertUpdate = (data: any) => {
      console.log('Realtime Alert Update:', data);
      if (data.status === 'dispatched') {
        toast.success('Ambulance dispatched! ETA: ' + (data.eta || 'unknown'));
      }
    };

    socket.on('alert:update', handleAlertUpdate);

    return () => {
      socket.off('alert:update', handleAlertUpdate);
    };
  }, [socket]);

  const handleSOSClick = () => {
    setIsPressed(true);
  };

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}>
        <Box sx={{ position: 'relative' }}>
          {/* Ripple Effect Background */}
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
            onClick={handleSOSClick}
            sx={{ width: { xs: 56, md: 64 }, height: { xs: 56, md: 64 } }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
              <PhoneIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
              <Typography variant="caption" sx={{ fontSize: { xs: 10, md: 12 }, fontWeight: 'bold' }}>SOS</Typography>
            </Box>
          </Fab>
        </Box>
      </Box>

      <Dialog
        open={isPressed}
        onClose={() => setIsPressed(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
        <DialogContent sx={{ textAlign: 'center' }}>
          {/* Coming Soon Disclaimer */}
          <Box sx={{ bgcolor: 'info.50', p: 1.5, borderRadius: 2, mb: 3, border: 1, borderColor: 'info.main' }}>
            <Typography variant="body2" color="info.main" fontWeight="bold">
              This feature will be enabled soon.
            </Typography>
          </Box>

          <Box sx={{ width: 80, height: 80, bgcolor: 'error.50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <PhoneIcon sx={{ fontSize: 40, color: 'error.main' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Emergency Services Alerted
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Help is on the way. Your location has been shared with emergency services.
          </Typography>

          <Box sx={{ bgcolor: 'success.50', border: 1, borderColor: 'success.light', borderRadius: 2, p: 2, mb: 2, textAlign: 'left' }}>
            <Stack spacing={1}>
              <Typography variant="body2" color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ✓ Location shared (Bengaluru)
              </Typography>
              <Typography variant="body2" color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ✓ Nearest ambulance dispatched
              </Typography>
              <Typography variant="body2" color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ✓ Hospital notified
              </Typography>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Estimated arrival: <Box component="span" fontWeight="bold" color="text.primary">4 minutes</Box>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
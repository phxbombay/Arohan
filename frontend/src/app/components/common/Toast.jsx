import { Snackbar, Alert } from '@mui/material';

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000, position }) {

    // Convert position prop to anchorOrigin if needed, but for simplicity we'll use bottom-left or passed props
    // standard MUI Snackbar usage

    return (
        <Snackbar
            open={isVisible}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}

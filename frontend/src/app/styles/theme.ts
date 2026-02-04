import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#dc2626', // Tailwind red-600 - Updated for full width check
            light: '#ef4444', // red-500
            dark: '#b91c1c', // red-700
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#4b5563', // gray-600
        },
        background: {
            default: '#f9fafb', // gray-50
            paper: '#ffffff',
        },
        text: {
            primary: '#111827', // gray-900
            secondary: '#4b5563', // gray-600
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    width: '100%',
                    height: '100%',
                },
                body: {
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    overflowX: 'hidden', // Prevent horizontal scroll
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: false, // Force full width as per requirements
            },
            styleOverrides: {
                root: {
                    paddingLeft: '1.25rem', // 20px
                    paddingRight: '1.25rem',
                    '@media (min-width: 600px)': {
                        paddingLeft: '2rem', // 32px
                        paddingRight: '2rem',
                    },
                    '@media (min-width: 1200px)': {
                        paddingLeft: '2rem',
                        paddingRight: '2rem',
                    },
                    // Allow full width explicitly when needed
                    '&.MuiContainer-maxWidthFalse': {
                        maxWidth: '100%',
                    }
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
                fullWidth: true,
            }
        }
    },
});

export default theme;

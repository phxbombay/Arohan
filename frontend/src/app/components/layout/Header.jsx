import { useState } from 'react';
import { Link, useLocation as useRouteLocation } from 'react-router-dom';
import {
    Menu as MenuIcon,
    X as XIcon,
    ShoppingCart as CartIcon,
    MapPin as MapPinIcon,
    Search as SearchIcon,
    User as UserIcon
} from 'lucide-react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    InputBase,
    Badge,
    Typography,
    Stack,
    Popover,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useScrollTrigger,
    Paper,
    InputAdornment
} from '@mui/material';
import { AuthModal } from '../common/AuthModal';
import { CartDrawer } from '../common/CartDrawer';
import { LanguageSwitcher } from '../LanguageSwitcher';
// @ts-ignore
import { useAuth } from '../../../features/auth/hooks/useAuth';
// @ts-ignore
import { useCartStore } from '../../../context/cartStore';
// @ts-ignore
import { useLocation } from '../../../context/LocationContext';
import logo from '../../assets/logo_v4.jpg';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const routeLocation = useRouteLocation();
    // @ts-ignore
    const { address, loading: locationLoading, searchLocation } = useLocation();

    // @ts-ignore
    const { isAuthenticated, user, logout } = useAuth();
    // @ts-ignore
    const totalItems = useCartStore((state) => state.totalItems());

    const toggleMenu = (open) => () => setIsMenuOpen(open);

    const handleLocationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setAnchorEl(null);
    };

    const openLocation = Boolean(anchorEl);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Products', path: '/products' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Consulting', path: '/consulting' },
        { name: 'Integrations', path: '/integrations' },
        { name: 'Blog', path: '/blog' },
    ];

    return (
        <>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#ffffff' }}>
                <Toolbar sx={{ height: 64, justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Box component="img" src={logo} alt="Arohan" sx={{ height: 40, borderRadius: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary">Arohan</Typography>
                    </Link>

                    {/* Desktop Navigation */}
                    <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {navLinks.map((link) => {
                            const isActive = routeLocation.pathname === link.path;
                            return (
                                <Link key={link.name} to={link.path} style={{ textDecoration: 'none' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? 'primary.main' : 'text.secondary',
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                    >
                                        {link.name}
                                    </Typography>
                                </Link>
                            );
                        })}
                        {isAuthenticated && (
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                                    Dashboard
                                </Typography>
                            </Link>
                        )}
                    </Stack>

                    {/* Desktop Actions */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {/* Location Button */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleLocationClick}
                            startIcon={<MapPinIcon size={16} />}
                            sx={{ borderRadius: 10, textTransform: 'none', color: 'text.secondary', borderColor: 'grey.300' }}
                        >
                            {locationLoading ? "Locating..." : (address || "Select Location")}
                        </Button>

                        <Popover
                            open={openLocation}
                            anchorEl={anchorEl}
                            onClose={handleLocationClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <Box sx={{ p: 2, width: 300 }}>
                                <Typography variant="subtitle2" gutterBottom>Change Location</Typography>
                                <Typography variant="caption" color="text.secondary" paragraph>
                                    Enter your city to find nearby services.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <InputBase
                                        placeholder="e.g. Mumbai, Delhi"
                                        fullWidth
                                        sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, px: 1, fontSize: '0.875rem' }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchLocation(e.target.value);
                                                handleLocationClose();
                                            }
                                        }}
                                    />
                                    <Button size="small" variant="contained" sx={{ minWidth: 40, p: 0 }}>
                                        <SearchIcon size={16} />
                                    </Button>
                                </Box>
                            </Box>
                        </Popover>

                        {/* Cart */}
                        <Tooltip title="Shopping Cart">
                            <IconButton onClick={() => setIsCartOpen(true)} size="small" sx={{ color: 'text.secondary' }}>
                                <Badge badgeContent={totalItems} color="primary">
                                    <CartIcon size={20} />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" fontWeight={600}>{user?.full_name || 'User'}</Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        logout();
                                        useCartStore.getState().clearCart();
                                    }}
                                >
                                    Log Out
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1}>
                                <Button color="inherit" onClick={() => setIsAuthOpen(true)}>Log In</Button>
                                <Button variant="contained" onClick={() => setIsAuthOpen(true)}>Get Started</Button>
                            </Stack>
                        )}
                    </Stack>

                    {/* Mobile Menu Toggle */}
                    <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={toggleMenu(true)}>
                        <MenuIcon />
                    </IconButton>

                    {/* Mobile Drawer */}
                    <Drawer anchor="right" open={isMenuOpen} onClose={toggleMenu(false)}>
                        <Box sx={{ width: 250, p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Menu</Typography>
                                <IconButton onClick={toggleMenu(false)}>
                                    <XIcon />
                                </IconButton>
                            </Stack>
                            <List>
                                {navLinks.map((link) => (
                                    <ListItem key={link.name} component={Link} to={link.path} onClick={toggleMenu(false)}>
                                        <ListItemText primary={link.name} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<CartIcon size={16} />}
                                    onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}
                                    sx={{ mb: 2 }}
                                >
                                    Cart ({totalItems})
                                </Button>
                                {isAuthenticated ? (
                                    <Button fullWidth variant="contained" color="error" onClick={logout}>
                                        Logout ({user?.full_name})
                                    </Button>
                                ) : (
                                    <Button fullWidth variant="contained" onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }}>
                                        Login / Sign Up
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Drawer>
                </Toolbar>
            </AppBar>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}

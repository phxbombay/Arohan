import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
  Stack
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import logo from "../../assets/logo.png";
import { useAuth } from "../../features/auth/hooks/useAuth";
// @ts-ignore
import { useCartStore } from "../../context/cartStore";
// @ts-ignore
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { user, logout, isAuthenticated } = useAuth();
  // @ts-ignore
  const cartCount = useCartStore((state) => state.getCartCount());
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.products"), path: "/products" },
    { name: t("nav.pricing"), path: "/pricing" },
    { name: t("nav.nearbyHospitals"), path: "/nearby-hospitals" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.howItWorks"), path: "/how-it-works" },
    { name: t("nav.projectsOverview"), path: "/projects-overview" },
  ];

  const NavButton = ({ name, path }: { name: string, path: string }) => (
    <Button
      component={Link}
      to={path}
      color={isActive(path) ? "primary" : "inherit"}
      sx={{
        fontWeight: isActive(path) ? 700 : 500,
        textTransform: 'none',
        minWidth: 'auto',
        whiteSpace: 'nowrap',
        px: 2,
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          color: 'primary.main',
          bgcolor: 'primary.50'
        }
      }}
    >
      {name}
    </Button>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid', 
          borderColor: 'grey.100',
          pt: 'env(safe-area-inset-top, 0px)' 
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: 64, sm: 80 } }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ display: 'flex', alignItems: 'center', mr: 2, textDecoration: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
            >
              <img src={logo} alt="Arohan Logo" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
            </Box>

            {/* Desktop Navigation */}
            {isDesktop && (
              <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, justifyContent: 'center' }}>
                {navLinks.map((link) => (
                  <NavButton key={link.path} name={link.name} path={link.path} />
                ))}
                {isAuthenticated && (
                  <NavButton
                    name={
                      user?.role === 'admin' ? t("header.adminPanel") :
                        user?.role === 'doctor' ? t("header.physicianPanel") :
                            t("header.dashboard")
                    }
                    path="/dashboard"
                  />
                )}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageSwitcher />
              {/* Cart for Desktop */}
              {isDesktop && (
                <IconButton component={Link} to="/cart" sx={{ color: 'text.primary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}

              {/* Auth Buttons Desktop */}
              {isDesktop && (
                isAuthenticated ? (
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" component={Link} to="/dashboard" color="inherit" sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 600 }}>
                      {user?.role === 'admin' ? t("header.systemAdmin") : user?.full_name || t("header.dashboard")}
                    </Button>
                    <Button
                      onClick={() => {
                        logout();
                        useCartStore.getState().resetCart();
                      }}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                      {t("auth.logout")}
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    component={Link}
                    to="/signin"
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)'
                      }
                    }}
                  >
                    {t("auth.login")}
                  </Button>
                )
              )}

              {/* Emergency Button */}
              <Button
                variant="contained"
                color="error"
                href="tel:112"
                startIcon={<PhoneIcon />}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 8,
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(211, 47, 47, 0.4)',
                  '&:hover': {
                    bgcolor: 'error.dark',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.6)'
                  }
                }}
              >
                {t("header.emergency")}
              </Button>

              {/* Mobile Emergency Icon (visible on extra small screens) */}
              <IconButton
                color="error"
                href="tel:112"
                sx={{ display: { xs: 'flex', sm: 'none' }, border: 1, borderRadius: 1 }}
              >
                <PhoneIcon />
              </IconButton>

              {/* Mobile Menu Button */}
              {!isDesktop && (
                <IconButton onClick={() => setMobileMenuOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">{t("header.menu")}</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <Button
                  fullWidth
                  component={Link}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    justifyContent: 'flex-start',
                    color: isActive(link.path) ? 'primary.main' : 'text.primary',
                    bgcolor: isActive(link.path) ? 'action.hover' : 'transparent',
                    fontWeight: isActive(link.path) ? 700 : 400,
                    py: 1.5
                  }}
                >
                  {link.name}
                </Button>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <Button
                fullWidth
                component={Link}
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                sx={{ justifyContent: 'flex-start', color: 'text.primary', py: 1.5 }}
              >
                {user?.role === 'admin' ? t("header.adminPanel") :
                 user?.role === 'doctor' ? t("header.physicianPanel") :
                 t("header.dashboard")}
              </Button>
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem disablePadding>
              <Button
                fullWidth
                component={Link}
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                variant="outlined"
                startIcon={
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                }
                sx={{ justifyContent: 'flex-start', mb: 1, py: 1.5 }}
              >
                {t("cart.title") || "Cart"}
              </Button>
            </ListItem>
            <ListItem disablePadding>
              {isAuthenticated ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => {
                    logout();
                    useCartStore.getState().resetCart();
                    setMobileMenuOpen(false);
                  }}
                  sx={{ py: 1.5 }}
                >
                  {t("auth.logout")}
                </Button>
              ) : (
                <Button
                  fullWidth
                  component={Link}
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  variant="contained"
                  color="primary"
                  sx={{ py: 1.5 }}
                >
                  {t("auth.login")}
                </Button>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
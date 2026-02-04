import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SOSButton } from "./components/SOSButton";
import ScrollToTop from "./components/common/ScrollToTop";
import { Toaster } from 'sonner';
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleDashboard } from "./components/RoleDashboard";
import { initGA } from "../utils/analytics";



// Lazy Load Pages for Performance
// Handling Named Exports for React.lazy
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
// New architecture - using feature-based auth component
const SignInPage = lazy(() => import("../features/auth/components/SignInPage").then(module => ({ default: module.SignInPage })));
const Products = lazy(() => import("./pages/Products").then(module => ({ default: module.Products })));
const Blog = lazy(() => import("./pages/Blog").then(module => ({ default: module.Blog })));
const Elderly = lazy(() => import("./pages/segments/ElderlyEnhanced").then(module => ({ default: module.Elderly })));
const Doctors = lazy(() => import("./pages/segments/DoctorsEnhanced").then(module => ({ default: module.DoctorsEnhanced })));
const Corporate = lazy(() => import("./pages/segments/CorporateEnhanced").then(module => ({ default: module.CorporateEnhanced })));
const Brochure = lazy(() => import("./pages/Brochure").then(module => ({ default: module.Brochure })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then(module => ({ default: module.TermsOfService })));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const Pricing = lazy(() => import("./pages/Pricing").then(module => ({ default: module.Pricing })));
const Careers = lazy(() => import("./pages/Careers").then(module => ({ default: module.Careers })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));
const HowItWorks = lazy(() => import("./pages/HowItWorks").then(module => ({ default: module.HowItWorks })));
// New architecture - using feature-based dashboard component
const HealthDashboard = lazy(() => import("../features/dashboard/components/HealthDashboard").then(module => ({ default: module.HealthDashboard })));
const FAQ = lazy(() => import("./pages/FAQ").then(module => ({ default: module.FAQ })));
// Migrated to new architecture - using feature-based orders component
const ShoppingCart = lazy(() => import("../features/orders/components/ShoppingCart").then(module => ({ default: module.ShoppingCart })));
const Investors = lazy(() => import("./pages/Investors").then(module => ({ default: module.Investors })));
const Services = lazy(() => import("./pages/Services").then(module => ({ default: module.Services })));
const PartnerHospitals = lazy(() => import("./pages/PartnerHospitals").then(module => ({ default: module.PartnerHospitals })));
const NearbyHospitals = lazy(() => import("./pages/NearbyHospitals").then(module => ({ default: module.NearbyHospitals })));
const HelpCenter = lazy(() => import("./pages/HelpCenter").then(module => ({ default: module.HelpCenter })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const UsersPage = lazy(() => import("./pages/admin/UsersPage").then(module => ({ default: module.UsersPage })));
const MessagesPage = lazy(() => import("./pages/admin/MessagesPage").then(module => ({ default: module.MessagesPage })));
const LogsPage = lazy(() => import("./pages/admin/LogsPage").then(module => ({ default: module.LogsPage })));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage").then(module => ({ default: module.OrdersPage })));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));

const EarlyAccess = lazy(() => import("./pages/EarlyAccess"));
const Partners = lazy(() => import("./pages/Partners"));
const Impact = lazy(() => import("./pages/Impact").then(module => ({ default: module.Impact })));
// New Phase 1 pages
const ElderlyEnhanced = lazy(() => import("./pages/segments/ElderlyEnhanced").then(module => ({ default: module.Elderly })));
const DoctorsEnhanced = lazy(() => import("./pages/segments/DoctorsEnhanced").then(module => ({ default: module.DoctorsEnhanced })));
const CorporateEnhanced = lazy(() => import("./pages/segments/CorporateEnhanced").then(module => ({ default: module.CorporateEnhanced })));
const Team = lazy(() => import("./pages/Team").then(module => ({ default: module.Team })));
const Checkout = lazy(() => import("./pages/Checkout").then(module => ({ default: module.Checkout })));
const CheckoutRazorpay = lazy(() => import("./pages/CheckoutRazorpay").then(module => ({ default: module.CheckoutRazorpay })));
const PaymentStatus = lazy(() => import("./pages/PaymentStatus").then(module => ({ default: module.PaymentStatus })));
const Press = lazy(() => import("./pages/Press").then(module => ({ default: module.Press })));
const CaseStudies = lazy(() => import("./pages/CaseStudies").then(module => ({ default: module.CaseStudies })));
const ContactEnhanced = lazy(() => import("./pages/ContactEnhanced").then(module => ({ default: module.ContactEnhanced })));
const Cookies = lazy(() => import("./pages/Cookies").then(module => ({ default: module.Cookies })));
const PaymentDemo = lazy(() => import("./pages/PaymentDemo").then(module => ({ default: module.PaymentDemo })));

import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import theme from "./styles/theme";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HelmetProvider } from 'react-helmet-async';
import { CookieConsent } from './components/CookieConsent';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PushNotificationButton } from '../features/notifications/components/PushNotificationButton';
import { PushNotificationButton } from '@features/notifications/components/PushNotificationButton';


// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <CircularProgress size={48} />
  </Box>
);

export default function App() {
  useEffect(() => {
    initGA(); // Initialize Google Analytics
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" richColors />
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignInPage />} />

                  {/* Integrated Legacy Routes */}
                  <Route path="/products" element={<Products />} />
                  <Route path="/blog" element={<Blog />} />

                  {/* Segments */}
                  <Route path="/for-elderly" element={<Elderly />} />
                  <Route path="/for-doctors" element={<Doctors />} />
                  <Route path="/for-corporate" element={<Corporate />} />

                  {/* Other */}
                  <Route path="/brochure" element={<Brochure />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <RoleDashboard>
                        <HealthDashboard />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/cart" element={<ShoppingCart />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shop" element={<ShoppingCart />} />
                  <Route path="/checkout" element={<CheckoutRazorpay />} />
                  <Route path="/checkout-phonepe" element={<Checkout />} />
                  <Route path="/payment/status" element={<PaymentStatus />} />
                  <Route path="/investors" element={<Investors />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/partner-hospitals" element={<PartnerHospitals />} />
                  <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/help" element={<HelpCenter />} />

                  {/* New Phase 1 Pages */}
                  <Route path="/elderly-families" element={<ElderlyEnhanced />} />
                  <Route path="/healthcare-professionals" element={<DoctorsEnhanced />} />
                  <Route path="/corporate-insurance" element={<CorporateEnhanced />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/contact-enhanced" element={<ContactEnhanced />} />
                  <Route path="/early-access" element={<EarlyAccess />} />
                  <Route path="/partners" element={<Partners />} />

                  {/* Payment Demo */}
                  <Route path="/payment-demo" element={<PaymentDemo />} />

                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="leads" element={<AdminLeads />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="logs" element={<LogsPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <SOSButton />
            {/* PWA Notification Control (Temporary Placement) */}
            <Box sx={{ position: 'fixed', bottom: 20, right: 90, zIndex: 9999 }}>
              <PushNotificationButton />
            </Box>
          </div>
          <CookieConsent />
          <PWAInstallPrompt />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

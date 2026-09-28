import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PackagesPage from "./pages/PackagesPage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import CustomerQuotesPage from "./pages/CustomerQuotesPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/packages": "Packages",
  "/gallery": "Gallery",
  "/about": "About Us",
  "/contact": "Contact",
  "/login": "Log In",
  "/register": "Create Account",
  "/quotes": "My Quotes",
  "/favorites": "Favorites",
  "/profile": "My Profile",
  "/notifications": "Notifications",
  "/admin": "Admin Dashboard",
};

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = pathname.startsWith("/services/")
      ? "Service Details"
      : PAGE_TITLES[pathname] ?? "NOVA";

    document.title = `NOVA | ${title}`;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
      <BrowserRouter>
        <PageTitle />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />

          <Route
            path="/quotes"
            element={
              <ProtectedRoute customerOnly>
                <CustomerQuotesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/favorites" element={<ProtectedRoute customerOnly><FavoritesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute customerOnly><ProfilePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute customerOnly><NotificationsPage /></ProtectedRoute>} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

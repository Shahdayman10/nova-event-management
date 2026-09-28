import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({
  children,
  adminOnly = false,
  customerOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
  customerOnly?: boolean;
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center" }}>Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (customerOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

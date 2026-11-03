import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const token = localStorage.getItem("salonToken");
  const storedUser = localStorage.getItem("salonUser");

  // If not logged in, redirect to login and remember attempted URL
  if (!token || !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only route guard
  if (role === "admin" && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

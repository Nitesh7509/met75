import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import AppointmentModal from "./AppointmentModal";

export default function Navbar({ onOpenBooking }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalBookingOpen, setInternalBookingOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("salonUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Verify auth on mount
  useEffect(() => {
    const token = localStorage.getItem("salonToken");
    if (token) {
      api.get("/auth/me")
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem("salonUser", JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem("salonToken");
          localStorage.removeItem("salonUser");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    setUser(null);
    navigate("/");
  }

  function handleBookingClick() {
    setMobileMenuOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setInternalBookingOpen(true);
    }
  }

  const profileDestination = user?.role === "admin" ? "/admin" : "/dashboard";

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Hair Designs", path: "/hair-designs" },
    { label: "Amount & Pricing", path: "/pricing" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e7e0d5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66513e] to-[#392918] text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                ✂️
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#24231f] group-hover:text-[#66513e] transition-colors leading-tight">
                  MET75
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a7057] leading-none">
                  Luxury Salon & Barbershop
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#f4efe8] text-[#392918] font-bold shadow-2xs"
                        : "text-[#66513e] hover:text-[#24231f] hover:bg-[#faf7f2]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Booking CTA + Auth Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={handleBookingClick}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>📅</span>
                <span>Book Appointment</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[#e7e0d5]">
                  <Link
                    to={profileDestination}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f6f4ef] hover:bg-[#ede7dd] border border-[#e7e0d5] text-xs font-semibold text-[#392918] transition"
                    title={user.email}
                  >
                    <span className="text-sm">👤</span>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#66513e] text-white">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#817d76] hover:text-red-700 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                    title="Log out"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-[#e7e0d5]">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#392918] hover:bg-[#f6f4ef] border border-[#ded9d0] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#392918] text-white hover:bg-[#24231f] transition"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={handleBookingClick}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#66513e] text-white"
              >
                📅 Book
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl border border-[#ded9d0] bg-white text-[#392918] hover:bg-[#f6f4ef] transition focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <span className="text-xl font-bold leading-none block px-1">✕</span>
                ) : (
                  <span className="text-xl font-bold leading-none block px-1">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e7e0d5] bg-white px-5 py-5 shadow-xl transition-all">
            <nav className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#f4efe8] text-[#392918] font-bold"
                        : "text-[#66513e] hover:bg-[#faf7f2]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#e7e0d5] flex flex-col gap-3">
              <button
                type="button"
                onClick={handleBookingClick}
                className="w-full py-3 rounded-xl text-sm font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm text-center flex items-center justify-center gap-2"
              >
                <span>📅</span>
                <span>Request Appointment</span>
              </button>

              {user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f6f4ef] border border-[#e7e0d5]">
                  <Link
                    to={profileDestination}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-bold text-[#392918]"
                  >
                    <span>👤</span>
                    <span>{user.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase bg-[#66513e] text-white">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-bold px-2 py-1 rounded hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl text-xs font-bold border border-[#ded9d0] bg-white text-[#392918]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl text-xs font-bold bg-[#392918] text-white"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Built-in fallback Appointment modal if triggered directly from Navbar */}
      {!onOpenBooking && (
        <AppointmentModal
          isOpen={internalBookingOpen}
          onClose={() => setInternalBookingOpen(false)}
          onSuccess={() => {
            if (user) navigate("/dashboard");
          }}
        />
      )}
    </>
  );
}


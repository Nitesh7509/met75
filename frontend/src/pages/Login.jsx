import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away from login page
  useEffect(() => {
    const token = localStorage.getItem("salonToken");
    const storedUser = localStorage.getItem("salonUser");
    if (token && storedUser) {
      try {
        const u = JSON.parse(storedUser);
        const destination = u.role === "admin" ? "/admin" : "/dashboard";
        navigate(destination, { replace: true });
      } catch {
        localStorage.removeItem("salonToken");
        localStorage.removeItem("salonUser");
      }
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("salonToken", data.token);
      localStorage.setItem("salonUser", JSON.stringify(data.user));

      // Redirect to the originally requested protected route or role dashboard
      const fallback = data.user.role === "admin" ? "/admin" : "/dashboard";
      const from = location.state?.from?.pathname || fallback;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#faf8f5]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#66513e] to-[#392918] text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              ✂️
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#24231f]">
              MET75 SALON
            </span>
          </Link>
        </div>

        <form
          className="bg-white border border-[#e7e0d5] rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#392918]/5"
          onSubmit={handleSubmit}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
            WELCOME BACK
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#24231f] mt-1 mb-2">
            Sign In
          </h1>
          <p className="text-sm text-[#817d76] mb-6">
            Access your appointment bookings & haircut schedule.
          </p>

          <label htmlFor="email" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all"
          />

          <div className="flex justify-between items-baseline mt-5 mb-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-[#24231f]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#66513e] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#817d76] hover:text-[#24231f] font-semibold px-2 py-1"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="mt-4 p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full mt-6 py-3.5 px-5 rounded-xl font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {loading ? "Signing in..." : "Log in to Account"}
          </button>

          <p className="mt-6 text-center text-sm text-[#817d76]">
            New customer?{" "}
            <Link to="/register" className="font-semibold text-[#66513e] hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-[#f0ebe1] text-center">
            <Link to="/" className="text-xs font-semibold text-[#817d76] hover:text-[#392918] transition flex items-center justify-center gap-1">
              <span>←</span>
              <span>Back to Home & Salon Catalog</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away from register page
  useEffect(() => {
    const token = localStorage.getItem("salonToken");
    const storedUser = localStorage.getItem("salonUser");
    if (token && storedUser) {
      try {
        const u = JSON.parse(storedUser);
        navigate(u.role === "admin" ? "/admin" : "/dashboard", { replace: true });
      } catch {
        localStorage.removeItem("salonToken");
        localStorage.removeItem("salonUser");
      }
    }
  }, [navigate]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);

      localStorage.setItem("salonToken", data.token);
      localStorage.setItem("salonUser", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed."
      );
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
            YOUR SALON EXPERIENCE
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#24231f] mt-1 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-[#817d76] mb-6">
            Register to manage haircut appointments & automated 30-day reminders.
          </p>

          <label htmlFor="name" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all mb-4"
          />

          <label htmlFor="email" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all mb-4"
          />

          <label htmlFor="password" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Password (min 8 characters)
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
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
            {loading ? "Creating account..." : "Complete Registration"}
          </button>

          <p className="mt-6 text-center text-sm text-[#817d76]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#66513e] hover:underline">
              Sign in
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

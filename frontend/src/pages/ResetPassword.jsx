import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");

    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the 6-digit reset code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      setMessage(data.message || "Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not reset password. Please verify your code and try again."
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
            NEW CREDENTIALS
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#24231f] mt-1 mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-[#817d76] mb-6">
            Enter the 6-digit code sent to your email along with your new password.
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
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all mb-4"
          />

          <label htmlFor="otp" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            6-Digit Reset Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="e.g. 123456"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] tracking-widest font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all mb-4"
          />

          <label htmlFor="newPassword" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            New password (min 8 chars)
          </label>
          <div className="relative mb-4">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition-all"
          />

          {message && (
            <p className="mt-4 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
              ✓ {message}
            </p>
          )}
          {error && (
            <p className="mt-4 p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full mt-6 py-3.5 px-5 rounded-xl font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {loading ? "Resetting password..." : "Confirm & Set New Password"}
          </button>

          <p className="mt-6 text-center text-sm text-[#817d76]">
            Remembered your credentials?{" "}
            <Link to="/login" className="font-semibold text-[#66513e] hover:underline">
              Back to Sign in
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

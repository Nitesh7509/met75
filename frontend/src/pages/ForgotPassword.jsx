import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setMessage(data.message || "Reset code sent! Check your inbox.");

      // Automatically transition to reset password page after 1.5s
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send reset code. Please check your email and try again."
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
            RECOVER ACCESS
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#24231f] mt-1 mb-2">
            Forgot Password
          </h1>
          <p className="text-sm text-[#817d76] mb-6">
            Enter your registered email address to receive a 6-digit password reset code.
          </p>

          <label htmlFor="email" className="block text-sm font-semibold text-[#24231f] mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
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
            {loading ? "Sending code..." : "Send Reset Code"}
          </button>

          <p className="mt-6 text-center text-sm text-[#817d76]">
            Remembered your password?{" "}
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

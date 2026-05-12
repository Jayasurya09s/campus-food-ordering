"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { itemVariants, staggerContainer } from "@/lib/animations";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/orders",
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // After login, go to the Orders page for both users and admins
    window.location.href = "/orders";
  }

  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden flex items-center justify-center px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Left Side - Branding */}
        <motion.div variants={itemVariants} className="hidden md:block space-y-8">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-white">Welcome</span>
              <br />
              <span className="gradient-text">Back</span>
            </h1>
            <p className="text-xl text-gray-300">
              Order delicious food from your favorite campus vendors
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            {[
              {
                icon: "🍽️",
                title: "Fresh Food",
                desc: "Hot and fresh meals prepared on order",
              },
              {
                icon: "⚡",
                title: "Real-time Tracking",
                desc: "Track your order from preparation to delivery",
              },
              {
                icon: "🛡️",
                title: "Secure Payments",
                desc: "Safe and secure payment processing",
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-orange-400 smooth-transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="card-glass border border-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-10">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
                <p className="text-gray-400">
                  Sign in to your account to continue ordering
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1a1a2e] text-gray-400">Demo Access</span>
                </div>
              </div>

              {/* Admin Demo Section */}
              <div className="space-y-4 p-5 rounded-xl bg-linear-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">👨‍💼</span>
                  <h3 className="font-semibold text-white">Admin Demo Credentials</h3>
                </div>

                <div className="space-y-3">
                  {/* Email Display */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">EMAIL</p>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-orange-500/50 smooth-transition">
                      <code className="text-sm text-white font-mono">{ADMIN_EMAIL}</code>
                      <button
                        type="button"
                        onClick={() => setEmail(ADMIN_EMAIL)}
                        className="text-xs text-orange-400 hover:text-orange-300 smooth-transition font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Password Display */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">PASSWORD</p>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-orange-500/50 smooth-transition">
                      <code className="text-sm text-white font-mono">{ADMIN_PASSWORD}</code>
                      <button
                        type="button"
                        onClick={() => setPassword(ADMIN_PASSWORD)}
                        className="text-xs text-orange-400 hover:text-orange-300 smooth-transition font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Fill Button */}
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm smooth-transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login as Admin
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-orange-400 font-semibold hover:text-orange-300 smooth-transition"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-gray-500 mt-4"
          >
            🔒 Your data is encrypted and secure
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, LogOut, Home, UtensilsCrossed, Package, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const themeContext = useTheme();
  const { theme, toggleTheme } = themeContext;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = userRole === "admin";

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/orders", label: "Orders", icon: Package },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin", icon: UtensilsCrossed });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 group"
                onClick={() => setMobileOpen(false)}
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <span className="text-xl font-bold text-white">🍕</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg gradient-text">Campus Food</div>
                  <div className="text-xs text-gray-400 -mt-1">Order Smart</div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex items-center gap-1"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 smooth-transition group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-orange-500 smooth-transition" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 md:gap-4"
            >
              {/* Cart Icon */}
              {session?.user && !isAdmin && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-lg hover:bg-white/5 smooth-transition"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-orange-500 smooth-transition" />
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/5 smooth-transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                {!session?.user ? (
                  <>
                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                      Login
                    </Link>
                    <Link href="/register" className="btn-primary text-sm h-10 flex items-center">
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 smooth-transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 smooth-transition"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-gradient-hero"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 smooth-transition"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Cart */}
              {session?.user && !isAdmin && (
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 smooth-transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </Link>
              )}

              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                {!session?.user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-center text-gray-300 hover:bg-white/5"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-center btn-primary"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
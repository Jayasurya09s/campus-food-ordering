"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Lock, ShoppingCart, BarChart3, Database, CreditCard } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";
import { SAMPLE_FOODS } from "@/lib/constants";

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time order updates and instant notifications",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Razorpay powered with end-to-end encryption",
    },
    {
      icon: ShoppingCart,
      title: "Smart Cart",
      description: "Real-time cart synchronization and price updates",
    },
    {
      icon: BarChart3,
      title: "Admin Analytics",
      description: "Comprehensive dashboard with revenue insights",
    },
    {
      icon: Database,
      title: "PostgreSQL DB",
      description: "Robust database with Prisma ORM",
    },
    {
      icon: CreditCard,
      title: "Payment Ready",
      description: "Multiple payment methods and instant verification",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-gradient-hero dark:bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                  <span className="text-sm font-medium text-orange-400">🚀 Welcome to Campus Food</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="text-white">Order Food</span>
                  <br />
                  <span className="gradient-text">On Your Terms</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Smart DBMS-powered food ordering platform using Next.js, PostgreSQL & Razorpay. Experience seamless ordering with real-time updates and secure payments.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/menu"
                  className="btn-primary inline-flex items-center justify-center gap-2 group text-lg h-14"
                >
                  Order Food Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
                </Link>

                <Link
                  href="/login"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg h-14"
                >
                  Admin Panel
                  <BarChart3 className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
              >
                {[
                  { value: "100+", label: "Food Items" },
                  { value: "50K+", label: "Orders" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 md:h-full flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-square">
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-20 -left-20 w-40 h-40 card-glass animate-float"
                >
                  <div className="w-full h-full flex items-center justify-center text-6xl">🍕</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -25, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.2 }}
                  className="absolute -bottom-20 right-0 w-32 h-32 card-glass animate-float-delay-1"
                >
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍔</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, delay: 0.4 }}
                  className="absolute top-1/4 -right-20 w-36 h-36 card-glass animate-float-delay-2"
                >
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍝</div>
                </motion.div>

                {/* Center Element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border border-orange-500/30 absolute"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border border-purple-500/20 absolute"
                  />
                  <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-5xl shadow-2xl shadow-orange-500/50">
                    🚀
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Powerful Features</span>
              <br />
              <span className="gradient-text">For Everyone</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need for a seamless food ordering experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 backdrop-blur smooth-transition hover:-translate-y-2"
                >
                  <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Popular Foods Section */}
      <section className="py-20 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Popular Dishes</span>
              <br />
              <span className="gradient-text">Order Now</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Handpicked favorites from our kitchen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {SAMPLE_FOODS.map((food) => (
              <motion.div
                key={food.id}
                variants={itemVariants}
                className="group card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 overflow-hidden"
              >
                <div className="aspect-square flex items-center justify-center text-6xl group-hover:scale-110 smooth-transition bg-gradient-to-br from-white/5 to-white/10">
                  {food.image}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 truncate">{food.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-orange-400">₹{food.price}</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <span>⭐</span>
                      <span className="text-sm">{food.rating}</span>
                    </span>
                  </div>
                  <Link
                    href="/menu"
                    className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-center smooth-transition"
                  >
                    Add to Cart
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 p-12 md:p-20 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Ordering?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of students ordering food on campus with our modern platform
              </p>
              <Link
                href="/menu"
                className="inline-block px-8 py-4 rounded-lg bg-white text-orange-600 font-bold hover:bg-gray-100 smooth-transition"
              >
                Order Food Now
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Campus Food</h3>
              <p className="text-gray-400 text-sm">Modern food ordering platform for campus students</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/menu" className="hover:text-white smooth-transition">Menu</Link></li>
                <li><Link href="/orders" className="hover:text-white smooth-transition">Orders</Link></li>
                <li><Link href="/login" className="hover:text-white smooth-transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Next.js</li>
                <li>PostgreSQL</li>
                <li>Razorpay</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">support@campusfood.com</p>
              <p className="text-gray-400 text-sm">+91 9876543210</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">&copy; 2024 Campus Food. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm smooth-transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm smooth-transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm smooth-transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
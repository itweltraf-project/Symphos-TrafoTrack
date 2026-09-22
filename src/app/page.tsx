'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  ArrowRight,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Credentials State - Clean and secure, no default values or revealed passwords
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(res.message || 'Username atau kata sandi salah. Akses ditolak.');
        setIsLoading(false);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-lg leading-none">
              TRANSFORMER DELIVERY TRACKING
            </div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              PT Symphos Electric • Enterprise Monitoring System
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Aktif & Terproteksi</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-9 max-w-md w-full shadow-2xl backdrop-blur-md">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Portal Masuk Terotentikasi</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Silakan masukkan kredensial resmi Anda untuk mengakses dashboard monitoring.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan username Anda"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akses...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500">
              Akses terbatas hanya untuk pihak yang berwenang • PT Symphos Electric
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 lg:px-12 border-t border-slate-800 text-center text-xs text-slate-500 relative z-10">
        © 2026 PT Symphos Electric • Enterprise Heavy Haul Transformer Tracking
      </footer>
    </div>
  );
}

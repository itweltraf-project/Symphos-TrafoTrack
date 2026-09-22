'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  Shield,
  Truck,
  Building,
  ArrowRight,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser, allUsers, allVendors } = useAuth();

  // Credentials State
  const [username, setUsername] = useState('JODI');
  const [password, setPassword] = useState('GARMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Demo / Role Switcher State
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'MARKETING' | 'VENDOR'>('ADMIN');
  const [selectedVendorId, setSelectedVendorId] = useState('ven-01');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(res.message || 'Username atau password salah.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFillJodi = () => {
    setUsername('JODI');
    setPassword('GARMIN');
    setErrorMessage('');
  };

  const handleQuickLogin = (role: 'ADMIN' | 'MARKETING' | 'VENDOR', vendorId?: string) => {
    if (role === 'ADMIN') {
      const u = allUsers.find((x) => x.role === 'SUPER_ADMIN');
      if (u) switchUser(u.id);
    } else if (role === 'MARKETING') {
      const u = allUsers.find((x) => x.role === 'MARKETING');
      if (u) switchUser(u.id);
    } else {
      const u = allUsers.find((x) => x.role === 'VENDOR' && x.vendorId === (vendorId || selectedVendorId));
      if (u) switchUser(u.id);
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

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
            <div className="text-[11px] text-amber-400 font-medium tracking-wider uppercase mt-0.5">
              End-to-End Heavy Transformer Logistics Monitoring System
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Aktif • Terhubung ke 10 Mitra Ekspedisi</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Autentikasi Pengguna & Portal Monitoring</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Masuk ke Akun Anda</h2>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan kredensial yang telah didaftarkan untuk mengakses sistem logistik.
            </p>
          </div>

          {/* Active Credentials Callout */}
          <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-amber-950/20 border border-blue-500/30 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Akun Terdaftar (Super Admin):
              </span>
              <button
                type="button"
                onClick={handleQuickFillJodi}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors underline cursor-pointer"
              >
                Gunakan Akun Ini
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">USERNAME:</span>
                <span className="font-mono font-bold text-white tracking-wider">JODI</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">KATA SANDI:</span>
                <span className="font-mono font-bold text-amber-300 tracking-wider">GARMIN</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan username (contoh: JODI)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Kata Sandi (Password)
                </label>
                <span className="text-[10px] text-slate-500">Kredensial Resmi Trafo MKT</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan kata sandi (contoh: GARMIN)"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Dashboard Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Mode Collapsible Toggle */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                Opsi Cepat: Masuk Berdasarkan Role / Vendor (RBAC)
              </span>
              <span className="text-[11px] text-blue-400 font-semibold">
                {showDemoSwitcher ? 'Tutup' : 'Buka'}
              </span>
            </button>

            {showDemoSwitcher && (
              <div className="mt-4 space-y-4 animate-in fade-in duration-200">
                {/* Role Selection Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'ADMIN'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Super Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('MARKETING')}
                    className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'MARKETING'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Marketing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('VENDOR')}
                    className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'VENDOR'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Vendor</span>
                  </button>
                </div>

                {selectedRole === 'VENDOR' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      Pilih Salah Satu dari 10 Vendor Ekspedisi:
                    </label>
                    <select
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500"
                    >
                      {allVendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.code}) — {v.pic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleQuickLogin(selectedRole, selectedVendorId)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulasi Akses Langsung Sebagai {selectedRole}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 lg:px-12 border-t border-slate-800 text-center text-xs text-slate-500 relative z-10">
        © 2026 PT Trafo Nusantara Logistics System • Enterprise Heavy Haul Transformer Tracking
      </footer>
    </div>
  );
}

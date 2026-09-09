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
  CheckCircle2,
  Lock,
  Mail,
  HelpCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, allUsers, allVendors } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'MARKETING' | 'VENDOR'>('ADMIN');
  const [selectedVendorId, setSelectedVendorId] = useState('ven-01');

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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-10">
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

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Aktif • Terhubung ke 10 Ekspedisi</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-xl w-full shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-white">Masuk ke Portal Monitoring</h2>
            <p className="text-xs text-slate-400 mt-1">
              Pilih profil pengguna untuk langsung menguji hak akses (RBAC) dan fungsionalitas sistem.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => setSelectedRole('ADMIN')}
              className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Super Admin</span>
            </button>

            <button
              onClick={() => setSelectedRole('MARKETING')}
              className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'MARKETING'
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Marketing</span>
            </button>

            <button
              onClick={() => setSelectedRole('VENDOR')}
              className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                selectedRole === 'VENDOR'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Vendor (10 Mitra)</span>
            </button>
          </div>

          {/* Role Description & Vendor Dropdown */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-3 mb-6">
            {selectedRole === 'ADMIN' && (
              <div>
                <div className="font-bold text-purple-300">Akses Penuh Super Admin:</div>
                <div className="text-slate-400 mt-1 leading-relaxed">
                  Membuat shipment baru, mengelola data trafo, alokasi vendor ekspedisi, pantau seluruh histori,
                  user management, audit logs, dan export laporan.
                </div>
              </div>
            )}

            {selectedRole === 'MARKETING' && (
              <div>
                <div className="font-bold text-blue-300">Akses Staff Marketing / Internal:</div>
                <div className="text-slate-400 mt-1 leading-relaxed">
                  Monitoring seluruh pengiriman trafo, search nomor serial, filter vendor & status, tracking ETA,
                  inspeksi foto, melihat BAST/POD, dan download laporan.
                </div>
              </div>
            )}

            {selectedRole === 'VENDOR' && (
              <div className="space-y-3">
                <div className="font-bold text-amber-300">Akses Mitra Ekspedisi (Data Terisolasi):</div>
                <div className="text-slate-400 leading-relaxed">
                  Setiap vendor hanya dapat mengakses pengiriman yang ditugaskan. Menginput driver, nopol kendaraan,
                  update lokasi di jalan, upload foto, dan submit POD.
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                    Pilih Salah Satu dari 10 Vendor Ekspedisi:
                  </label>
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500"
                  >
                    {allVendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.code}) — {v.pic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleQuickLogin(selectedRole, selectedVendorId)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Masuk ke Dashboard Sistem</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-500">
              Role dan vendor dapat diganti secara instan kapan saja di dalam dashboard.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-8 border-t border-slate-800 text-center text-xs text-slate-500 relative z-10">
        © 2026 PT Trafo Nusantara Logistics System • Enterprise Heavy Haul Transformer Tracking
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Search,
  Award,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function VendorsPage() {
  const { vendors, shipments, drivers, vehicles } = useShipments();
  const { switchRole } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const sortedVendors = [...vendors].sort((a, b) => b.onTimeRate - a.onTimeRate);

  const filtered = sortedVendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.pic.toLowerCase().includes(search.toLowerCase())
  );

  const activeVendor = vendors.find((v) => v.id === selectedVendorId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Manajemen & Evaluasi Performa 10 Vendor Ekspedisi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem penilaian SLA, ketepatan waktu (On-Time Delivery), armada alat berat, dan skor kepatuhan POD.
          </p>
        </div>
      </div>

      {/* Leaderboard Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedVendors.slice(0, 3).map((v, idx) => (
          <div
            key={v.id}
            className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden flex flex-col justify-between ${
              idx === 0
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300 ring-2 ring-amber-400/20'
                : idx === 1
                ? 'bg-gradient-to-br from-slate-100 to-white border-slate-300'
                : 'bg-gradient-to-br from-orange-50 to-white border-orange-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    idx === 0
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800 font-bold'
                      : 'bg-orange-200 text-orange-900 font-bold'
                  }`}
                >
                  Peringkat #{idx + 1}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-2">{v.name}</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{v.code}</div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center font-bold text-lg text-amber-600 border border-slate-100">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">On-Time:</span>
                <span className="font-extrabold text-emerald-600">{v.onTimeRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total:</span>
                <span className="font-bold text-slate-800">{v.totalShipments}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Armada:</span>
                <span className="font-bold text-slate-800">{v.fleetCount} Unit</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Vendor, Kode, PIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Terdaftar <strong className="text-slate-900">10 Mitra Ekspedisi Resmi</strong>
        </div>
      </div>

      {/* 10 Vendors Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Nama Vendor & Kode</th>
                <th className="py-3.5 px-4">PIC & Kontak</th>
                <th className="py-3.5 px-4">Total Pengiriman</th>
                <th className="py-3.5 px-4">On-Time Delivery Rate</th>
                <th className="py-3.5 px-4">Avg Waktu Antar</th>
                <th className="py-3.5 px-4">Kepatuhan POD</th>
                <th className="py-3.5 px-4 text-center">Simulasi Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((vendor, idx) => {
                const vendorShipments = shipments.filter((s) => s.vendorId === vendor.id);

                return (
                  <tr key={vendor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 text-center font-black text-slate-700">
                      #{idx + 1}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">{vendor.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {vendor.code} • Armada: {vendor.fleetCount} Unit
                      </div>
                      {vendor.badge && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          {vendor.badge}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{vendor.pic}</div>
                      <div className="text-[10px] text-slate-400">{vendor.phone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{vendor.email}</div>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      {vendor.totalShipments} Trafo
                      <div className="text-[10px] text-slate-400 font-normal">
                        ({vendorShipments.length} aktif saat ini)
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-600 text-xs">{vendor.onTimeRate}%</span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${vendor.onTimeRate}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {vendor.delayedCount}x insiden keterlambatan
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">{vendor.avgDeliveryHours} Jam</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800">{vendor.podCompletionRate}%</span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => {
                          switchRole('VENDOR', vendor.id);
                          alert(`Beralih ke sesi ${vendor.name}! Sekarang Anda hanya akan melihat pengiriman milik ${vendor.name}.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] transition-colors"
                        title="Uji coba login sebagai vendor ini"
                      >
                        Login Vendor Ini
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

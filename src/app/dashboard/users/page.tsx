'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FolderLock, Shield, Check, X, User, ArrowRight } from 'lucide-react';

export default function UsersPage() {
  const { allUsers, currentUser, switchUser, allVendors } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-purple-600" />
            Manajemen Pengguna & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola akun internal, staff marketing, dan akun isolasi masing-masing dari 10 vendor ekspedisi.
          </p>
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          Matriks Hak Akses Pengguna (Permission Matrix)
        </h3>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold border-b border-slate-200">
                <th className="p-3">Fitur / Modul</th>
                <th className="p-3 text-center">Super Admin</th>
                <th className="p-3 text-center">Marketing Staff</th>
                <th className="p-3 text-center">Vendor Ekspedisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-semibold">Buat Pengiriman Baru & Pilih Vendor</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                <td className="p-3 text-center text-slate-400 font-medium">✗ Terbatas</td>
                <td className="p-3 text-center text-slate-400 font-medium">✗ Tidak Boleh</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Melihat Seluruh Pengiriman Semua Vendor</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                <td className="p-3 text-center text-red-600 font-bold">✗ Terisolasi (Hanya Milik Sendiri)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Alokasi Driver & Armada Truk</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-400">✗ Hanya Lihat</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Wajib Diisi Vendor</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Update Posisi GPS & Tracking Milestone</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-400">✗ Hanya Lihat</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Wajib Diisi Vendor</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Submit Proof of Delivery (POD) & Tanda Tangan</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Verifikasi</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Review BAST</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Input Lapangan</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Ekspor Laporan Excel / PDF</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                <td className="p-3 text-center text-slate-600">✓ Hanya Tugas Sendiri</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daftar Akun Pengguna ({allUsers.length})
          </h3>
          <span className="text-xs text-slate-400">Klik tombol &apos;Beralih ke Akun Ini&apos; untuk simulasi sesi</span>
        </div>

        <div className="divide-y divide-slate-100">
          {allUsers.map((user) => {
            const isCurrent = currentUser.id === user.id;
            const vendor = allVendors.find((v) => v.id === user.vendorId);

            return (
              <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{user.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Sedang Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{user.email} • {user.department}</div>
                    {vendor && (
                      <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                        Mitra: {vendor.name} ({vendor.code})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : user.role === 'MARKETING'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {user.role}
                  </span>

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        switchUser(user.id);
                        alert(`Sesi berhasil beralih ke ${user.name}!`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold transition-all"
                    >
                      Beralih ke Akun Ini
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

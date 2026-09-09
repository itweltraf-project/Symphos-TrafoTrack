'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { History, Search, Shield, Clock, User, Filter } from 'lucide-react';

export default function ActivityLogsPage() {
  const { activityLogs } = useShipments();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' ? true : l.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Activity Audit Trail & System Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log audit tak terhapuskan mencatat seluruh pembaruan status, penugasan armada, upload foto, dan serah terima trafo.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aktivitas, nama user, detail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">Semua Peran (Role)</option>
            <option value="SUPER_ADMIN">SUPER ADMIN</option>
            <option value="MARKETING">MARKETING</option>
            <option value="VENDOR">EXPEDITION VENDOR</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total: <strong className="text-slate-900">{filteredLogs.length}</strong> Aktivitas Tercatat
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold border-b border-slate-200">
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Pengguna (User)</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Aksi / Aktivitas Sistem</th>
                <th className="py-3 px-4">Keterangan Tambahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.user}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        log.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : log.role === 'MARKETING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-sm">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

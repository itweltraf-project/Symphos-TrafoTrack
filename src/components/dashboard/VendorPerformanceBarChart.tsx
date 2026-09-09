'use client';

import React from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { Award, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export function VendorPerformanceBarChart() {
  const { vendors } = useShipments();

  // Sort vendors by onTimeRate descending
  const sortedVendors = [...vendors].sort((a, b) => b.onTimeRate - a.onTimeRate);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Vendor Performance Leaderboard (10 Ekspedisi Partner)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Komparasi On-Time Delivery, total volume, dan SLA penyelesaian POD antar vendor.
          </p>
        </div>
        <Link
          href="/dashboard/vendors"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Detail Vendor & Armada →
        </Link>
      </div>

      <div className="pt-4 space-y-3.5">
        {sortedVendors.slice(0, 5).map((vendor, idx) => {
          return (
            <div key={vendor.id} className="group p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
              <div className="flex items-center justify-between gap-4 text-xs mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700'
                        : idx === 2
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 truncate">{vendor.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                    {vendor.code}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-slate-600">
                  <span className="hidden sm:inline text-slate-400">
                    Total: <strong className="text-slate-800">{vendor.totalShipments}</strong>
                  </span>
                  <span className="hidden sm:inline text-slate-400">
                    Avg: <strong className="text-slate-800">{vendor.avgDeliveryHours} Jam</strong>
                  </span>
                  <span className="font-bold text-emerald-600 text-xs">{vendor.onTimeRate}% Tepat Waktu</span>
                </div>
              </div>

              {/* Progress Bar for On-Time Rate */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${vendor.onTimeRate}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    vendor.onTimeRate >= 95
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : vendor.onTimeRate >= 90
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>PIC: {vendor.pic} ({vendor.phone})</span>
                <span>Armada: {vendor.fleetCount} Unit • Keterlambatan: {vendor.delayedCount}x</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

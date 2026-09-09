'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

type TimeFilter = 'TODAY' | '7_DAYS' | '30_DAYS' | '3_MONTHS' | 'THIS_YEAR';

export function ShipmentOverviewChart() {
  const [filter, setFilter] = useState<TimeFilter>('7_DAYS');

  const chartDataMap: Record<
    TimeFilter,
    { labels: string[]; shipments: number[]; delivered: number[]; delayed: number[] }
  > = {
    TODAY: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      shipments: [2, 3, 7, 10, 8, 4],
      delivered: [0, 1, 3, 5, 4, 2],
      delayed: [0, 0, 1, 1, 0, 0],
    },
    '7_DAYS': {
      labels: ['Jum (29/8)', 'Sab (30/8)', 'Min (31/8)', 'Sen (1/9)', 'Sel (2/9)', 'Rab (3/9)', 'Kam (4/9)'],
      shipments: [6, 4, 3, 8, 12, 14, 10],
      delivered: [4, 3, 2, 6, 9, 10, 6],
      delayed: [0, 1, 0, 1, 2, 1, 1],
    },
    '30_DAYS': {
      labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
      shipments: [24, 32, 28, 38],
      delivered: [21, 29, 25, 34],
      delayed: [2, 3, 1, 2],
    },
    '3_MONTHS': {
      labels: ['Juli 2026', 'Agustus 2026', 'September 2026 (Mtd)'],
      shipments: [84, 98, 32],
      delivered: [79, 92, 26],
      delayed: [4, 5, 2],
    },
    THIS_YEAR: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
      shipments: [45, 52, 60, 58, 64, 78, 84, 98, 32],
      delivered: [41, 49, 56, 55, 61, 74, 79, 92, 26],
      delayed: [3, 2, 3, 2, 2, 3, 4, 5, 2],
    },
  };

  const currentData = chartDataMap[filter];
  const maxVal = Math.max(...currentData.shipments, 1) * 1.25;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Shipment Overview (Tren Pengiriman Trafo)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Volume pengiriman aktif, tiba, dan insiden keterlambatan berdasarkan waktu.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(
            [
              { key: 'TODAY', label: 'Hari Ini' },
              { key: '7_DAYS', label: '7 Hari' },
              { key: '30_DAYS', label: '30 Hari' },
              { key: '3_MONTHS', label: '3 Bulan' },
              { key: 'THIS_YEAR', label: 'Tahun Ini' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === item.key
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="pt-6">
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {currentData.labels.map((label, idx) => {
            const shipHeight = (currentData.shipments[idx] / maxVal) * 100;
            const delivHeight = (currentData.delivered[idx] / maxVal) * 100;
            const delayHeight = (currentData.delayed[idx] / maxVal) * 100;

            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-28 bg-slate-900 text-white text-[11px] rounded-lg p-2 shadow-xl pointer-events-none z-20 whitespace-nowrap">
                  <div className="font-bold border-b border-slate-700 pb-1">{label}</div>
                  <div className="text-blue-300">Total: {currentData.shipments[idx]} unit</div>
                  <div className="text-emerald-300">Delivered: {currentData.delivered[idx]} unit</div>
                  <div className="text-red-300">Delayed: {currentData.delayed[idx]} unit</div>
                </div>

                {/* Bars group */}
                <div className="w-full max-w-[38px] flex items-end justify-center gap-1 h-48 bg-slate-50 rounded-lg p-1">
                  {/* Total Shipment Bar */}
                  <div
                    style={{ height: `${shipHeight}%` }}
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-md transition-all duration-500 group-hover:brightness-110"
                  />
                  {/* Delivered Bar */}
                  <div
                    style={{ height: `${delivHeight}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-md transition-all duration-500 group-hover:brightness-110"
                  />
                </div>

                {/* Label */}
                <span className="text-[11px] font-medium text-slate-500 text-center truncate w-full">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            <span>Total Pengiriman Trafo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span>Tiba & Diserahkan (Delivered)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            <span>Keterlambatan (Delayed)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

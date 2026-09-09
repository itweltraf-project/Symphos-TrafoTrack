'use client';

import React from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { PieChart } from 'lucide-react';

export function StatusDonutChart() {
  const { shipments } = useShipments();

  // Categorize shipments into meaningful groups
  const waitingPickup = shipments.filter(
    (s) => s.currentStatus === 'SHIPMENT_CREATED' || s.currentStatus === 'WAITING_PICKUP'
  ).length;
  const inTransit = shipments.filter(
    (s) =>
      s.currentStatus === 'IN_TRANSIT' ||
      s.currentStatus === 'DEPARTED' ||
      s.currentStatus === 'AT_TRANSIT_HUB' ||
      s.currentStatus === 'APPROACHING_DESTINATION'
  ).length;
  const arrived = shipments.filter(
    (s) => s.currentStatus === 'ARRIVED' || s.currentStatus === 'UNLOADING'
  ).length;
  const delivered = shipments.filter(
    (s) => s.currentStatus === 'DELIVERED' || s.currentStatus === 'POD_UPLOADED' || s.currentStatus === 'COMPLETED'
  ).length;
  const delayed = shipments.filter((s) => s.isDelayed || s.currentStatus === 'DELAYED').length;

  const total = shipments.length || 1;

  const segments = [
    { label: 'In Transit (Perjalanan)', count: inTransit, color: '#2563eb', bgClass: 'bg-blue-600' },
    { label: 'Delivered (Selesai POD)', count: delivered, color: '#059669', bgClass: 'bg-emerald-600' },
    { label: 'Waiting Pickup', count: waitingPickup, color: '#f59e0b', bgClass: 'bg-amber-500' },
    { label: 'Arrived at Site', count: arrived, color: '#6366f1', bgClass: 'bg-indigo-500' },
    { label: 'Delayed (Terlambat)', count: delayed, color: '#dc2626', bgClass: 'bg-red-600' },
  ];

  // Calculate SVG stroke dashes for donut
  let cumulativePercent = 0;
  const circumference = 2 * Math.PI * 40; // r=40 -> ~251.32

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            Shipment Status Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Proporsi status pengiriman trafo saat ini</p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          {shipments.length} Total Unit
        </span>
      </div>

      <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-8">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Base circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="16"
            />
            {segments.map((seg, idx) => {
              const percent = seg.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercent * circumference;
              cumulativePercent += percent;

              if (seg.count === 0) return null;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>

          {/* Donut Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 leading-none">{shipments.length}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Trafo Unit</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 flex-1 w-full">
          {segments.map((seg, idx) => {
            const pct = Math.round((seg.count / total) * 100);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${seg.bgClass}`} />
                  <span className="text-slate-700 font-medium">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{seg.count} unit</span>
                  <span className="text-[11px] text-slate-400 w-8 text-right">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span>Tingkat Keterlambatan Armada:</span>
        <span className="font-bold text-red-600">
          {Math.round((delayed / total) * 100)}% ({delayed} pengiriman)
        </span>
      </div>
    </div>
  );
}

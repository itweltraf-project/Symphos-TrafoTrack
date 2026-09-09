'use client';

import React, { useState } from 'react';
import { Shipment } from '@/types';
import { getStatusMeta } from '@/lib/utils';
import { MapPin, Navigation, Truck, Zap, Clock, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface InteractiveTrackingMapProps {
  shipments: Shipment[];
  selectedShipmentId?: string;
  onSelectShipment?: (shipment: Shipment) => void;
  compact?: boolean;
}

export function InteractiveTrackingMap({
  shipments,
  selectedShipmentId,
  onSelectShipment,
  compact = false,
}: InteractiveTrackingMapProps) {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0] || null
  );

  // Approximate coordinate mapping to SVG viewBox (Indonesia bounds: lat 6N to 11S, lng 95E to 141E)
  // Projected to a 1000x480 coordinate box
  const projectToMap = (lat: number, lng: number) => {
    // Latitude range: -11 to 6 (17 degrees span)
    // Longitude range: 95 to 125 (30 degrees span for western/central Indonesia)
    const minLng = 98.0;
    const maxLng = 125.0;
    const minLat = -10.5;
    const maxLat = 3.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 1000;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 480;

    return {
      x: Math.max(40, Math.min(960, x)),
      y: Math.max(40, Math.min(440, y)),
    };
  };

  return (
    <div className={`relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl ${compact ? 'h-96' : 'h-[520px]'}`}>
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-white max-w-xs shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-xs">Live GPS Tracking Network</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Memantau <strong className="text-white">{shipments.length} Trafo</strong> dalam pergerakan armada lintas pulau.
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-full object-cover select-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)' }}
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="1000" height="480" fill="url(#grid)" />

          {/* Island contours (Stylized vector outlines for Sumatra, Java, Kalimantan, Sulawesi, Bali/Nusa Tenggara) */}
          <g fill="#1e293b" fillOpacity="0.4" stroke="#334155" strokeWidth="1">
            {/* Sumatra */}
            <path d="M 120 100 L 160 80 L 220 140 L 290 220 L 330 300 L 300 320 L 240 270 L 170 200 Z" />
            {/* Java */}
            <path d="M 330 340 L 460 345 L 600 350 L 680 355 L 670 375 L 540 370 L 390 365 L 325 355 Z" />
            {/* Kalimantan */}
            <path d="M 420 140 L 520 120 L 580 180 L 550 250 L 460 250 L 410 200 Z" />
            {/* Sulawesi */}
            <path d="M 680 150 L 740 140 L 780 200 L 730 270 L 700 320 L 670 270 L 710 220 L 680 180 Z" />
            {/* Bali & Nusa Tenggara */}
            <path d="M 690 360 L 740 362 L 810 365 L 820 375 L 750 372 L 690 370 Z" />
          </g>

          {/* Major Logistics Corridors (Polylines) */}
          <g stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.5" fill="none">
            {/* Trans Java Expressway */}
            <path d="M 345 350 Q 500 352 660 358" />
            {/* Sumatra Merak-Bakauheni to Pekanbaru */}
            <path d="M 335 342 L 325 310 L 280 240 L 220 160" />
            {/* Marine route Surabaya to Makassar / Sorowako */}
            <path d="M 660 358 Q 690 310 710 250" />
            {/* Surabaya to Sumbawa */}
            <path d="M 660 358 L 740 365 L 780 368" />
          </g>

          {/* Shipment Waypoints & Markers */}
          {shipments.map((shipment) => {
            const pos = projectToMap(shipment.currentLocation.lat, shipment.currentLocation.lng);
            const isSelected = activeShipment?.id === shipment.id;
            const isLate = shipment.isDelayed || shipment.currentStatus === 'DELAYED';

            return (
              <g
                key={shipment.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => {
                  setActiveShipment(shipment);
                  if (onSelectShipment) onSelectShipment(shipment);
                }}
              >
                {/* Ping animation circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 18 : 12}
                  fill={isLate ? '#ef4444' : '#3b82f6'}
                  fillOpacity="0.2"
                  className="animate-ping"
                />

                {/* Outer halo */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 14 : 9}
                  fill={isLate ? '#ef4444' : isSelected ? '#3b82f6' : '#0ea5e9'}
                  fillOpacity="0.4"
                />

                {/* Core dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 7 : 5}
                  fill={isLate ? '#fee2e2' : '#ffffff'}
                  stroke={isLate ? '#dc2626' : '#2563eb'}
                  strokeWidth="2"
                />

                {/* Label text */}
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {shipment.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Shipment Live Info Card Overlay (Bottom Right) */}
      {activeShipment && (
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 text-white w-84 sm:w-96 shadow-2xl transition-all">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-blue-400">{activeShipment.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {activeShipment.transformer.capacityKVA} kVA
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate max-w-[240px]">
                {activeShipment.customer.companyName}
              </div>
            </div>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                activeShipment.isDelayed ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              {activeShipment.currentStatus}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Posisi Saat Ini:
              </span>
              <span className="font-semibold truncate max-w-[170px]">
                {activeShipment.currentLocation.landmark || activeShipment.currentLocation.city}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" /> Armada & Vendor:
              </span>
              <span className="font-semibold truncate max-w-[170px]">
                {activeShipment.vendor.name.split('PT ')[1] || activeShipment.vendor.name}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Estimasi Tiba (ETA):
              </span>
              <span className="font-semibold text-emerald-300">{activeShipment.expectedDeliveryDate}</span>
            </div>

            {activeShipment.driver && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Driver & Polisi:</span>
                <span>
                  {activeShipment.driver.name} ({activeShipment.vehicle?.plateNumber})
                </span>
              </div>
            )}

            {activeShipment.isDelayed && (
              <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/80 text-[11px] text-red-200">
                <span className="font-bold">Kendala: </span>
                {activeShipment.delayReason || 'Terlambat melebihi estimasi ETA'}
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Koordinat: {activeShipment.currentLocation.lat.toFixed(4)}, {activeShipment.currentLocation.lng.toFixed(4)}
            </span>
            <Link
              href={`/dashboard/shipments/${activeShipment.id}`}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline"
            >
              Lihat Detail & Timeline <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ShipmentOverviewChart } from '@/components/dashboard/ShipmentOverviewChart';
import { StatusDonutChart } from '@/components/dashboard/StatusDonutChart';
import { VendorPerformanceBarChart } from '@/components/dashboard/VendorPerformanceBarChart';
import { RecentShipmentsTable } from '@/components/dashboard/RecentShipmentsTable';
import { InteractiveTrackingMap } from '@/components/map/InteractiveTrackingMap';
import {
  Truck,
  Clock,
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { shipments } = useShipments();
  const { currentUser, isVendor, currentVendor } = useAuth();

  // Metrics calculation
  const totalShipments = shipments.length;
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
  const delayedShipments = shipments.filter((s) => s.isDelayed || s.currentStatus === 'DELAYED');
  const delivered = shipments.filter(
    (s) => s.currentStatus === 'DELIVERED' || s.currentStatus === 'POD_UPLOADED' || s.currentStatus === 'COMPLETED'
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-500 fill-current" />
            {isVendor ? `Portal Ekspedisi: ${currentVendor?.name}` : 'Monitoring Logistik Transformer Trafo'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isVendor
              ? `Akses khusus pengiriman yang ditugaskan ke ${currentVendor?.name}. Pantau rute, input armada, dan update milestone.`
              : 'Pantau posisi terkini trafo, jadwal armada, ETA, kendala keterlambatan, dan verifikasi POD secara real-time.'}
          </p>
        </div>

        {isVendor && (
          <Link
            href="/dashboard/vendor-portal"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <span>Buka Driver Mobile View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Delay Alert Banner (Delay Detection Engine - Section 19) */}
      {delayedShipments.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-red-500/20">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-red-900 flex items-center gap-2">
                <span>Perhatian: Terdeteksi {delayedShipments.length} Pengiriman Mengalami Keterlambatan</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-bold uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                Pengiriman melewati estimasi waktu sampai (ETA). Segera koordinasikan dengan ekspedisi pelaksana dan lakukan tindakan korektif.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {delayedShipments.slice(0, 2).map((d) => (
              <Link
                key={d.id}
                href={`/dashboard/shipments/${d.id}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-800 font-bold text-xs hover:bg-red-100 transition-colors"
              >
                Cek {d.id} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 6 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Shipment"
          value={totalShipments}
          subValue="Unit Trafo"
          trend="+12%"
          trendDirection="up"
          icon={Truck}
          colorScheme="blue"
        />

        <StatCard
          title="Waiting Pickup"
          value={waitingPickup}
          subValue="Di Pabrik"
          trend="Siap Angkut"
          trendDirection="neutral"
          icon={Clock}
          colorScheme="amber"
        />

        <StatCard
          title="In Transit"
          value={inTransit}
          subValue="Armada Bergerak"
          trend="Live GPS"
          trendDirection="up"
          icon={Navigation}
          colorScheme="indigo"
        />

        <StatCard
          title="Arrived at Site"
          value={arrived}
          subValue="Tiba di Lokasi"
          trend="Siap Lifting"
          trendDirection="up"
          icon={MapPin}
          colorScheme="purple"
        />

        <StatCard
          title="Delayed"
          value={delayedShipments.length}
          subValue="Lewat ETA"
          trend={delayedShipments.length > 0 ? 'Perlu Eskalasi' : 'Nol Keterlambatan'}
          trendDirection={delayedShipments.length > 0 ? 'down' : 'up'}
          icon={AlertTriangle}
          colorScheme="red"
          pulse={delayedShipments.length > 0}
        />

        <StatCard
          title="Delivered (POD)"
          value={delivered}
          subValue="Serah Terima"
          trend="100% Valid"
          trendDirection="up"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
      </div>

      {/* Live Map Preview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Live Route Tracking (Peta Interaktif Pengiriman Trafo Nasional)
            </h2>
            <p className="text-xs text-slate-500">
              Pergerakan live armada trafo di jalur Pantura, Tol Trans Jawa, Tol Trans Sumatra, dan rute antarpulau.
            </p>
          </div>
          <Link
            href="/dashboard/tracking"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Buka Layar Peta Penuh →
          </Link>
        </div>

        <InteractiveTrackingMap shipments={shipments} compact />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShipmentOverviewChart />
        </div>
        <div>
          <StatusDonutChart />
        </div>
      </div>

      {/* Vendor Performance Comparison (10 Vendors) */}
      {!isVendor && <VendorPerformanceBarChart />}

      {/* Recent Shipments Table */}
      <RecentShipmentsTable />
    </div>
  );
}

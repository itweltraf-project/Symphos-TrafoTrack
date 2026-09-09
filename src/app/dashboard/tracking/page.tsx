'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { InteractiveTrackingMap } from '@/components/map/InteractiveTrackingMap';
import { getStatusMeta, formatDate } from '@/lib/utils';
import {
  MapPin,
  Search,
  Truck,
  Navigation,
  Clock,
  ExternalLink,
  Zap,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveTrackingPage() {
  const { shipments } = useShipments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>(shipments[0]?.id);

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.transformer.transformerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.transformer.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL'
        ? true
        : selectedStatus === 'DELAYED'
        ? s.isDelayed || s.currentStatus === 'DELAYED'
        : s.currentStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const activeShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Live Tracking & Peta Posisi Trafo Nasional
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring armada pengiriman transformer secara live dengan koordinat GPS dan status perjalanan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>GPS Network Online ({shipments.length} Active Nodes)</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Sidebar Shipment Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <InteractiveTrackingMap
            shipments={filteredShipments}
            selectedShipmentId={selectedShipmentId}
            onSelectShipment={(s) => setSelectedShipmentId(s.id)}
          />

          {/* Active Shipment Quick Summary Bar */}
          {activeShipment && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{activeShipment.id}</span>
                    <span className="text-slate-500 font-semibold">• {activeShipment.transformer.transformerNumber}</span>
                  </div>
                  <div className="text-slate-500">
                    Posisi: <strong className="text-slate-800">{activeShipment.currentLocation.landmark || activeShipment.currentLocation.city}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimasi Tiba:</span>
                  <span className="font-bold text-emerald-600">{activeShipment.expectedDeliveryDate}</span>
                </div>
                <Link
                  href={`/dashboard/shipments/${activeShipment.id}`}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors"
                >
                  Buka Detail
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Shipment Selector List (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[600px]">
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daftar Node Armada ({filteredShipments.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID, Serial, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {['ALL', 'IN_TRANSIT', 'WAITING_PICKUP', 'DELAYED', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'ALL' ? 'Semua' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* List of Shipments */}
          <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1 scrollbar-thin">
            {filteredShipments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">Tidak ada pengiriman yang cocok.</div>
            ) : (
              filteredShipments.map((shipment) => {
                const isSelected = selectedShipmentId === shipment.id;
                const meta = getStatusMeta(shipment.currentStatus, shipment.isDelayed);

                return (
                  <div
                    key={shipment.id}
                    onClick={() => setSelectedShipmentId(shipment.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{shipment.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-1 font-semibold text-slate-700 truncate">{shipment.customer.companyName}</div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {shipment.currentLocation.city}
                      </span>
                      <span>ETA: {shipment.expectedDeliveryDate.split(' ')[0]}</span>
                    </div>

                    {shipment.driver && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{shipment.vendor.name.split('PT ')[1]}</span>
                        <span>{shipment.driver.name} ({shipment.vehicle?.plateNumber})</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

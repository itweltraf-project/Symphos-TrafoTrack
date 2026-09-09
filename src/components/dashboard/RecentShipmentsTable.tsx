'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { getStatusMeta, formatDate } from '@/lib/utils';
import {
  Truck,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export function RecentShipmentsTable() {
  const { shipments, vendors } = useShipments();
  const { isVendor } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.transformer.transformerNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.destinationCity.toLowerCase().includes(search.toLowerCase()) ||
      (s.driver && s.driver.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'DELAYED'
        ? s.isDelayed || s.currentStatus === 'DELAYED'
        : s.currentStatus === statusFilter;

    const matchesVendor = vendorFilter === 'ALL' ? true : s.vendorId === vendorFilter;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Filter Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Monitoring Pengiriman Trafo Aktif ({filteredShipments.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pengiriman trafo dengan status lokasi live, armada, dan estimasi waktu sampai.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, trafo, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="IN_TRANSIT">In Transit (Perjalanan)</option>
            <option value="WAITING_PICKUP">Waiting Pickup</option>
            <option value="ARRIVED">Arrived at Site</option>
            <option value="DELAYED">Delayed (Terlambat)</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed (POD)</option>
          </select>

          {/* Vendor Filter (Only for Admin/Marketing) */}
          {!isVendor && (
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden max-w-[180px] truncate"
            >
              <option value="ALL">Semua Vendor (10)</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Shipment ID & Trafo</th>
              <th className="py-3 px-4">Customer & Destinasi</th>
              <th className="py-3 px-4">Vendor Ekspedisi</th>
              <th className="py-3 px-4">Driver & Truk</th>
              <th className="py-3 px-4">Posisi Terakhir</th>
              <th className="py-3 px-4">ETA & Jadwal</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Tidak ada data pengiriman yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filteredShipments.map((shipment) => {
                const meta = getStatusMeta(shipment.currentStatus, shipment.isDelayed);

                return (
                  <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* ID & Trafo */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/dashboard/shipments/${shipment.id}`}
                        className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline"
                      >
                        {shipment.id}
                      </Link>
                      <div className="font-semibold text-slate-800 text-[11px] mt-0.5">
                        {shipment.transformer.transformerNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {shipment.transformer.capacityKVA} kVA • {(shipment.transformer.weightKg / 1000).toFixed(1)} Ton
                      </div>
                    </td>

                    {/* Customer & Destination */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate" title={shipment.customer.companyName}>
                        {shipment.customer.companyName}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate">
                        {shipment.destinationCity}, {shipment.customer.province}
                      </div>
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4 max-w-[170px]">
                      <div className="font-medium text-slate-800 truncate" title={shipment.vendor.name}>
                        {shipment.vendor.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{shipment.vendor.code}</span>
                    </td>

                    {/* Driver & Vehicle */}
                    <td className="py-3.5 px-4">
                      {shipment.driver ? (
                        <div>
                          <div className="font-semibold text-slate-800">{shipment.driver.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {shipment.vehicle?.plateNumber || '-'} ({shipment.vehicle?.type.split(' ')[0] || '-'})
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium text-[11px]">Belum Dialokasikan</span>
                      )}
                    </td>

                    {/* Current Location */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate" title={shipment.currentLocation.landmark}>
                        {shipment.currentLocation.landmark || shipment.currentLocation.city}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Update: {shipment.currentLocation.lastUpdatedAt.split(' ')[1] || '-'} WIB
                        {shipment.currentLocation.speedKmH ? ` • ${shipment.currentLocation.speedKmH} km/h` : ''}
                      </div>
                    </td>

                    {/* ETA */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{formatDate(shipment.expectedDeliveryDate)}</div>
                      <div className="text-[10px] text-slate-400">Berangkat: {shipment.shipmentDate}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${meta.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                        {meta.label}
                      </span>
                      {shipment.isDelayed && (
                        <div className="text-[10px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Terlambat
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/dashboard/shipments/${shipment.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold transition-colors text-[11px]"
                      >
                        Detail
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

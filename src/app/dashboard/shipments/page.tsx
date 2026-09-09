'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { getStatusMeta, formatDate } from '@/lib/utils';
import { CreateShipmentModal } from '@/components/shipments/CreateShipmentModal';
import {
  Truck,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Building,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import Link from 'next/link';

export default function ShipmentsListPage() {
  const { shipments, vendors } = useShipments();
  const { isVendor, currentVendor } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.transformer.transformerNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.transformer.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.destinationCity.toLowerCase().includes(search.toLowerCase()) ||
      (s.driver && s.driver.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.vehicle && s.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'DELAYED'
        ? s.isDelayed || s.currentStatus === 'DELAYED'
        : s.currentStatus === statusFilter;

    const matchesVendor = vendorFilter === 'ALL' ? true : s.vendorId === vendorFilter;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  const exportCsv = () => {
    const headers = ['Shipment ID', 'Transformer No', 'Capacity', 'Customer', 'Destination', 'Vendor', 'Driver', 'Vehicle', 'ETA', 'Status'];
    const rows = filteredShipments.map((s) => [
      s.id,
      s.transformer.transformerNumber,
      `${s.transformer.capacityKVA} kVA`,
      `"${s.customer.companyName}"`,
      s.destinationCity,
      `"${s.vendor.name}"`,
      s.driver?.name || '-',
      s.vehicle?.plateNumber || '-',
      s.expectedDeliveryDate,
      s.currentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transformer_shipments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            {isVendor ? `Tugas Pengiriman: ${currentVendor?.name}` : 'Manajemen Seluruh Pengiriman Trafo'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isVendor
              ? 'Kelola pengiriman yang ditugaskan kepada vendor Anda, input data driver & kendaraan, dan perbarui milestone.'
              : 'Daftar pengiriman trafo industri aktif, jadwal keberangkatan, armada, dan verifikasi dokumen penerimaan.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel / CSV</span>
          </button>

          {!isVendor && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengiriman Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, Serial Trafo, Customer, Driver, Nopol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="WAITING_PICKUP">Waiting Pickup (Pabrik)</option>
            <option value="IN_TRANSIT">In Transit (Perjalanan)</option>
            <option value="ARRIVED">Arrived at Site</option>
            <option value="DELAYED">Delayed (Terlambat)</option>
            <option value="DELIVERED">Delivered (Sampai Customer)</option>
            <option value="COMPLETED">Completed (POD Selesai)</option>
          </select>

          {/* Vendor Filter (Only for Admin/Marketing) */}
          {!isVendor && (
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden max-w-[200px] truncate"
            >
              <option value="ALL">Semua Vendor Ekspedisi</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Menampilkan <strong className="text-slate-900">{filteredShipments.length}</strong> pengiriman
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Shipment ID & Trafo</th>
                <th className="py-3.5 px-4">Customer & Tujuan</th>
                <th className="py-3.5 px-4">Vendor Ekspedisi</th>
                <th className="py-3.5 px-4">Driver & Truk</th>
                <th className="py-3.5 px-4">Posisi Terakhir</th>
                <th className="py-3.5 px-4">Jadwal & ETA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada pengiriman trafo yang ditemukan sesuai kriteria.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const meta = getStatusMeta(shipment.currentStatus, shipment.isDelayed);

                  return (
                    <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-4">
                        <Link
                          href={`/dashboard/shipments/${shipment.id}`}
                          className="font-bold text-xs text-blue-600 hover:text-blue-800 group-hover:underline flex items-center gap-1"
                        >
                          {shipment.id}
                        </Link>
                        <div className="font-semibold text-slate-900 text-xs mt-0.5">
                          {shipment.transformer.transformerNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {shipment.transformer.capacityKVA} kVA • {(shipment.transformer.weightKg / 1000).toFixed(1)} Ton • {shipment.transformer.serialNumber}
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-800 truncate" title={shipment.customer.companyName}>
                          {shipment.customer.companyName}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate">
                          {shipment.destinationCity}, {shipment.customer.province}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          PIC: {shipment.customer.customerPic}
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-[180px]">
                        <div className="font-semibold text-slate-800 truncate" title={shipment.vendor.name}>
                          {shipment.vendor.name}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                          {shipment.vendor.code}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {shipment.driver ? (
                          <div>
                            <div className="font-bold text-slate-800">{shipment.driver.name}</div>
                            <div className="text-[10px] text-slate-500">
                              {shipment.vehicle?.plateNumber} ({shipment.vehicle?.brand.split(' ')[0]})
                            </div>
                            <div className="text-[10px] text-slate-400">{shipment.driver.phone}</div>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Belum Ada Armada
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-bold text-slate-800 truncate" title={shipment.currentLocation.landmark}>
                          {shipment.currentLocation.landmark || shipment.currentLocation.city}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {shipment.currentLocation.city}, {shipment.currentLocation.province}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Update: {shipment.currentLocation.lastUpdatedAt}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{formatDate(shipment.expectedDeliveryDate)}</div>
                        <div className="text-[10px] text-slate-400">Berangkat: {shipment.shipmentDate}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${meta.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                          {meta.label}
                        </span>
                        {shipment.isDelayed && (
                          <div className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Terlambat
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/dashboard/shipments/${shipment.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold transition-all text-xs shadow-xs"
                        >
                          <span>Buka</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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

      <CreateShipmentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

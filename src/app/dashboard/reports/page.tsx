'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export default function ReportsPage() {
  const { shipments, vendors } = useShipments();
  const [reportType, setReportType] = useState<'SHIPMENT' | 'VENDOR' | 'DELAY' | 'POD'>('SHIPMENT');

  const delayedShipments = shipments.filter((s) => s.isDelayed || s.currentStatus === 'DELAYED');
  const podCompletedShipments = shipments.filter((s) => s.pod !== undefined);

  const handleExportCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'SHIPMENT') {
      headers = ['Shipment ID', 'Transformer', 'Capacity', 'Customer', 'Vendor', 'Driver', 'Vehicle', 'Departure', 'ETA', 'Status'];
      rows = shipments.map((s) => [
        s.id,
        s.transformer.transformerNumber,
        `${s.transformer.capacityKVA} kVA`,
        `"${s.customer.companyName}"`,
        `"${s.vendor.name}"`,
        s.driver?.name || '-',
        s.vehicle?.plateNumber || '-',
        s.departureDate || '-',
        s.expectedDeliveryDate,
        s.currentStatus,
      ]);
    } else if (reportType === 'VENDOR') {
      headers = ['Vendor Name', 'Code', 'Total Shipments', 'On-Time Rate (%)', 'Delays', 'Avg Delivery Hours', 'POD Rate (%)'];
      rows = vendors.map((v) => [
        `"${v.name}"`,
        v.code,
        String(v.totalShipments),
        `${v.onTimeRate}%`,
        String(v.delayedCount),
        `${v.avgDeliveryHours} Jam`,
        `${v.podCompletionRate}%`,
      ]);
    } else if (reportType === 'DELAY') {
      headers = ['Shipment ID', 'Customer', 'Vendor', 'ETA', 'Delay Hours', 'Reason', 'Action Taken'];
      rows = delayedShipments.map((s) => [
        s.id,
        `"${s.customer.companyName}"`,
        `"${s.vendor.name}"`,
        s.expectedDeliveryDate,
        `${Math.round((s.delayMinutes || 0) / 60)} Jam`,
        `"${s.delayReason || '-'}"`,
        `"${s.delayActionTaken || '-'}"`,
      ]);
    } else {
      headers = ['Shipment ID', 'Customer', 'Receiver PIC', 'Arrival Date', 'Condition', 'Submitted At'];
      rows = podCompletedShipments.map((s) => [
        s.id,
        `"${s.customer.companyName}"`,
        s.pod?.receiverName || '-',
        `${s.pod?.actualArrivalDate} ${s.pod?.actualArrivalTime}`,
        s.pod?.deliveryCondition || '-',
        s.pod?.submittedAt || '-',
      ]);
    }

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `report_${reportType.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Laporan Logistik & Dokumen Ekspor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh laporan performa pengiriman trafo dalam format Excel (CSV), cetak dokumen fisik, dan audit SLA vendor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Halaman (Print)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="p-1.5 bg-slate-200/80 rounded-2xl flex flex-wrap gap-1 text-xs font-bold">
        {[
          { key: 'SHIPMENT', label: '1. Laporan Pengiriman Trafo (Shipment Report)' },
          { key: 'VENDOR', label: '2. Laporan Performa 10 Vendor (Vendor SLA)' },
          { key: 'DELAY', label: '3. Laporan Insiden Keterlambatan (Delay Report)' },
          { key: 'POD', label: '4. Laporan Kepatuhan POD / BAST' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key as typeof reportType)}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${
              reportType === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Tabel Data Laporan: {reportType}
          </h3>
          <span className="text-xs text-slate-400">Periode: September 2026</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          {reportType === 'SHIPMENT' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Trafo & Kapasitas</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vendor Ekspedisi</th>
                  <th className="p-3">Driver & Truk</th>
                  <th className="p-3">ETA</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-600">{s.id}</td>
                    <td className="p-3 font-semibold">{s.transformer.transformerNumber} ({s.transformer.capacityKVA} kVA)</td>
                    <td className="p-3">{s.customer.companyName}</td>
                    <td className="p-3">{s.vendor.name}</td>
                    <td className="p-3">{s.driver?.name || '-'} ({s.vehicle?.plateNumber || '-'})</td>
                    <td className="p-3">{formatDate(s.expectedDeliveryDate)}</td>
                    <td className="p-3 font-bold">{s.currentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'VENDOR' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Peringkat</th>
                  <th className="p-3">Nama Vendor</th>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Total Pengiriman</th>
                  <th className="p-3">On-Time Rate</th>
                  <th className="p-3">Insiden Delay</th>
                  <th className="p-3">Rata-rata Waktu Tempuh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...vendors].sort((a, b) => b.onTimeRate - a.onTimeRate).map((v, i) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-center">#{i + 1}</td>
                    <td className="p-3 font-bold">{v.name}</td>
                    <td className="p-3 font-mono">{v.code}</td>
                    <td className="p-3">{v.totalShipments} Trafo</td>
                    <td className="p-3 font-extrabold text-emerald-600">{v.onTimeRate}%</td>
                    <td className="p-3 text-red-600 font-semibold">{v.delayedCount}x</td>
                    <td className="p-3">{v.avgDeliveryHours} Jam</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'DELAY' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Batas ETA</th>
                  <th className="p-3">Durasi Keterlambatan</th>
                  <th className="p-3">Penyebab Kendala</th>
                  <th className="p-3">Tindakan Mitigasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delayedShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-red-600">{s.id}</td>
                    <td className="p-3 font-semibold">{s.customer.companyName}</td>
                    <td className="p-3">{s.vendor.name}</td>
                    <td className="p-3">{formatDate(s.expectedDeliveryDate)}</td>
                    <td className="p-3 font-bold text-red-700">{Math.round((s.delayMinutes || 0) / 60)} Jam</td>
                    <td className="p-3 text-slate-700">{s.delayReason}</td>
                    <td className="p-3 text-slate-600 text-[11px]">{s.delayActionTaken || 'Dalam koordinasi'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'POD' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Customer Site</th>
                  <th className="p-3">PIC Penerima</th>
                  <th className="p-3">Waktu Tiba Aktual</th>
                  <th className="p-3">Kondisi Serah Terima</th>
                  <th className="p-3">Status BAST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {podCompletedShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-600">{s.id}</td>
                    <td className="p-3 font-semibold">{s.customer.companyName}</td>
                    <td className="p-3">{s.pod?.receiverName} ({s.pod?.receiverPosition})</td>
                    <td className="p-3">{s.pod?.actualArrivalDate} {s.pod?.actualArrivalTime}</td>
                    <td className="p-3 font-bold text-emerald-600">{s.pod?.deliveryCondition}</td>
                    <td className="p-3 text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ditandatangani
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

interface IncidentReportModalProps {
  shipmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function IncidentReportModal({ shipmentId, isOpen, onClose }: IncidentReportModalProps) {
  const { reportIncident, getShipmentById } = useShipments();
  const shipment = getShipmentById(shipmentId);

  const [problemType, setProblemType] = useState('Weather Delay / Cuaca Buruk');
  const [description, setDescription] = useState(
    'Terjadi penundaan penyeberangan kapal ferry / ombak tinggi sehingga jadwal keberangkatan tertunda 4 jam.'
  );
  const [currentLocation, setCurrentLocation] = useState(
    shipment?.currentLocation.landmark || 'Pelabuhan Merak-Bakauheni'
  );
  const [actionTaken, setActionTaken] = useState(
    'Driver telah berkoordinasi dengan petugas ASDP dan tim pengawalan rute untuk slot prioritas kargo alat berat.'
  );

  if (!isOpen || !shipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportIncident(shipmentId, `[${problemType}] ${description}`, actionTaken);
    alert('Laporan kendala berhasil dikirim! Sistem telah menandai pengiriman ini sebagai DELAYED.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-red-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-950">Lapor Kendala Pengiriman (Incident / Delay)</h3>
              <p className="text-xs text-red-700">Shipment ID: {shipment.id} — {shipment.transformer.transformerNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori Masalah / Kendala</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="Weather Delay / Cuaca Buruk">Weather Delay (Cuaca Buruk / Gelombang / Banjir)</option>
              <option value="Vehicle Breakdown / Kerusakan Truk">Vehicle Breakdown (Kerusakan Ban / Hidrolik / Mesin)</option>
              <option value="Traffic Jam / Hambatan Rute">Traffic Jam (Jalur Macet Parah / Longsor)</option>
              <option value="Escort & Police Permit Issue">Escort & Police Permit Issue (Kendala Izin Pengawalan)</option>
              <option value="Customer Site Not Ready">Customer Site Not Ready (Lokasi Pondasi Belum Siap)</option>
              <option value="Minor Accident / Insiden Fisik">Minor Accident / Gesekan Fisik</option>
              <option value="Other Issue">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Posisi Saat Kendala Terjadi</label>
            <input
              type="text"
              required
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Detail Masalah</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tindakan Penanganan yang Sedang Dijalankan</label>
            <textarea
              rows={2}
              required
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-bold shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              Kirim Laporan & Tandai Delayed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

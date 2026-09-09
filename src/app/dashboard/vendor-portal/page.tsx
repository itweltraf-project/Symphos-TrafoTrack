'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { getStatusMeta, formatDate } from '@/lib/utils';
import { PodModal } from '@/components/shipments/PodModal';
import { IncidentReportModal } from '@/components/shipments/IncidentReportModal';
import {
  Smartphone,
  Navigation,
  Clock,
  Camera,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Truck,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function MobileVendorPortalPage() {
  const { shipments, updateLocation, updateStatus, addPhoto } = useShipments();
  const { currentUser, currentVendor, isVendor } = useAuth();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(shipments[0]?.id || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Form states
  const [cityInput, setCityInput] = useState('');
  const [landmarkInput, setLandmarkInput] = useState('');
  const [speedInput, setSpeedInput] = useState('45');
  const [statusSelect, setStatusSelect] = useState('IN_TRANSIT');
  const [statusNotes, setStatusNotes] = useState('');
  const [photoTitle, setPhotoTitle] = useState('Pengecekan Istirahat Rest Area');

  const currentShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const handleUpdateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShipment) return;
    updateLocation(currentShipment.id, {
      city: cityInput || currentShipment.currentLocation.city,
      province: currentShipment.currentLocation.province,
      landmark: landmarkInput || 'Pos Lintas Pantura / Tol',
      lat: currentShipment.currentLocation.lat + 0.02,
      lng: currentShipment.currentLocation.lng + 0.02,
      speedKmH: Number(speedInput) || 40,
    });
    alert('Lokasi berhasil diupdate via mobile interface!');
    setShowLocationModal(false);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShipment) return;
    updateStatus(currentShipment.id, statusSelect as any, statusNotes);
    alert(`Status shipment berhasil diubah ke ${statusSelect}!`);
    setShowStatusModal(false);
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShipment) return;
    addPhoto(currentShipment.id, {
      title: photoTitle,
      category: 'In Transit',
      url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80',
      location: currentShipment.currentLocation.city,
      uploadedBy: currentUser.name,
    });
    alert('Foto lapangan berhasil diunggah!');
    setShowPhotoModal(false);
  };

  if (!currentShipment) {
    return (
      <div className="p-8 text-center text-slate-500">
        Tidak ada pengiriman yang dialokasikan ke vendor Anda saat ini.
      </div>
    );
  }

  const meta = getStatusMeta(currentShipment.currentStatus, currentShipment.isDelayed);

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Mobile Device Frame Header */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs">Mobile Driver / Vendor Interface</div>
            <div className="text-[10px] text-slate-400">
              {isVendor ? currentVendor?.name : 'Simulasi Tampilan Smartphone Driver'}
            </div>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
          Online GPS
        </span>
      </div>

      {/* Shipment Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Pilih Pengiriman yang Sedang Dibawa:
        </label>
        <select
          value={selectedShipmentId}
          onChange={(e) => setSelectedShipmentId(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-hidden"
        >
          {shipments.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.transformer.transformerNumber} ({s.customer.companyName.split(' ')[0]})
            </option>
          ))}
        </select>
      </div>

      {/* Current Shipment Status Card (Prominent display) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700/80 space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Nomor Pengiriman</div>
            <div className="text-2xl font-black text-white tracking-tight">{currentShipment.id}</div>
            <div className="text-xs text-slate-300 font-semibold mt-0.5">
              Trafo: {currentShipment.transformer.transformerNumber} ({currentShipment.transformer.capacityKVA} kVA)
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeClass}`}>
            {meta.label}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Posisi Terakhir:
            </span>
            <span className="font-bold text-white">
              {currentShipment.currentLocation.landmark || currentShipment.currentLocation.city}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Estimasi Tiba (ETA):
            </span>
            <span className="font-bold text-emerald-300">{currentShipment.expectedDeliveryDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tujuan Akhir:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[180px]">
              {currentShipment.customer.companyName}
            </span>
          </div>
        </div>

        {currentShipment.isDelayed && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Status: Terlambat</span>
              <p className="text-[11px] text-red-300 mt-0.5">{currentShipment.delayReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5 Big Touch Buttons (Section 24 specification) */}
      <div className="space-y-3">
        <button
          onClick={() => setShowLocationModal(true)}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all"
        >
          <Navigation className="w-5 h-5" />
          <span>[ UPDATE LOCATION ]</span>
        </button>

        <button
          onClick={() => setShowStatusModal(true)}
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 active:scale-98 text-white font-black text-sm shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 transition-all"
        >
          <Clock className="w-5 h-5 text-amber-400" />
          <span>[ UPDATE STATUS ]</span>
        </button>

        <button
          onClick={() => setShowPhotoModal(true)}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all"
        >
          <Camera className="w-5 h-5" />
          <span>[ UPLOAD FOTO LAPANGAN ]</span>
        </button>

        <button
          onClick={() => setIsIncidentModalOpen(true)}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 transition-all"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>[ LAPOR KENDALA / DELAY ]</span>
        </button>

        <button
          onClick={() => setIsPodModalOpen(true)}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>[ INPUT PROOF OF DELIVERY (POD) ]</span>
        </button>
      </div>

      {/* Modal: Update Location */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900">Input Lokasi Terkini Driver</h3>
            <form onSubmit={handleUpdateLocation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kota / Kabupaten Saat Ini</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cirebon, Brebes, Pekalongan"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Titik Patokan / KM Tol / Rest Area</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rest Area KM 207 Tol Palikanci"
                  value={landmarkInput}
                  onChange={(e) => setLandmarkInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kecepatan Tempuh (km/jam)</label>
                <input
                  type="number"
                  value={speedInput}
                  onChange={(e) => setSpeedInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900">Perbarui Milestone Perjalanan</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Status Baru</label>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="LOADED">LOADED (Trafo Siap Berangkat)</option>
                  <option value="DEPARTED">DEPARTED (Berangkat dari Pabrik)</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (Dalam Perjalanan)</option>
                  <option value="AT_TRANSIT_HUB">AT_TRANSIT_HUB (Pengecekan Rest Area)</option>
                  <option value="APPROACHING_DESTINATION">APPROACHING_DESTINATION (Mendekati Lokasi)</option>
                  <option value="ARRIVED">ARRIVED (Tiba di Site Customer)</option>
                  <option value="UNLOADING">UNLOADING (Proses Lifting Crane)</option>
                  <option value="DELIVERED">DELIVERED (Trafo Diserahkan)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Kondisi armada dan trafo aman terkendali..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl">
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Photo */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900">Upload Foto Lapangan</h3>
            <form onSubmit={handleUploadPhoto} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Keterangan Foto</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="font-bold text-slate-700 block">Kamera Smartphone Terhubung</span>
                <span className="text-[10px] text-slate-400">Simulasi upload file foto 4.2 MB</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">
                  Unggah Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <PodModal
        shipmentId={currentShipment.id}
        isOpen={isPodModalOpen}
        onClose={() => setIsPodModalOpen(false)}
      />

      <IncidentReportModal
        shipmentId={currentShipment.id}
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
      />
    </div>
  );
}

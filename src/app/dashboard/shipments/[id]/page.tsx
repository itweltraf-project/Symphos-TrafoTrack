'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { getStatusMeta, formatDate, formatWeight, formatCapacity } from '@/lib/utils';
import { TrackingTimeline } from '@/components/shipments/TrackingTimeline';
import { ConditionChecklist } from '@/components/shipments/ConditionChecklist';
import { InteractiveTrackingMap } from '@/components/map/InteractiveTrackingMap';
import { PodModal } from '@/components/shipments/PodModal';
import { IncidentReportModal } from '@/components/shipments/IncidentReportModal';
import { ShipmentStatus } from '@/types';
import {
  Truck,
  Zap,
  Building,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Printer,
  ShieldCheck,
  User,
  Navigation,
  FileCheck,
  Download,
  Phone,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params?.id as string;

  const { shipments, getShipmentById, updateStatus, updateLocation } = useShipments();
  const { currentUser, isVendor } = useAuth();

  const shipment = getShipmentById(shipmentId);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'transformer' | 'tracking' | 'fleet' | 'documents' | 'photos' | 'pod' | 'activity'
  >('overview');

  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [showLocationUpdateModal, setShowLocationUpdateModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  // Form state for updating location manually
  const [newCity, setNewCity] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newSpeed, setNewSpeed] = useState('40');

  // Form state for updating status manually
  const [newStatusSelect, setNewStatusSelect] = useState<ShipmentStatus>('IN_TRANSIT');
  const [statusNotes, setStatusNotes] = useState('');

  if (!shipment) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Shipment {shipmentId} Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Mungkin nomor pengiriman telah dihapus atau Anda tidak memiliki akses ke vendor ini.</p>
        <Link
          href="/dashboard/shipments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pengiriman
        </Link>
      </div>
    );
  }

  const meta = getStatusMeta(shipment.currentStatus, shipment.isDelayed);

  const handleQuickLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLocation(shipment.id, {
      city: newCity || shipment.currentLocation.city,
      province: shipment.currentLocation.province,
      landmark: newLandmark || shipment.currentLocation.landmark,
      lat: shipment.currentLocation.lat + (Math.random() - 0.5) * 0.05,
      lng: shipment.currentLocation.lng + (Math.random() - 0.5) * 0.05,
      speedKmH: Number(newSpeed) || 0,
    });
    alert('Lokasi berhasil diperbarui!');
    setShowLocationUpdateModal(false);
  };

  const handleQuickStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(shipment.id, newStatusSelect, statusNotes);
    alert(`Status berhasil diperbarui ke ${newStatusSelect}!`);
    setShowStatusUpdateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pengiriman</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Top Banner Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Zap className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{shipment.id}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                  {meta.label}
                </span>
                {shipment.isDelayed && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Terlambat ({shipment.delayMinutes ? `${Math.round(shipment.delayMinutes / 60)} Jam` : 'Overdue'})
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">
                  {shipment.transformer.transformerNumber} ({formatCapacity(shipment.transformer.capacityKVA)})
                </span>
                <span>• Serial: {shipment.transformer.serialNumber}</span>
                <span>• Berat: {formatWeight(shipment.transformer.weightKg)}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Vendor & Staff */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowLocationUpdateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Update Lokasi</span>
            </button>

            <button
              onClick={() => setShowStatusUpdateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>

            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Lapor Kendala</span>
            </button>

            <button
              onClick={() => setIsPodModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>{shipment.pod ? 'Lihat / Edit POD' : 'Input Bukti POD'}</span>
            </button>
          </div>
        </div>

        {/* Quick Route Summary Card */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Customer Penerima:</span>
            <span className="font-bold text-slate-900 leading-tight block mt-0.5">{shipment.customer.companyName}</span>
            <span className="text-slate-500 text-[10px]">PIC: {shipment.customer.customerPic}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Vendor Ekspedisi:</span>
            <span className="font-bold text-slate-900 leading-tight block mt-0.5">{shipment.vendor.name}</span>
            <span className="text-slate-500 text-[10px]">Kode: {shipment.vendor.code}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Armada & Driver:</span>
            <span className="font-bold text-slate-900 leading-tight block mt-0.5">
              {shipment.driver ? shipment.driver.name : 'Belum Ditugaskan'}
            </span>
            <span className="text-slate-500 text-[10px]">
              {shipment.vehicle ? `${shipment.vehicle.plateNumber} (${shipment.vehicle.type})` : '-'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Estimasi Tiba (ETA):</span>
            <span className="font-bold text-emerald-600 leading-tight block mt-0.5">
              {formatDate(shipment.expectedDeliveryDate)}
            </span>
            <span className="text-slate-500 text-[10px]">Berangkat: {shipment.shipmentDate}</span>
          </div>
        </div>

        {/* Delay notification banner if delayed */}
        {shipment.isDelayed && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Keterangan Kendala Keterlambatan: </span>
              {shipment.delayReason || 'Melewati estimasi batas waktu tiba (ETA).'}
              {shipment.delayActionTaken && (
                <div className="mt-1 text-red-800 text-[11px]">
                  <strong>Tindakan Mitigasi: </strong>
                  {shipment.delayActionTaken}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 8 Tab Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl px-4 flex overflow-x-auto scrollbar-thin">
        {[
          { key: 'overview', label: 'Overview Pengiriman', icon: Zap },
          { key: 'transformer', label: 'Transformer & Kondisi', icon: Zap },
          { key: 'tracking', label: 'Tracking & Peta Live', icon: MapPin },
          { key: 'fleet', label: 'Driver & Kendaraan', icon: Truck },
          { key: 'documents', label: 'Dokumen Surat Jalan', icon: FileText },
          { key: 'photos', label: 'Foto Perjalanan', icon: Camera },
          { key: 'pod', label: 'Proof of Delivery (POD)', icon: FileCheck },
          { key: 'activity', label: 'Activity Audit Log', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 py-4 px-4 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-transparent">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipment Specifications */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Informasi Dokumen Referensi
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. Delivery Order (DO):</span>
                    <span className="font-bold text-slate-800">{shipment.deliveryOrderNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. Sales Order (SO):</span>
                    <span className="font-bold text-slate-800">{shipment.salesOrderNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. Purchase Order (PO):</span>
                    <span className="font-bold text-slate-800">{shipment.poNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tanggal Surat Jalan:</span>
                    <span className="font-bold text-slate-800">{shipment.shipmentDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 block text-[10px] mb-1">Rute Pengiriman:</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{shipment.originAddress}</span>
                    </div>
                    <div className="border-l-2 border-dashed border-slate-300 ml-1.5 h-4" />
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{shipment.destinationAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Details */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Detail Customer & Lokasi Gardu Induk
                </h3>
                <div className="text-xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">{shipment.customer.companyName}</div>
                  <div className="text-slate-600 leading-relaxed">{shipment.customer.address}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">PIC Penerima:</span>
                      <span className="font-semibold">{shipment.customer.customerPic}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kontak Telepon:</span>
                      <span className="font-semibold">{shipment.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Koordinat Site Gardu:</span>
                  <span className="font-mono font-bold text-blue-600">
                    {shipment.customer.latitude}, {shipment.customer.longitude}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InteractiveTrackingMap shipments={[shipment]} selectedShipmentId={shipment.id} compact />
              </div>
              <div>
                <TrackingTimeline history={shipment.trackingHistory} currentStatus={shipment.currentStatus} isDelayed={shipment.isDelayed} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transformer & Condition Inspection */}
        {activeTab === 'transformer' && (
          <div className="space-y-6">
            {/* Transformer Specs Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Spesifikasi Teknis Unit Transformer
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Nomor Trafo:</span>
                  <span className="font-bold text-slate-900 text-sm">{shipment.transformer.transformerNumber}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Serial Number:</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{shipment.transformer.serialNumber}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Kapasitas Daya:</span>
                  <span className="font-bold text-amber-600 text-sm">{formatCapacity(shipment.transformer.capacityKVA)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Berat Bersih:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatWeight(shipment.transformer.weightKg)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tipe Transformer:</span>
                  <span className="font-semibold text-slate-800">{shipment.transformer.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tegangan Rating:</span>
                  <span className="font-semibold text-slate-800">{shipment.transformer.voltageRating}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tipe Minyak Trafo:</span>
                  <span className="font-semibold text-slate-800">{shipment.transformer.oilType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Metode Pendingin:</span>
                  <span className="font-semibold text-slate-800">{shipment.transformer.coolingType}</span>
                </div>
              </div>
            </div>

            {/* Condition Checklist Component */}
            <ConditionChecklist inspection={shipment.preDeliveryInspection} />
          </div>
        )}

        {/* Tab 3: Tracking & Map */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <InteractiveTrackingMap shipments={[shipment]} selectedShipmentId={shipment.id} />
            <TrackingTimeline history={shipment.trackingHistory} currentStatus={shipment.currentStatus} isDelayed={shipment.isDelayed} />
          </div>
        )}

        {/* Tab 4: Fleet & Driver */}
        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Data Pengemudi (Driver Logistik Ekspedisi)
              </h3>
              {shipment.driver ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base">
                      {shipment.driver.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{shipment.driver.name}</div>
                      <div className="text-slate-500">{shipment.driver.simType} • SIM No: {shipment.driver.simNumber}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Nomor Telepon:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {shipment.driver.phone}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Kontak Darurat:</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">{shipment.driver.emergencyContact}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">Driver belum ditugaskan oleh vendor ekspedisi.</div>
              )}
            </div>

            {/* Vehicle Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                Data Armada & Kendaraan Angkut
              </h3>
              {shipment.vehicle ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900 tracking-tight">{shipment.vehicle.plateNumber}</div>
                      <div className="text-slate-500 font-medium">{shipment.vehicle.brand} — {shipment.vehicle.model}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {shipment.vehicle.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Kapasitas Angkut:</span>
                      <span className="font-bold text-slate-900">{shipment.vehicle.capacityTons} Ton</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Dimensi Bak:</span>
                      <span className="font-bold text-slate-900">{shipment.vehicle.dimensions.length}m x {shipment.vehicle.dimensions.width}m</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Device GPS ID:</span>
                      <span className="font-mono font-bold text-blue-600">{shipment.vehicle.gpsId}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">Armada belum dialokasikan.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Documents */}
        {activeTab === 'documents' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Dokumen Legalitas & Surat Jalan Pengiriman
                </h3>
                <p className="text-xs text-slate-500">Berkas resmi untuk verifikasi di jalan dan serah terima customer.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shipment.documents.length > 0 ? (
                shipment.documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-800">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.type} • {doc.fileSize} • Upload: {doc.uploadedAt}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh ${doc.name}`)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      title="Download Dokumen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-8 text-center text-slate-400 text-xs">
                  Belum ada dokumen yang diunggah untuk pengiriman ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Photos */}
        {activeTab === 'photos' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Galeri Foto Perjalanan & Dokumentasi Lapangan
                </h3>
                <p className="text-xs text-slate-500">Foto pre-departure, lashing, pengecekan rest area, dan unloader.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {shipment.photos.length > 0 ? (
                shipment.photos.map((ph) => (
                  <div key={ph.id} className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs hover:shadow-md transition-all">
                    <div className="h-44 bg-slate-200 overflow-hidden">
                      <img src={ph.url} alt={ph.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3 text-xs">
                      <div className="font-bold text-slate-800">{ph.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{ph.location} • {ph.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center text-slate-400 text-xs">Belum ada foto yang diunggah.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 7: Proof of Delivery (POD) */}
        {activeTab === 'pod' && (
          <div className="space-y-6">
            {shipment.pod ? (
              <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Proof of Delivery (POD) Terverifikasi</h3>
                      <p className="text-xs text-slate-500">Trafo telah diserahterimakan kepada pihak customer resmi.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak BAST</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Waktu Tiba Aktual:</span>
                    <span className="font-bold text-slate-900">{shipment.pod.actualArrivalDate} {shipment.pod.actualArrivalTime} WIB</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Nama Penerima:</span>
                    <span className="font-bold text-slate-900">{shipment.pod.receiverName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Jabatan PIC:</span>
                    <span className="font-bold text-slate-900">{shipment.pod.receiverPosition}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Kondisi Fisik Akhir:</span>
                    <span className="font-bold text-emerald-600">{shipment.pod.deliveryCondition}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px] mb-1">Catatan Serah Terima:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{shipment.pod.deliveryNotes}</p>
                </div>

                {/* Digital Signature and Receipt Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="text-xs font-bold text-slate-800 mb-2">Tanda Tangan Elektronik Penerima</div>
                    <div className="h-28 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                      <img src={shipment.pod.signatureUrl} alt="Signature" className="h-16 opacity-80" />
                    </div>
                    <div className="text-[10px] text-slate-400 text-center mt-2">
                      Tertanda secara digital oleh {shipment.pod.receiverName} ({shipment.pod.submittedAt} WIB)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="text-xs font-bold text-slate-800 mb-2">Foto Berita Acara Serah Terima (BAST)</div>
                    <div className="h-28 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={shipment.pod.photos[0]?.url || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'}
                        alt="BAST"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Proof of Delivery Belum Diinput</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Setelah trafo sampai di customer dan selesai proses unloading, vendor dapat menginput konfirmasi penerimaan dan mengunggah tanda tangan digital.
                  </p>
                </div>
                <button
                  onClick={() => setIsPodModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Input Proof of Delivery Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Activity Audit Log */}
        {activeTab === 'activity' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Catatan Histori & Activity Audit Log
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {shipment.activityLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-800">{log.action}</div>
                    {log.details && <div className="text-slate-500 text-[11px] mt-0.5">{log.details}</div>}
                    <div className="text-[10px] text-slate-400 mt-1">
                      Oleh: <strong className="text-slate-600">{log.user}</strong> ({log.role})
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Location Update Modal */}
      {showLocationUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Perbarui Posisi Terkini (Manual GPS)</h3>
              <button onClick={() => setShowLocationUpdateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleQuickLocationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cirebon, Brebes, Tegal"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Landmark / Titik Istirahat / KM Tol</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rest Area KM 207A Tol Palikanci"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kecepatan Armada (km/jam)</label>
                <input
                  type="number"
                  value={newSpeed}
                  onChange={(e) => setNewSpeed(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationUpdateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Status Update Modal */}
      {showStatusUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Perbarui Milestone Status</h3>
              <button onClick={() => setShowStatusUpdateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleQuickStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Status Baru</label>
                <select
                  value={newStatusSelect}
                  onChange={(e) => setNewStatusSelect(e.target.value as ShipmentStatus)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                >
                  <option value="WAITING_PICKUP">WAITING_PICKUP</option>
                  <option value="VEHICLE_ASSIGNED">VEHICLE_ASSIGNED</option>
                  <option value="DRIVER_ASSIGNED">DRIVER_ASSIGNED</option>
                  <option value="PICKUP">PICKUP (Tiba di Pabrik)</option>
                  <option value="LOADED">LOADED (Selesai Lashing)</option>
                  <option value="DEPARTED">DEPARTED (Berangkat)</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (Dalam Perjalanan)</option>
                  <option value="AT_TRANSIT_HUB">AT_TRANSIT_HUB (Rest Area)</option>
                  <option value="APPROACHING_DESTINATION">APPROACHING_DESTINATION</option>
                  <option value="ARRIVED">ARRIVED (Tiba di Customer)</option>
                  <option value="UNLOADING">UNLOADING (Proses Lifting)</option>
                  <option value="DELIVERED">DELIVERED (Serah Terima)</option>
                  <option value="COMPLETED">COMPLETED (POD Selesai)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan progres armada..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStatusUpdateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Update Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof of Delivery (POD) Modal */}
      <PodModal
        shipmentId={shipment.id}
        isOpen={isPodModalOpen}
        onClose={() => setIsPodModalOpen(false)}
      />

      {/* Incident / Delay Modal */}
      <IncidentReportModal
        shipmentId={shipment.id}
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
      />
    </div>
  );
}

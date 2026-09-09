'use client';

import React, { useState, useRef } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { ProofOfDelivery } from '@/types';
import { CheckCircle2, X, Camera, PenTool, FileCheck, Upload } from 'lucide-react';

interface PodModalProps {
  shipmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PodModal({ shipmentId, isOpen, onClose }: PodModalProps) {
  const { submitPod, getShipmentById } = useShipments();
  const { currentUser } = useAuth();
  const shipment = getShipmentById(shipmentId);

  const [formData, setFormData] = useState({
    actualArrivalDate: new Date().toISOString().split('T')[0],
    actualArrivalTime: '14:30',
    receiverName: shipment?.customer.customerPic || 'Bapak Ir. Agus Pratama',
    receiverPosition: 'Lead Substation Electrical Engineer',
    receiverPhone: shipment?.customer.phone || '+62 812-2233-4455',
    deliveryNotes: 'Trafo telah tiba di lokasi gardu induk, proses unloading ke bantalan pondasi berjalan lancar tanpa goresan dan tanpa rembesan oli.',
    deliveryCondition: 'Good / Sempurna' as const,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen || !shipment) return null;

  // Simple Canvas Drawing for Digital Signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasSignature(true);
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const podData: ProofOfDelivery = {
      actualArrivalDate: formData.actualArrivalDate,
      actualArrivalTime: formData.actualArrivalTime,
      receiverName: formData.receiverName,
      receiverPosition: formData.receiverPosition,
      receiverPhone: formData.receiverPhone,
      deliveryNotes: formData.deliveryNotes,
      deliveryCondition: formData.deliveryCondition,
      signatureUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=verified-signature',
      podDocumentUrl: '#',
      photos: [
        {
          title: 'Trafo Tiba di Site Substation',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'Unloading ke Bantalan Trafo',
          url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
        },
        {
          title: 'BAST Ditandatangani Penerima',
          url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        },
      ],
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      submittedBy: `${currentUser.name} (${currentUser.role})`,
    };

    submitPod(shipmentId, podData);
    alert('Proof of Delivery (POD) berhasil disimpan! Status otomatis beralih ke COMPLETED.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Input Proof of Delivery (POD) — {shipment.id}
              </h3>
              <p className="text-xs text-slate-500">
                Konfirmasi serah terima trafo ke pihak customer {shipment.customer.companyName}.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Tiba Aktual</label>
              <input
                type="date"
                required
                value={formData.actualArrivalDate}
                onChange={(e) => setFormData({ ...formData, actualArrivalDate: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Waktu Tiba Aktual</label>
              <input
                type="time"
                required
                value={formData.actualArrivalTime}
                onChange={(e) => setFormData({ ...formData, actualArrivalTime: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama PIC Penerima</label>
              <input
                type="text"
                required
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jabatan / Posisi</label>
              <input
                type="text"
                required
                value={formData.receiverPosition}
                onChange={(e) => setFormData({ ...formData, receiverPosition: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">No. HP / Kontak</label>
              <input
                type="text"
                required
                value={formData.receiverPhone}
                onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kondisi Fisik Trafo Saat Diterima</label>
            <select
              value={formData.deliveryCondition}
              onChange={(e) =>
                setFormData({ ...formData, deliveryCondition: e.target.value as typeof formData.deliveryCondition })
              }
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="Good / Sempurna">Good / Sempurna (Tidak Ada Cacat)</option>
              <option value="Minor Packaging Damage">Minor Packaging Damage (Kondisi Unit Utama Aman)</option>
              <option value="Incident Reported">Incident Reported (Ada Catatan Khusus)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Serah Terima (Delivery Notes)</label>
            <textarea
              rows={3}
              value={formData.deliveryNotes}
              onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
            />
          </div>

          {/* Digital Signature Pad */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-blue-600" />
                Tanda Tangan Digital Penerima Customer (Goreskan di Kotak)
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] text-red-600 hover:underline"
              >
                Hapus & Ulangi
              </button>
            </div>
            <div className="border border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={580}
                height={130}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-28 cursor-crosshair"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none text-xs">
                  Gunakan mouse / layar sentuh untuk tanda tangan di sini
                </div>
              )}
            </div>
          </div>

          {/* Photo upload mock */}
          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1">
            <Camera className="w-5 h-5 text-slate-400 mx-auto" />
            <div className="font-semibold text-slate-700">Dokumentasi Serah Terima Telah Disiapkan</div>
            <div className="text-[11px] text-slate-400">
              3 Foto (Foto Unloading, Foto Dudukan Trafo, Foto BAST Bertanda Tangan)
            </div>
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
              className="px-5 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Konfirmasi & Selesaikan POD (Completed)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

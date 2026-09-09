'use client';

import React, { useState, useEffect } from 'react';
import { Driver } from '@/types';
import { useShipments } from '@/context/ShipmentContext';
import { X, User, Phone, Check, Shield, Award } from 'lucide-react';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverToEdit?: Driver | null;
}

export function DriverModal({ isOpen, onClose, driverToEdit }: DriverModalProps) {
  const { vendors, addDriver, updateDriver } = useShipments();

  const [formData, setFormData] = useState({
    name: '',
    vendorId: vendors[0]?.id || 'VND-001',
    phone: '',
    simNumber: '',
    simType: 'BII Umum' as Driver['simType'],
    emergencyContact: '',
    status: 'Available' as Driver['status'],
  });

  useEffect(() => {
    if (driverToEdit) {
      setFormData({
        name: driverToEdit.name,
        vendorId: driverToEdit.vendorId,
        phone: driverToEdit.phone,
        simNumber: driverToEdit.simNumber,
        simType: driverToEdit.simType,
        emergencyContact: driverToEdit.emergencyContact,
        status: driverToEdit.status,
      });
    } else {
      setFormData({
        name: '',
        vendorId: vendors[0]?.id || 'VND-001',
        phone: '',
        simNumber: `SIM-BII-${Math.floor(100000 + Math.random() * 900000)}`,
        simType: 'BII Umum',
        emergencyContact: '',
        status: 'Available',
      });
    }
  }, [driverToEdit, isOpen, vendors]);

  if (!isOpen) return null;

  const isEditing = !!driverToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama pengemudi wajib diisi!');
      return;
    }

    if (isEditing && driverToEdit) {
      updateDriver(driverToEdit.id, formData);
    } else {
      addDriver(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Ubah Data Pengemudi' : 'Tambah Pengemudi Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Mengubah profil pengemudi: ${driverToEdit?.name}`
                  : 'Registrasi data pengemudi bersertifikasi armada trafo.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Nama Lengkap Pengemudi *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Joko Prasetyo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              Mitra Vendor Ekspedisi Terikat *
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                No. Telepon / WhatsApp *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 0812-3456-7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                Golongan Lisensi SIM
              </label>
              <select
                value={formData.simType}
                onChange={(e) => setFormData({ ...formData, simType: e.target.value as Driver['simType'] })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
              >
                <option value="BII Umum">BII Umum (Wajib Heavy Hauler)</option>
                <option value="BII">BII (Tronton Standar)</option>
                <option value="BI">BI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Registrasi SIM</label>
              <input
                type="text"
                required
                placeholder="e.g. SIM-BII-881920"
                value={formData.simNumber}
                onChange={(e) => setFormData({ ...formData, simNumber: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Penugasan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
              >
                <option value="Available">Available (Tersedia / Siap)</option>
                <option value="On Duty">On Duty (Sedang Bertugas)</option>
                <option value="Rest">Rest (Istirahat / Off)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kontak Darurat (Keluarga / Vendor)</label>
            <input
              type="text"
              placeholder="e.g. Istri: Siti Rahma (0813-9988-7766)"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Simpan Perubahan' : 'Tambah Pengemudi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types';
import { useShipments } from '@/context/ShipmentContext';
import { X, Truck, Check, Shield, Navigation } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: Vehicle | null;
}

export function VehicleModal({ isOpen, onClose, vehicleToEdit }: VehicleModalProps) {
  const { vendors, addVehicle, updateVehicle } = useShipments();

  const [formData, setFormData] = useState({
    plateNumber: '',
    vendorId: vendors[0]?.id || 'VND-001',
    type: 'Tronton Lowbed' as Vehicle['type'],
    brand: 'Volvo',
    model: 'FH16 750 Heavy Duty',
    capacityTons: 60,
    dimensions: {
      length: 16.5,
      width: 3.2,
      height: 1.1,
    },
    gpsId: '',
    status: 'Ready' as Vehicle['status'],
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        plateNumber: vehicleToEdit.plateNumber,
        vendorId: vehicleToEdit.vendorId,
        type: vehicleToEdit.type,
        brand: vehicleToEdit.brand,
        model: vehicleToEdit.model,
        capacityTons: vehicleToEdit.capacityTons,
        dimensions: {
          length: vehicleToEdit.dimensions.length,
          width: vehicleToEdit.dimensions.width,
          height: vehicleToEdit.dimensions.height,
        },
        gpsId: vehicleToEdit.gpsId,
        status: vehicleToEdit.status,
      });
    } else {
      setFormData({
        plateNumber: '',
        vendorId: vendors[0]?.id || 'VND-001',
        type: 'Tronton Lowbed',
        brand: 'Volvo',
        model: 'FH16 750 Heavy Duty',
        capacityTons: 60,
        dimensions: {
          length: 16.5,
          width: 3.2,
          height: 1.1,
        },
        gpsId: `GPS-TRK-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Ready',
      });
    }
  }, [vehicleToEdit, isOpen, vendors]);

  if (!isOpen) return null;

  const isEditing = !!vehicleToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plateNumber.trim()) {
      alert('Nomor polisi plat armada wajib diisi!');
      return;
    }

    if (isEditing && vehicleToEdit) {
      updateVehicle(vehicleToEdit.id, formData);
    } else {
      addVehicle(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Ubah Data Armada Truk' : 'Tambah Armada Truk Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Mengubah spesifikasi unit: ${vehicleToEdit?.plateNumber}`
                  : 'Registrasi unit kendaraan pengangkut trafo / heavy-haul transport.'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                Nomor Polisi (Plat Truk) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B 9921 UXZ"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-black tracking-wider text-slate-900 uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                Mitra Vendor Ekspedisi *
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Tipe Armada</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
              >
                <option value="Tronton Lowbed">Tronton Lowbed</option>
                <option value="Multi-Axle Heavy Hauler">Multi-Axle Heavy Hauler</option>
                <option value="Trailer Flatbed 40ft">Trailer Flatbed 40ft</option>
                <option value="Tronton Wingbox">Tronton Wingbox</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kapasitas Angkut (Ton) *</label>
              <input
                type="number"
                required
                value={formData.capacityTons}
                onChange={(e) => setFormData({ ...formData, capacityTons: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Merk Head Truck</label>
              <input
                type="text"
                required
                placeholder="e.g. Volvo, Scania, Hino"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Model & Seri</label>
              <input
                type="text"
                required
                placeholder="e.g. FH16 750 / R580"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                ID GPS Tracker IoT
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GPS-TRK-788"
                value={formData.gpsId}
                onChange={(e) => setFormData({ ...formData, gpsId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Kesiapan Armada</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
              >
                <option value="Ready">Ready (Siap Operasi)</option>
                <option value="In Transit">In Transit (Sedang Beroperasi)</option>
                <option value="Maintenance">Maintenance (Dalam Perawatan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Panjang Trailer (meter)</label>
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Lebar Trailer (meter)</label>
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
              />
            </div>
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Armada Truk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Transformer } from '@/types';
import { useShipments } from '@/context/ShipmentContext';
import { X, Zap, Check, ShieldCheck, Calendar, Layers, Box } from 'lucide-react';

interface TransformerModalProps {
  isOpen: boolean;
  onClose: () => void;
  transformerToEdit?: Transformer | null;
}

export function TransformerModal({ isOpen, onClose, transformerToEdit }: TransformerModalProps) {
  const { addTransformer, updateTransformer } = useShipments();

  const [formData, setFormData] = useState({
    transformerNumber: '',
    serialNumber: '',
    type: 'Step-Down Substation Transformer',
    capacityKVA: 2500,
    weightKg: 38000,
    dimensions: {
      length: 4800,
      width: 2800,
      height: 3600,
    },
    oilType: 'Mineral Oil Nytro Lyra X',
    voltageRating: '150 kV / 20 kV',
    productionCompletionDate: new Date().toISOString().split('T')[0],
    coolingType: 'ONAN',
  });

  useEffect(() => {
    if (transformerToEdit) {
      setFormData({
        transformerNumber: transformerToEdit.transformerNumber,
        serialNumber: transformerToEdit.serialNumber,
        type: transformerToEdit.type,
        capacityKVA: transformerToEdit.capacityKVA,
        weightKg: transformerToEdit.weightKg,
        dimensions: {
          length: transformerToEdit.dimensions.length,
          width: transformerToEdit.dimensions.width,
          height: transformerToEdit.dimensions.height,
        },
        oilType: transformerToEdit.oilType,
        voltageRating: transformerToEdit.voltageRating,
        productionCompletionDate: transformerToEdit.productionCompletionDate,
        coolingType: transformerToEdit.coolingType,
      });
    } else {
      const defaultCap = 2500;
      setFormData({
        transformerNumber: `TRF-${defaultCap}-${Math.floor(100 + Math.random() * 900)}`,
        serialNumber: `SN-2026-XF${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Step-Down Substation Transformer',
        capacityKVA: defaultCap,
        weightKg: 38000,
        dimensions: {
          length: 4800,
          width: 2800,
          height: 3600,
        },
        oilType: 'Mineral Oil Nytro Lyra X',
        voltageRating: '150 kV / 20 kV',
        productionCompletionDate: new Date().toISOString().split('T')[0],
        coolingType: 'ONAN',
      });
    }
  }, [transformerToEdit, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!transformerToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transformerNumber.trim() || !formData.serialNumber.trim()) {
      alert('Nomor Trafo dan Serial Number wajib diisi!');
      return;
    }

    if (isEditing && transformerToEdit) {
      updateTransformer(transformerToEdit.id, formData);
    } else {
      addTransformer(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Ubah Data Transformer' : 'Tambah Transformer Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Mengubah spesifikasi teknis unit: ${transformerToEdit?.transformerNumber}`
                  : 'Katalog spesifikasi trafo daya baru siap uji pabrik dan kirim.'}
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
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Nomor Trafo / Tag Unit *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TRF-2500-008"
                value={formData.transformerNumber}
                onChange={(e) => setFormData({ ...formData, transformerNumber: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Serial Number Pabrik *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SN-2026-XF8821"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono font-bold text-blue-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe / Klasifikasi Trafo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium"
              >
                <option value="Step-Down Substation Transformer">Step-Down Substation Transformer</option>
                <option value="Step-Up Generator Transformer">Step-Up Generator Transformer</option>
                <option value="Industrial Power Transformer">Industrial Power Transformer</option>
                <option value="Mobile Substation Transformer">Mobile Substation Transformer</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kapasitas Daya (kVA) *</label>
              <select
                value={formData.capacityKVA}
                onChange={(e) => setFormData({ ...formData, capacityKVA: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
              >
                <option value={500}>500 kVA</option>
                <option value={1000}>1000 kVA</option>
                <option value={1600}>1600 kVA</option>
                <option value={2500}>2500 kVA</option>
                <option value={3000}>3000 kVA</option>
                <option value={5000}>5000 kVA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Berat Bersih Unit (Kg) *</label>
              <input
                type="number"
                required
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rating Tegangan (kV)</label>
              <input
                type="text"
                value={formData.voltageRating}
                onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-amber-600" />
              Dimensi Fisik Unit (milimeter / mm)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Panjang (mm)</label>
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, length: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Lebar (mm)</label>
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, width: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Tinggi (mm)</label>
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, height: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minyak Isolasi (Oil Type)</label>
              <input
                type="text"
                value={formData.oilType}
                onChange={(e) => setFormData({ ...formData, oilType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sistem Pendingin</label>
              <select
                value={formData.coolingType}
                onChange={(e) => setFormData({ ...formData, coolingType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
              >
                <option value="ONAN">ONAN (Oil Natural Air Natural)</option>
                <option value="ONAF">ONAF (Oil Natural Air Forced)</option>
                <option value="OFAF">OFAF (Oil Forced Air Forced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Tanggal Selesai Produksi Pabrik
            </label>
            <input
              type="date"
              value={formData.productionCompletionDate}
              onChange={(e) => setFormData({ ...formData, productionCompletionDate: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-medium"
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
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Simpan Perubahan' : 'Tambah Transformer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

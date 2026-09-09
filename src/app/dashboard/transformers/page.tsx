'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { formatWeight, formatCapacity } from '@/lib/utils';
import { Zap, Search, Plus, Filter, ShieldCheck, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Transformer } from '@/types';
import { TransformerModal } from '@/components/modals/TransformerModal';

export default function TransformersPage() {
  const { transformers, shipments, deleteTransformer } = useShipments();
  const { isSuperAdmin, isMarketing } = useAuth();
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransformer, setSelectedTransformer] = useState<Transformer | null>(null);

  const canManage = isSuperAdmin || isMarketing;

  const filtered = transformers.filter((t) => {
    const matchesSearch =
      t.transformerNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());

    const matchesCap =
      capacityFilter === 'ALL' ? true : String(t.capacityKVA) === capacityFilter;

    return matchesSearch && matchesCap;
  });

  const handleCreate = () => {
    setSelectedTransformer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transformer: Transformer) => {
    setSelectedTransformer(transformer);
    setIsModalOpen(true);
  };

  const handleDelete = (transformer: Transformer) => {
    const isUnderShipment = shipments.some((s) => s.transformerId === transformer.id);
    if (isUnderShipment) {
      alert(`Transformer ${transformer.transformerNumber} sedang terikat pada shipment aktif dan tidak dapat dihapus!`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus data transformer "${transformer.transformerNumber}" (${transformer.serialNumber})?`)) {
      deleteTransformer(transformer.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Katalog & Manajemen Data Transformer (Trafo)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Database spesifikasi teknis trafo: kapasitas 500 kVA s/d 3000 kVA, serial number, berat kargo, dan status pabrik.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Transformer Baru</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Nomor Trafo, Serial Number, Tipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">Semua Kapasitas</option>
            <option value="500">500 kVA</option>
            <option value="1000">1000 kVA</option>
            <option value="1600">1600 kVA</option>
            <option value="2500">2500 kVA</option>
            <option value="3000">3000 kVA</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total: <strong className="text-slate-900">{filtered.length}</strong> unit terdaftar
        </div>
      </div>

      {/* Grid of Transformers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const activeShipment = shipments.find((s) => s.transformerId === t.id);

          return (
            <div key={t.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Transformer</span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{t.transformerNumber}</h3>
                  <div className="text-xs font-mono font-bold text-blue-600 mt-0.5">{t.serialNumber}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    {formatCapacity(t.capacityKVA)}
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-1.5">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Edit Data Transformer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Transformer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tipe Trafo:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">{t.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Berat Bersih:</span>
                  <span className="font-bold text-slate-900">{formatWeight(t.weightKg)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dimensi (P x L x T):</span>
                  <span className="font-semibold text-slate-800">
                    {t.dimensions.length} x {t.dimensions.width} x {t.dimensions.height} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Minyak:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">{t.oilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sistem Pendingin:</span>
                  <span className="font-semibold text-slate-800">{t.coolingType}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {activeShipment ? (
                  <div className="flex items-center gap-1.5 text-blue-600 font-semibold truncate">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>Shipment: {activeShipment.id}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersedia di Yard Pabrik</span>
                  </div>
                )}

                <span className="text-[10px] text-slate-400">Selesai: {t.productionCompletionDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transformer Modal */}
      <TransformerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transformerToEdit={selectedTransformer}
      />
    </div>
  );
}

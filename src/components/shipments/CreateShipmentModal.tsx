'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { X, Truck, Zap, Building, Calendar, ArrowRight, Check } from 'lucide-react';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShipmentModal({ isOpen, onClose }: CreateShipmentModalProps) {
  const { transformers, customers, vendors, createShipment } = useShipments();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deliveryOrderNo: `DO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    salesOrderNo: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    poNumber: `PO-PLN-2026-${Math.floor(100 + Math.random() * 900)}`,
    shipmentDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '2026-09-08 17:00',
    transformerId: transformers[0]?.id || '',
    customerId: customers[0]?.id || '',
    vendorId: vendors[0]?.id || '',
    shippingMethod: 'Tronton Lowbed Heavy Haul',
    originCity: 'Tangerang',
    originAddress: 'PT. SYMPHOS ELECTRIC, Jl. Raya Agarindo No. 10, Kel. Bunder, Kec. Cikupa, Kabupaten Tangerang, Banten 15710',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShipment({
      deliveryOrderNo: formData.deliveryOrderNo,
      salesOrderNo: formData.salesOrderNo,
      poNumber: formData.poNumber,
      shipmentDate: formData.shipmentDate,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      transformerId: formData.transformerId,
      customerId: formData.customerId,
      vendorId: formData.vendorId,
      originCity: formData.originCity,
      originAddress: formData.originAddress,
    });
    alert('Shipment berhasil dibuat dan otomatis dialokasikan ke vendor ekspedisi!');
    onClose();
  };

  const selectedTransformer = transformers.find((t) => t.id === formData.transformerId) || transformers[0];
  const selectedCustomer = customers.find((c) => c.id === formData.customerId) || customers[0];
  const selectedVendor = vendors.find((v) => v.id === formData.vendorId) || vendors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Buat Pengiriman Transformer Baru
            </h3>
            <p className="text-xs text-slate-500">
              Input data shipment internal dan tentukan vendor ekspedisi pelaksana.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-white">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-4 text-xs font-semibold text-center border-b-2 transition-colors ${
              step === 1 ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-slate-500'
            }`}
          >
            1. Info Pengiriman & Trafo
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 px-4 text-xs font-semibold text-center border-b-2 transition-colors ${
              step === 2 ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-slate-500'
            }`}
          >
            2. Customer & Tujuan
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-3 px-4 text-xs font-semibold text-center border-b-2 transition-colors ${
              step === 3 ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-slate-500'
            }`}
          >
            3. Alokasi Vendor Ekspedisi
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Delivery Order (DO)</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryOrderNo}
                    onChange={(e) => setFormData({ ...formData, deliveryOrderNo: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Sales Order (SO)</label>
                  <input
                    type="text"
                    required
                    value={formData.salesOrderNo}
                    onChange={(e) => setFormData({ ...formData, salesOrderNo: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor PO Customer</label>
                  <input
                    type="text"
                    required
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Rencana Berangkat</label>
                  <input
                    type="date"
                    required
                    value={formData.shipmentDate}
                    onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Waktu Tiba (ETA)</label>
                  <input
                    type="text"
                    required
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    placeholder="2026-09-08 17:00"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Unit Transformer</label>
                <select
                  value={formData.transformerId}
                  onChange={(e) => setFormData({ ...formData, transformerId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  {transformers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.transformerNumber} ({t.capacityKVA} kVA) — Serial: {t.serialNumber} — {t.type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTransformer && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kapasitas:</span>
                    <span className="font-bold text-blue-600">{selectedTransformer.capacityKVA} kVA</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Berat Bersih:</span>
                    <span className="font-bold">{selectedTransformer.weightKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tipe Pendingin:</span>
                    <span className="font-bold">{selectedTransformer.coolingType}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Perusahaan Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.city}, {c.province})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Building className="w-4 h-4 text-blue-600" />
                    {selectedCustomer.companyName}
                  </div>
                  <div className="text-slate-600 leading-relaxed">{selectedCustomer.address}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">PIC Penerima:</span>
                      <span className="font-semibold text-slate-800">{selectedCustomer.customerPic}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kontak Telepon:</span>
                      <span className="font-semibold text-slate-800">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Asal (Origin / Pabrik)</label>
                <input
                  type="text"
                  value={formData.originAddress}
                  onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tugaskan Vendor Ekspedisi (Pilih dari 10 Vendor Terdaftar)
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                  {vendors.map((v) => (
                    <label
                      key={v.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.vendorId === v.id
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="vendorId"
                          value={v.id}
                          checked={formData.vendorId === v.id}
                          onChange={() => setFormData({ ...formData, vendorId: v.id })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{v.name}</div>
                          <div className="text-[11px] text-slate-500">
                            On-Time Rate: <span className="text-emerald-600 font-semibold">{v.onTimeRate}%</span> | Armada: {v.fleetCount} Unit
                          </div>
                        </div>
                      </div>
                      {v.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {v.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metode & Tipe Armada yang Direkomendasikan</label>
                <select
                  value={formData.shippingMethod}
                  onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Tronton Lowbed Heavy Haul">Tronton Lowbed Heavy Haul (Kapasitas s/d 45 Ton)</option>
                  <option value="Multi-Axle Heavy Hauler Platform">Multi-Axle Heavy Hauler Platform (Goldhofer / Cometto)</option>
                  <option value="Trailer Flatbed 40ft">Trailer Flatbed 40ft Heavy Duty Deck</option>
                  <option value="Multimodal Truck-RoRo Inter Island">Multimodal Truck-RoRo Inter Island (Lintas Pulau)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold">Informasi Penugasan:</span> Vendor yang dipilih akan otomatis menerima tugas ini di portal vendor miliknya untuk penugasan driver, nomor polisi truk, inspeksi pre-delivery, dan live update.
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Kembali
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Lanjut
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Check className="w-4 h-4" />
                Konfirmasi & Terbitkan Shipment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

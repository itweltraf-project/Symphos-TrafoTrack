'use client';

import React from 'react';
import { PreDeliveryInspection } from '@/types';
import { ShieldCheck, CheckCircle2, AlertCircle, Camera, Check, AlertTriangle } from 'lucide-react';

interface ConditionChecklistProps {
  inspection: PreDeliveryInspection;
  editable?: boolean;
}

export function ConditionChecklist({ inspection, editable = false }: ConditionChecklistProps) {
  const items = [
    { label: 'Kondisi Bushing & Terminal Tegangan', value: inspection.bushingCondition },
    { label: 'Kondisi Sirip Radiator (Fins)', value: inspection.radiatorCondition },
    { label: 'Kondisi Tangki Konservator (Conservator Tank)', value: inspection.conservatorCondition },
    { label: 'Aksesoris (Silicagel, Temperature Gauge, Buchholz)', value: inspection.accessoriesCondition },
    { label: 'Pengecekan Kebocoran Minyak (Oil Leakage Check)', value: inspection.oilLeakage ? 'Terdeteksi Rembes' : 'Bebas Kebocoran (Aman)', isPass: !inspection.oilLeakage },
    { label: 'Pengecekan Karat / Cacat Fisik Tangki', value: inspection.rustOrDamage ? 'Ada Cacat' : 'Bebas Cacat (Mulus)', isPass: !inspection.rustOrDamage },
  ];

  const photoChecklistTitles = [
    'Foto Tampak Depan (Front View)',
    'Foto Tampak Belakang (Rear View)',
    'Foto Sisi Kiri (Left Side)',
    'Foto Sisi Kanan (Right Side)',
    'Foto Bagian Atas & Bushing Cover',
    'Foto Packaging & Cover Pelindung',
    'Foto Nameplate Serial Number Trafo',
    'Foto Pemuatan (Lashing Rantai ke Lowbed)',
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              inspection.overallCondition === 'Good'
                ? 'bg-emerald-600'
                : inspection.overallCondition === 'Minor Damage'
                ? 'bg-amber-500'
                : 'bg-red-600'
            }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status Inspeksi Pabrik</div>
            <div className="text-base font-extrabold text-slate-900">
              {inspection.overallCondition === 'Good' ? 'Lulus Inspeksi (Kondisi Prima)' : inspection.overallCondition}
            </div>
            <div className="text-[11px] text-slate-500">
              Diinspeksi oleh: <strong className="text-slate-700">{inspection.inspectedBy}</strong> pada {inspection.inspectedAt} WIB
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            inspection.overallCondition === 'Good'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}
        >
          {inspection.overallCondition} Condition
        </span>
      </div>

      {/* Technical Checks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Checklist 6 Komponen Kritis Trafo Sebelum Keberangkatan
          </h4>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                    item.value === 'Good' || item.value === 'Complete' || item.isPass
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {item.value}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Mandatory Photos Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              8 Foto Dokumentasi Pra-Keberangkatan (Wajib Vendor)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumentasi wajib sebelum armada meninggalkan yard pabrik manufaktur.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Terverifikasi Lengkap
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photoChecklistTitles.map((title, idx) => {
            const photoUrl =
              inspection.photos[idx]?.url ||
              `https://images.unsplash.com/photo-${1581092160607 + idx * 50}?w=400&auto=format&fit=crop&q=80`;

            return (
              <div
                key={idx}
                className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-28 bg-slate-200 overflow-hidden relative">
                  <img
                    src={photoUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
                <div className="p-2.5 text-[11px] font-semibold text-slate-800 leading-snug">
                  {title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

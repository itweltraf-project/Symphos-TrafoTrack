'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { Settings, Shield, Bell, Zap, Save, RotateCcw, Check } from 'lucide-react';

export default function SettingsPage() {
  const { resetToDefaultData } = useShipments();

  const [companyName, setCompanyName] = useState('PT Trafo Manufacturing & Logistics Nusantara');
  const [delayThresholdMinutes, setDelayThresholdMinutes] = useState('30');
  const [gpsPingMinutes, setGpsPingMinutes] = useState('15');
  const [enableWhatsappAlerts, setEnableWhatsappAlerts] = useState(true);
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [requireAll8Photos, setRequireAll8Photos] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan sistem berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Pengaturan Sistem & Konfigurasi Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi ambang batas deteksi keterlambatan (Delay Detection), aturan inspeksi foto, dan integrasi notifikasi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Profil Perusahaan & Hub Pabrik
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan Manufaktur</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi Pabrik Utama (Hub Outbound)</label>
              <input
                type="text"
                defaultValue="Kawasan Industri GIIC Delta Silicon 6, Cikarang Pusat, Bekasi"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Delay & SLA Thresholds */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Ambang Batas Deteksi Keterlambatan Otomatis (Delay Detection SLA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Toleransi Keterlambatan ETA (Menit)
              </label>
              <input
                type="number"
                value={delayThresholdMinutes}
                onChange={(e) => setDelayThresholdMinutes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Jika waktu aktual melebihi ETA + nilai toleransi, sistem otomatis mengubah status ke DELAYED dan memberi peringatan.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Interval Peringatan GPS Ping Vendor (Menit)
              </label>
              <input
                type="number"
                value={gpsPingMinutes}
                onChange={(e) => setGpsPingMinutes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Notifikasi otomatis terpicu jika driver tidak memperbarui posisi lebih dari batas menit ini.
              </span>
            </div>
          </div>
        </div>

        {/* Inspection & Notifications Rules */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Aturan SOP Inspeksi & Notifikasi
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={requireAll8Photos}
                onChange={(e) => setRequireAll8Photos(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  Wajib 8 Foto Inspeksi Pra-Keberangkatan
                </span>
                <span className="text-[11px] text-slate-500">
                  Vendor tidak dapat menekan tombol DEPARTED sebelum 8 sudut foto trafo dan lashing rantai terverifikasi.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableWhatsappAlerts}
                onChange={(e) => setEnableWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  Kirim Notifikasi WhatsApp Gateway ke PIC Customer & Marketing
                </span>
                <span className="text-[11px] text-slate-500">
                  Kirim ringkasan otomatis saat armada berangkat, mendekati site gardu induk, dan saat POD diunggah.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset seluruh data demo ke kondisi awal pabrik?')) {
                resetToDefaultData();
                alert('Data berhasil di-reset!');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

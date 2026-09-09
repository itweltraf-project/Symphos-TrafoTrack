'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { Building, Search, MapPin, Phone, Mail, User, Truck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const { customers, shipments } = useShipments();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.customerPic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Direktori Customer & Lokasi Gardu Induk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar entitas pemesan trafo: PT PLN (Persero), BUMN Industri, Mining, dan Smelter di seluruh Indonesia.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Customer, Kota, PIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total: <strong className="text-slate-900">{filtered.length}</strong> Perusahaan Customer
        </div>
      </div>

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const customerShipments = shipments.filter((s) => s.customerId === c.id);

          return (
            <div key={c.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.companyName}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{c.city}, {c.province}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold shrink-0">
                  {customerShipments.length} Pengiriman
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="text-slate-600 leading-relaxed text-[11px]">{c.address}</div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>PIC: <strong className="text-slate-900">{c.customerPic}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>GPS: {c.latitude}, {c.longitude}</span>
                <Link
                  href={`/dashboard/shipments?search=${c.companyName.split(' ')[0]}`}
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  Lihat Riwayat Trafo <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

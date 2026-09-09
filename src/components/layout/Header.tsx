'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShipments } from '@/context/ShipmentContext';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  UserCheck,
  Shield,
  Truck,
  Building,
  Check,
  Clock,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onOpenCreateShipment?: () => void;
}

export function Header({ onOpenCreateShipment }: HeaderProps) {
  const { currentUser, switchUser, allUsers, allVendors, isVendor, isSuperAdmin, isMarketing } = useAuth();
  const { notifications, markNotificationRead, shipments } = useShipments();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof shipments>([]);
  const [isSearching, setIsSearching] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const lower = q.toLowerCase();
    const matches = shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(lower) ||
        s.transformer.transformerNumber.toLowerCase().includes(lower) ||
        s.transformer.serialNumber.toLowerCase().includes(lower) ||
        s.customer.companyName.toLowerCase().includes(lower) ||
        s.vendor.name.toLowerCase().includes(lower) ||
        s.destinationCity.toLowerCase().includes(lower) ||
        (s.driver && s.driver.name.toLowerCase().includes(lower)) ||
        (s.vehicle && s.vehicle.plateNumber.toLowerCase().includes(lower))
    );
    setSearchResults(matches);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      {/* Search Input with quick results */}
      <div className="relative w-80 lg:w-96">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Shipment ID, Serial Trafo, Customer, Driver..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Popup */}
        {isSearching && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-50 p-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Hasil Pencarian ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">Tidak ada pengiriman yang cocok.</div>
            ) : (
              searchResults.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/shipments/${s.id}`}
                  onClick={() => setIsSearching(false)}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-blue-600 group-hover:underline">{s.id}</span>
                      <span className="text-[11px] text-slate-500">• {s.transformer.transformerNumber}</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium truncate max-w-[240px]">
                      {s.customer.companyName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Tujuan: {s.destinationCity} | Vendor: {s.vendor.name}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Instant Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all"
            title="Ganti Role & Vendor untuk Pengujian RBAC"
          >
            <div className="flex items-center gap-1.5">
              {isSuperAdmin ? (
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              ) : isVendor ? (
                <Truck className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Building className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="text-slate-900 font-bold">
                {isVendor ? currentUser.name.split('(')[0] : currentUser.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Switcher Menu */}
          {showRoleModal && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-2">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Uji Akses Role & Vendor (RBAC)</div>
                  <div className="text-[10px] text-slate-500">Pilih pengguna untuk simulasi sistem</div>
                </div>
                <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                  Internal Trafo MKT
                </div>
                {allUsers
                  .filter((u) => u.role !== 'VENDOR')
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowRoleModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                          {u.role === 'SUPER_ADMIN' ? 'SA' : 'MK'}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.department}</div>
                        </div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3">
                  10 Vendor Ekspedisi (Isolasi Data Vendor)
                </div>
                {allUsers
                  .filter((u) => u.role === 'VENDOR')
                  .map((u) => {
                    const vendor = allVendors.find((v) => v.id === u.vendorId);
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleModal(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          currentUser.id === u.id
                            ? 'bg-amber-50 border border-amber-200 text-amber-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-[10px]">
                            {vendor?.code.substring(0, 3) || 'VN'}
                          </div>
                          <div>
                            <div className="truncate max-w-[190px] font-medium">{vendor?.name}</div>
                            <div className="text-[10px] text-slate-400">PIC: {vendor?.pic}</div>
                          </div>
                        </div>
                        {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors"
            title="Pemberitahuan Sistem"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-800">
                  Notifikasi ({unreadNotifications.length} Belum Dibaca)
                </div>
                <button
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      notif.isRead
                        ? 'bg-slate-50 border-slate-100 text-slate-600'
                        : notif.type === 'delay'
                        ? 'bg-red-50/70 border-red-200 text-red-900 font-medium'
                        : 'bg-blue-50/70 border-blue-200 text-blue-900 font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        {notif.type === 'delay' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                        <span>{notif.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">{notif.message}</p>
                    {notif.shipmentId && (
                      <Link
                        href={`/dashboard/shipments/${notif.shipmentId}`}
                        onClick={() => setShowNotifDropdown(false)}
                        className="mt-1.5 inline-block text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        Buka {notif.shipmentId} →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Create Shipment (Visible to Admin & Marketing) */}
        {!isVendor && onOpenCreateShipment && (
          <button
            onClick={onOpenCreateShipment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengiriman</span>
          </button>
        )}
      </div>
    </header>
  );
}

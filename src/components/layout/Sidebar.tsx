'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useShipments } from '@/context/ShipmentContext';
import {
  LayoutDashboard,
  Truck,
  Zap,
  Building2,
  Users,
  MapPin,
  FileText,
  History,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, isVendor, isSuperAdmin, currentVendor, logout } = useAuth();
  const { shipments, resetToDefaultData } = useShipments();
  const [collapsed, setCollapsed] = useState(false);

  // Calculate live counters
  const delayedCount = shipments.filter((s) => s.isDelayed || s.currentStatus === 'DELAYED').length;
  const inTransitCount = shipments.filter((s) => s.currentStatus === 'IN_TRANSIT').length;

  interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countColor?: string;
    badge?: string;
    adminOnly?: boolean;
  }

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Shipments', href: '/dashboard/shipments', icon: Truck, count: shipments.length },
    { label: 'Live Tracking', href: '/dashboard/tracking', icon: MapPin, count: inTransitCount, countColor: 'bg-blue-600 text-white' },
    { label: 'Transformer', href: '/dashboard/transformers', icon: Zap },
    { label: 'Customers', href: '/dashboard/customers', icon: Building2 },
    { label: 'Expedition Vendors', href: '/dashboard/vendors', icon: ShieldCheck, badge: '10 Partner' },
    { label: 'Armada & Driver', href: '/dashboard/drivers-vehicles', icon: Users },
    { label: 'Reports & Export', href: '/dashboard/reports', icon: FileText },
    { label: 'Activity Logs', href: '/dashboard/activity-logs', icon: History },
    { label: 'User Management', href: '/dashboard/users', icon: FolderLock, adminOnly: true },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const vendorNavItems: NavItem[] = [
    { label: 'Dashboard Vendor', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tugas Pengiriman', href: '/dashboard/shipments', icon: Truck, count: shipments.length },
    { label: 'Mobile Driver Portal', href: '/dashboard/vendor-portal', icon: Smartphone, badge: 'Live Update' },
    { label: 'Live Tracking', href: '/dashboard/tracking', icon: MapPin },
    { label: 'Dokumen & POD', href: '/dashboard/shipments?tab=docs', icon: FileText },
    { label: 'Armada & Driver Saya', href: '/dashboard/drivers-vehicles', icon: Users },
  ];

  const navItems = isVendor ? vendorNavItems : adminNavItems;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 ${
        collapsed ? 'w-20' : 'w-68'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
          {!collapsed ? (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-bold text-white tracking-tight leading-none text-base">TRAFO TRACK</div>
                <div className="text-[10px] text-amber-400 font-medium tracking-wider uppercase mt-0.5">Delivery System</div>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Highlight Banner */}
        <div className="px-3 py-2.5 mx-3 my-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Akses Aktif</div>
                <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {isVendor ? currentVendor?.name || 'Portal Vendor' : currentUser.role.replace('_', ' ')}
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : isVendor
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {currentUser.role === 'SUPER_ADMIN' ? 'Admin' : currentUser.role === 'MARKETING' ? 'Mkt' : 'Vendor'}
              </span>
            </div>
          ) : (
            <div className="flex justify-center" title={`Role: ${currentUser.role}`}>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isSuperAdmin ? 'bg-purple-400' : isVendor ? 'bg-amber-400' : 'bg-blue-400'
                }`}
              />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                      item.countColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Reset */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        {delayedCount > 0 && !collapsed && (
          <div className="mb-2.5 px-3 py-2 rounded-lg bg-red-950/50 border border-red-800/60 flex items-center gap-2 text-red-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 animate-pulse" />
            <div className="truncate">
              <span className="font-bold">{delayedCount} Pengiriman</span> tertunda!
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 truncate">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600 shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white">
                    {currentUser.name[0]}
                  </div>
                )}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.department || currentUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full bg-slate-700 overflow-hidden border border-slate-600">
              <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {!collapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (confirm('Reset semua data demo ke kondisi awal pabrik?')) {
                    resetToDefaultData();
                    alert('Data berhasil di-reset!');
                  }
                }}
                title="Reset Demo Data"
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                title="Keluar (Logout)"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

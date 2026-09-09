import { ShipmentStatus } from '@/types';

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return dateString; // return raw if formatted string like '2026-09-03 14:00'
    }
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch {
    return dateString;
  }
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} Ton (${kg.toLocaleString('id-ID')} kg)`;
  }
  return `${kg.toLocaleString('id-ID')} kg`;
}

export function formatCapacity(kVA: number): string {
  return `${kVA.toLocaleString('id-ID')} kVA`;
}

export interface StatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
  bgTint: string;
}

export function getStatusMeta(status: ShipmentStatus, isDelayed?: boolean): StatusMeta {
  if (isDelayed || status === 'DELAYED') {
    return {
      label: 'Delayed (Terlambat)',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-300',
      dotClass: 'bg-red-500 animate-pulse',
      bgTint: 'bg-red-500/10',
    };
  }

  switch (status) {
    case 'SHIPMENT_CREATED':
      return {
        label: 'Shipment Created',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-400',
        bgTint: 'bg-slate-500/10',
      };
    case 'WAITING_PICKUP':
      return {
        label: 'Waiting Pickup',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300',
        dotClass: 'bg-amber-500',
        bgTint: 'bg-amber-500/10',
      };
    case 'VEHICLE_ASSIGNED':
    case 'DRIVER_ASSIGNED':
      return {
        label: 'Fleet Assigned',
        badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-300',
        dotClass: 'bg-cyan-500',
        bgTint: 'bg-cyan-500/10',
      };
    case 'PICKUP':
    case 'LOADED':
      return {
        label: 'Loaded at Factory',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
        dotClass: 'bg-blue-500',
        bgTint: 'bg-blue-500/10',
      };
    case 'DEPARTED':
    case 'IN_TRANSIT':
    case 'AT_TRANSIT_HUB':
    case 'APPROACHING_DESTINATION':
      return {
        label: 'In Transit',
        badgeClass: 'bg-blue-600 text-white font-medium shadow-xs shadow-blue-500/20 border-transparent',
        dotClass: 'bg-white animate-ping',
        bgTint: 'bg-blue-500/10',
      };
    case 'ARRIVED':
      return {
        label: 'Arrived at Site',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
        dotClass: 'bg-indigo-500',
        bgTint: 'bg-indigo-500/10',
      };
    case 'UNLOADING':
      return {
        label: 'Unloading Process',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
        dotClass: 'bg-purple-500',
        bgTint: 'bg-purple-500/10',
      };
    case 'DELIVERED':
      return {
        label: 'Delivered',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-400',
        dotClass: 'bg-teal-500',
        bgTint: 'bg-teal-500/10',
      };
    case 'POD_UPLOADED':
    case 'COMPLETED':
      return {
        label: 'Completed (POD Verified)',
        badgeClass: 'bg-emerald-600 text-white font-medium shadow-xs border-transparent',
        dotClass: 'bg-emerald-200',
        bgTint: 'bg-emerald-500/10',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-400',
        bgTint: 'bg-slate-500/10',
      };
  }
}

export function calculateDelay(expectedDateStr: string, currentStatus: ShipmentStatus): { isDelayed: boolean; hoursLate: number } {
  if (currentStatus === 'DELIVERED' || currentStatus === 'POD_UPLOADED' || currentStatus === 'COMPLETED') {
    return { isDelayed: false, hoursLate: 0 };
  }

  const expected = new Date(expectedDateStr.replace(' ', 'T')).getTime();
  const now = new Date('2026-09-04T01:30:00+07:00').getTime(); // Current simulated system date

  if (now > expected) {
    const diffHours = Math.round((now - expected) / (1000 * 60 * 60));
    return { isDelayed: true, hoursLate: diffHours };
  }

  return { isDelayed: false, hoursLate: 0 };
}

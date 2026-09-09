'use client';

import React from 'react';
import { TrackingMilestone, ShipmentStatus } from '@/types';
import { CheckCircle2, Clock, MapPin, Camera, AlertTriangle, ShieldCheck, User } from 'lucide-react';

interface TrackingTimelineProps {
  history: TrackingMilestone[];
  currentStatus: ShipmentStatus;
  isDelayed?: boolean;
}

const ALL_15_STEPS = [
  { step: 1, status: 'SHIPMENT_CREATED', label: '1. Shipment Order Created' },
  { step: 2, status: 'WAITING_PICKUP', label: '2. Waiting for Expedition Pickup' },
  { step: 3, status: 'VEHICLE_ASSIGNED', label: '3. Vehicle Assigned' },
  { step: 4, status: 'DRIVER_ASSIGNED', label: '4. Driver Assigned' },
  { step: 5, status: 'PICKUP', label: '5. Pickup at Factory' },
  { step: 6, status: 'LOADED', label: '6. Transformer Loaded & Lashed' },
  { step: 7, status: 'DEPARTED', label: '7. Departed Factory Gate' },
  { step: 8, status: 'IN_TRANSIT', label: '8. In Transit (Main Corridor)' },
  { step: 9, status: 'AT_TRANSIT_HUB', label: '9. Rest Area / Transit Inspection' },
  { step: 10, status: 'APPROACHING_DESTINATION', label: '10. Approaching Site' },
  { step: 11, status: 'ARRIVED', label: '11. Arrived at Customer Site' },
  { step: 12, status: 'UNLOADING', label: '12. Unloading & Foundation Staging' },
  { step: 13, status: 'DELIVERED', label: '13. Delivered to Customer Team' },
  { step: 14, status: 'POD_UPLOADED', label: '14. Proof of Delivery (POD) Uploaded' },
  { step: 15, status: 'COMPLETED', label: '15. Shipment Completed' },
];

export function TrackingTimeline({ history, currentStatus, isDelayed }: TrackingTimelineProps) {
  // Map step numbers completed
  const highestStep = Math.max(...history.map((h) => h.step), 1);

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            15-Step Tracking Timeline & Milestone
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Riwayat kronologis pergerakan trafo dan pembaruan berkala dari ekspedisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Progres:</span>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Langkah {highestStep} dari 15
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
        {ALL_15_STEPS.map((milestoneDef) => {
          const match = history.find((h) => h.step === milestoneDef.step);
          const isDone = match !== undefined || highestStep > milestoneDef.step;
          const isCurrent = highestStep === milestoneDef.step;

          return (
            <div key={milestoneDef.step} className="relative flex items-start gap-4 z-10">
              {/* Icon Marker */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  isCurrent && isDelayed
                    ? 'bg-red-600 text-white ring-4 ring-red-100 animate-pulse'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : isDone
                    ? 'bg-emerald-600 text-white ring-2 ring-white'
                    : 'bg-slate-100 border border-slate-300 text-slate-400'
                }`}
              >
                {isCurrent && isDelayed ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  milestoneDef.step
                )}
              </div>

              {/* Content Card */}
              <div
                className={`flex-1 p-3.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? isDelayed
                      ? 'bg-red-50/60 border-red-200 shadow-xs'
                      : 'bg-blue-50/50 border-blue-200 shadow-xs'
                    : isDone
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50/40 border-slate-200/60 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span
                    className={`font-bold text-xs ${
                      isCurrent
                        ? isDelayed
                          ? 'text-red-900'
                          : 'text-blue-900'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {milestoneDef.label}
                  </span>

                  {match && (
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {match.timestamp}
                    </span>
                  )}
                </div>

                {match && (
                  <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{match.location}</span>
                    </div>

                    {match.notes && (
                      <p className="text-slate-600 text-[11px] leading-relaxed bg-white/60 p-2 rounded-lg border border-slate-100">
                        {match.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> Oleh: {match.updatedBy}
                      </span>
                      {match.photoUrl && (
                        <a
                          href={match.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                        >
                          <Camera className="w-3 h-3" /> Lihat Foto Bukti
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subValue?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  colorScheme: 'blue' | 'amber' | 'emerald' | 'red' | 'purple' | 'indigo';
  pulse?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subValue,
  trend,
  trendDirection = 'up',
  icon: Icon,
  colorScheme,
  pulse = false,
  onClick,
}: StatCardProps) {
  const schemeStyles = {
    blue: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200/80',
      iconBg: 'bg-blue-600 text-white',
      accent: 'text-blue-700',
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-500 text-white',
      accent: 'text-amber-700',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'text-emerald-700',
    },
    red: {
      bg: 'bg-red-50/80',
      border: 'border-red-300 ring-2 ring-red-400/20',
      iconBg: 'bg-red-600 text-white',
      accent: 'text-red-700',
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-200/80',
      iconBg: 'bg-purple-600 text-white',
      accent: 'text-purple-700',
    },
    indigo: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200/80',
      iconBg: 'bg-indigo-600 text-white',
      accent: 'text-indigo-700',
    },
  };

  const currentScheme = schemeStyles[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border ${currentScheme.border} shadow-xs hover:shadow-md transition-all relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      {pulse && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Perlu Tindakan</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
            {subValue && <span className="text-xs text-slate-500 font-medium">{subValue}</span>}
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl ${currentScheme.iconBg} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-600">
            <span
              className={`font-semibold ${
                trendDirection === 'up'
                  ? 'text-emerald-600'
                  : trendDirection === 'down'
                  ? 'text-red-600'
                  : 'text-slate-600'
              }`}
            >
              {trend}
            </span>
            <span className="text-[11px] text-slate-400">vs periode lalu</span>
          </div>
        </div>
      )}
    </div>
  );
}

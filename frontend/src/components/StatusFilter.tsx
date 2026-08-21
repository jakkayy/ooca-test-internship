'use client';

import { AppointmentStatus } from '../types/appointment';

export type FilterStatus = AppointmentStatus | 'ALL';

interface StatusFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  counts: {
    ALL: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export function StatusFilter({
  currentFilter,
  onFilterChange,
  counts,
}: StatusFilterProps) {
  const filterTabs: { key: FilterStatus; label: string; activeBg: string }[] = [
    { key: 'ALL', label: 'ทั้งหมด', activeBg: 'bg-slate-800 text-white' },
    { key: 'pending', label: 'รอการยืนยัน (Pending)', activeBg: 'bg-amber-500 text-white' },
    { key: 'confirmed', label: 'ยืนยันแล้ว (Confirmed)', activeBg: 'bg-emerald-600 text-white' },
    { key: 'cancelled', label: 'ยกเลิกแล้ว (Cancelled)', activeBg: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterTabs.map((tab) => {
        const isActive = currentFilter === tab.key;
        const count = counts[tab.key] || 0;

        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
              isActive
                ? `${tab.activeBg} border-transparent shadow-sm`
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { Appointment } from '../types/appointment';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onStatusChange: (id: string, newStatus: 'confirmed' | 'cancelled') => void;
  updatingId: string | null;
}

export function AppointmentList({
  appointments,
  isLoading,
  onStatusChange,
  updatingId,
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse flex justify-between items-center"
          >
            <div className="space-y-3 w-2/3">
              <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
            </div>
            <div className="h-8 bg-slate-100 rounded-xl w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm my-4">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-700 text-base mb-1">
          ยังไม่มีรายการนัดหมาย
        </h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          ยังไม่มีนัดหมายตรงตามเงื่อนไขที่เลือก สามารถสร้างนัดหมายใหม่ได้จากฟอร์มด้านบน
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((item) => (
        <AppointmentCard
          key={item.id}
          appointment={item}
          onStatusChange={onStatusChange}
          isUpdating={updatingId === item.id}
        />
      ))}
    </div>
  );
}

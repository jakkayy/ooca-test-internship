'use client';

import { Appointment, AppointmentStatus } from '../types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (id: string, newStatus: 'confirmed' | 'cancelled') => void;
  isUpdating: boolean;
}

export function AppointmentCard({
  appointment,
  onStatusChange,
  isUpdating,
}: AppointmentCardProps) {
  const dateObj = new Date(appointment.appointmentAt);

  const formattedDate = dateObj.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const formattedTime = dateObj.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // End time calculation (30 minutes slot)
  const endDateObj = new Date(dateObj.getTime() + 30 * 60 * 1000);
  const formattedEndTime = endDateObj.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ยืนยันแล้ว (Confirmed)
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            ยกเลิกแล้ว (Cancelled)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            รอการยืนยัน (Pending)
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-slate-800 text-lg">
            {appointment.patientName}
          </h3>
          {getStatusBadge(appointment.status)}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formattedTime} - {formattedEndTime} น.</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {appointment.status !== 'confirmed' && (
          <button
            onClick={() => onStatusChange(appointment.id, 'confirmed')}
            disabled={isUpdating}
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-xl text-xs transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            ยืนยัน
          </button>
        )}

        {appointment.status !== 'cancelled' && (
          <button
            onClick={() => onStatusChange(appointment.id, 'cancelled')}
            disabled={isUpdating}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-xl text-xs transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิก
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface AppointmentFormProps {
  onSubmit: (patientName: string, appointmentAt: string) => Promise<void>;
  isSubmitting: boolean;
}

export function AppointmentForm({
  onSubmit,
  isSubmitting,
}: AppointmentFormProps) {
  const [patientName, setPatientName] = useState('');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!patientName.trim()) {
      setValidationError('กรุณากรอกชื่อคนไข้');
      return;
    }

    if (!appointmentAt) {
      setValidationError('กรุณาเลือกวันและเวลาที่นัดหมาย');
      return;
    }

    const selectedDate = new Date(appointmentAt);
    if (selectedDate.getTime() <= Date.now()) {
      setValidationError('เวลานัดหมายต้องเป็นเวลาในอนาคตเท่านั้น');
      return;
    }

    // Convert local datetime-local value to ISO 8601 UTC string
    const isoDateString = selectedDate.toISOString();

    try {
      await onSubmit(patientName.trim(), isoDateString);
      setPatientName('');
      setAppointmentAt('');
    } catch (err) {
      // Error handling is handled by parent page banner
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        สร้างการนัดหมายใหม่
      </h2>

      {validationError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            ชื่อ - นามสกุล คนไข้ <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="เช่น นายสมชาย ใจดี"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            วันและเวลานัดหมาย <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={appointmentAt}
            onChange={(e) => setAppointmentAt(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              กำลังลงทะเบียน...
            </>
          ) : (
            'ลงทะเบียนนัดหมาย'
          )}
        </button>
      </form>
    </div>
  );
}

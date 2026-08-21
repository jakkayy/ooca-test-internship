'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Appointment,
  AppointmentStatus,
} from '@/types/appointment';
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
  ApiError,
} from '@/services/api';
import { AppointmentForm } from '@/components/AppointmentForm';
import { StatusFilter, FilterStatus } from '@/components/StatusFilter';
import { AppointmentList } from '@/components/AppointmentList';

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Alert Banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAppointments('ALL');
      setAppointments(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateAppointment = async (
    patientName: string,
    appointmentAt: string,
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const created = await createAppointment({ patientName, appointmentAt });
      setSuccessMessage(`สร้างนัดหมายสำหรับคุณ ${created.patientName} สำเร็จเรียบร้อย`);
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          setErrorMessage(
            'ช่วงเวลานี้ถูกจองไปแล้ว กรุณาเลือกวันหรือเวลาอื่น (แต่ละนัดหมายใช้เวลา 30 นาที)',
          );
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage('เกิดข้อผิดพลาดไม่ทราบสาเหตุในการลงทะเบียน');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'confirmed' | 'cancelled',
  ) => {
    setUpdatingId(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateAppointmentStatus(id, newStatus);
      const actionText = newStatus === 'confirmed' ? 'ยืนยัน' : 'ยกเลิก';
      setSuccessMessage(`อัปเดตสถานะนัดหมายเป็น "${actionText}" เรียบร้อยแล้ว`);
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('ไม่สามารถอัปเดตสถานะนัดหมายได้');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate counts for filters
  const counts = {
    ALL: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  // Filtered list display
  const filteredAppointments =
    currentFilter === 'ALL'
      ? appointments
      : appointments.filter((a) => a.status === currentFilter);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                O
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Mini Appointment App
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              ระบบบริหารจัดการตารางนัดหมายคนไข้ (Ooca Assessment)
            </p>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API Online (Port 3001)
            </span>
          </div>
        </header>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-3 shadow-sm animate-in fade-in">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-rose-800 mb-0.5">เกิดข้อผิดพลาดในการทำรายการ</h4>
              <p>{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-600 font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-600 font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Create Appointment Form Component */}
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          isSubmitting={isSubmitting}
        />

        {/* List Section Header & Filter */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            ตารางการนัดหมาย
          </h2>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="self-start sm:self-auto text-xs text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Filter Tabs */}
        <StatusFilter
          currentFilter={currentFilter}
          onFilterChange={(filter) => setCurrentFilter(filter)}
          counts={counts}
        />

        {/* Appointment List Component */}
        <AppointmentList
          appointments={filteredAppointments}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      </div>
    </main>
  );
}

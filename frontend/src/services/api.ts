import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
} from '../types/appointment';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function fetchAppointments(
  status?: AppointmentStatus | 'ALL',
): Promise<Appointment[]> {
  const url =
    status && status !== 'ALL'
      ? `${API_BASE_URL}/appointments?status=${status}`
      : `${API_BASE_URL}/appointments`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Failed to fetch appointments';
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export async function createAppointment(
  data: CreateAppointmentInput,
): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Failed to create appointment';
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export async function updateAppointmentStatus(
  id: string,
  status: 'confirmed' | 'cancelled',
): Promise<Appointment> {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Failed to update status';
    throw new ApiError(message, res.status);
  }

  return res.json();
}

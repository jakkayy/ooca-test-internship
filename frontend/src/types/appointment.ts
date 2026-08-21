export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  appointmentAt: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CreateAppointmentInput {
  patientName: string;
  appointmentAt: string;
}

export interface UpdateStatusInput {
  status: 'confirmed' | 'cancelled';
}

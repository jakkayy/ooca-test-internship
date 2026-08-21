import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';

const SLOT_DURATION_MINUTES = 30;

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const newStart = new Date(createDto.appointmentAt);
    const newEnd = new Date(
      newStart.getTime() + SLOT_DURATION_MINUTES * 60 * 1000,
    );

    // Overlap condition window: (newStart - 30 mins) to newEnd
    const windowStart = new Date(
      newStart.getTime() - SLOT_DURATION_MINUTES * 60 * 1000,
    );

    const overlappingAppointment =
      await this.appointmentsRepository.findOverlapping(windowStart, newEnd);

    if (overlappingAppointment) {
      throw new ConflictException(
        'An appointment already exists during this time slot (30-minute slot required)',
      );
    }

    return this.appointmentsRepository.create({
      patientName: createDto.patientName,
      appointmentAt: newStart,
      status: AppointmentStatus.pending,
    });
  }

  async findAll(queryDto: QueryAppointmentDto): Promise<Appointment[]> {
    return this.appointmentsRepository.findAll(queryDto.status);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateStatusDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    return this.appointmentsRepository.updateStatus(
      id,
      updateDto.status as unknown as AppointmentStatus,
    );
  }
}

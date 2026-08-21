import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOverlapping(
    windowStart: Date,
    newEnd: Date,
  ): Promise<Appointment | null> {
    return this.prisma.appointment.findFirst({
      where: {
        status: {
          in: [AppointmentStatus.pending, AppointmentStatus.confirmed],
        },
        appointmentAt: {
          gt: windowStart,
          lt: newEnd,
        },
      },
    });
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
    });
  }

  async findAll(status?: AppointmentStatus): Promise<Appointment[]> {
    const whereClause = status ? { status } : {};
    return this.prisma.appointment.findMany({
      where: whereClause,
      orderBy: {
        appointmentAt: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}

import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class QueryAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'status filter must be one of: pending, confirmed, cancelled',
  })
  status?: AppointmentStatus;
}

import { IsEnum, IsNotEmpty } from 'class-validator';

export enum UpdateAppointmentStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'status cannot be empty' })
  @IsEnum(UpdateAppointmentStatus, {
    message: 'status must be either confirmed or cancelled',
  })
  status: UpdateAppointmentStatus;
}

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'patientName cannot be empty' })
  @IsString({ message: 'patientName must be a string' })
  patientName: string;

  @IsNotEmpty({ message: 'appointmentAt cannot be empty' })
  @IsDateString({}, { message: 'appointmentAt must be a valid ISO 8601 date string' })
  @IsFutureDate({ message: 'appointmentAt must be in the future' })
  appointmentAt: string;
}

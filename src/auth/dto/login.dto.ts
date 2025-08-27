import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password mínimo 6 caracteres' })
  password: string;
}
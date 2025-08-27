import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Nombre mínimo 2 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password mínimo 6 caracteres' })
  password: string;
}
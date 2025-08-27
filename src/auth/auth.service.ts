import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generar JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';  

import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Aquí van los métodos CRUD
    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,        // title, description, status (opcional)
            userId: user.id,         // Foreign key
            user: user              // Relación completa
        });

        return await this.tasksRepository.save(task);
        }
        async findAll(user: User): Promise<Task[]> {
        return await this.tasksRepository.find({
            where: { userId: user.id },
            order:  { createdAt: 'DESC'}
        });
        }
        async findOne(id: number, user: User): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { 
            id: id,
            userId: user.id  // ← Doble validación: ID + propietario
            },
            relations: ['user']
        });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }

        return task;
        }
        async update(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const task = await this.findOne(id, user); // Reutiliza findOne para validar existencia y propiedad

        Object.assign(task, updateTaskDto); // Actualiza solo los campos presentes en el DTO

        return await this.tasksRepository.save(task);
        }
        async remove(id: number, user: User): Promise<void> {
        const task = await this.findOne(id, user); // Reutiliza findOne para validar existencia y propiedad

        await this.tasksRepository.remove(task);
        }
        async removeAll(user: User): Promise<void> {
        await this.tasksRepository.delete({ userId: user.id });
        }

}
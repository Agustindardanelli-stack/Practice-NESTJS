import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

  @Post()
    async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return await this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
    async findAll(@Request() req) {
    return await this.tasksService.findAll(req.user);
  }

  @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
    return await this.tasksService.findOne(+id, req.user);
  }

  @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return await this.tasksService.update(+id, updateTaskDto, req.user);
  }

  @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
    return await this.tasksService.remove(+id, req.user);
  }
}
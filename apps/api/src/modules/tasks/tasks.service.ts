import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { tasks } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createTaskDto: CreateTaskDto) {
    const [task] = await this.db
      .insert(tasks)
      .values(createTaskDto)
      .returning();

    return task;
  }

  async findAll() {
    return this.db.select().from(tasks);
  }

  async findByBrand(brandId: string) {
    return this.db.select().from(tasks).where(eq(tasks.brandId, brandId));
  }

  async findOne(id: string) {
    const [task] = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // First check if task exists
    await this.findOne(id);

    const [updatedTask] = await this.db
      .update(tasks)
      .set({
        ...updateTaskDto,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask;
  }

  async remove(id: string) {
    // First check if task exists
    await this.findOne(id);

    const [deletedTask] = await this.db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return deletedTask;
  }
}

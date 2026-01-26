import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { projects } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createProjectDto: CreateProjectDto) {
    const [project] = await this.db
      .insert(projects)
      .values({
        name: createProjectDto.name,
        description: createProjectDto.description,
        startDate: createProjectDto.startDate,
        endDate: createProjectDto.endDate,
        status: createProjectDto.status,
        priority: createProjectDto.priority,
        client: createProjectDto.client,
        typeLabel: createProjectDto.typeLabel,
        durationLabel: createProjectDto.durationLabel,
        priorityLabel: createProjectDto.priorityLabel,
        locationLabel: createProjectDto.locationLabel,
        sprintLabel: createProjectDto.sprintLabel,
        estimateLabel: createProjectDto.estimateLabel,
        dueDate: createProjectDto.dueDate,
        progressPercent: createProjectDto.progressPercent,
      })
      .returning();

    return project;
  }

  async findAll() {
    return this.db.select().from(projects);
  }

  async findOne(id: string) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // First check if project exists
    await this.findOne(id);

    const [updatedProject] = await this.db
      .update(projects)
      .set({
        ...updateProjectDto,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    return updatedProject;
  }

  async remove(id: string) {
    // First check if project exists
    await this.findOne(id);

    const [deletedProject] = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    return deletedProject;
  }
}

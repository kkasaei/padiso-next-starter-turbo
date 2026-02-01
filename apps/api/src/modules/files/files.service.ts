import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { files } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateFileDto, UpdateFileDto } from './dto';

@Injectable()
export class FilesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createFileDto: CreateFileDto) {
    const [file] = await this.db
      .insert(files)
      .values(createFileDto)
      .returning();

    return file;
  }

  async findAll() {
    return this.db.select().from(files);
  }

  async findByBrand(brandId: string) {
    return this.db.select().from(files).where(eq(files.brandId, brandId));
  }

  async findOne(id: string) {
    const [file] = await this.db
      .select()
      .from(files)
      .where(eq(files.id, id));

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    // First check if file exists
    await this.findOne(id);

    const [updatedFile] = await this.db
      .update(files)
      .set({
        ...updateFileDto,
        updatedAt: new Date(),
      })
      .where(eq(files.id, id))
      .returning();

    return updatedFile;
  }

  async remove(id: string) {
    // First check if file exists
    await this.findOne(id);

    const [deletedFile] = await this.db
      .delete(files)
      .where(eq(files.id, id))
      .returning();

    return deletedFile;
  }
}

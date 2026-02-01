import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { prompts } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreatePromptDto, UpdatePromptDto } from './dto';

@Injectable()
export class PromptsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createPromptDto: CreatePromptDto) {
    const [prompt] = await this.db
      .insert(prompts)
      .values(createPromptDto)
      .returning();

    return prompt;
  }

  async findAll() {
    return this.db.select().from(prompts);
  }

  async findByBrand(brandId: string) {
    return this.db.select().from(prompts).where(eq(prompts.brandId, brandId));
  }

  async findOne(id: string) {
    const [prompt] = await this.db
      .select()
      .from(prompts)
      .where(eq(prompts.id, id));

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    return prompt;
  }

  async update(id: string, updatePromptDto: UpdatePromptDto) {
    // First check if prompt exists
    await this.findOne(id);

    const [updatedPrompt] = await this.db
      .update(prompts)
      .set({
        ...updatePromptDto,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();

    return updatedPrompt;
  }

  async remove(id: string) {
    // First check if prompt exists
    await this.findOne(id);

    const [deletedPrompt] = await this.db
      .delete(prompts)
      .where(eq(prompts.id, id))
      .returning();

    return deletedPrompt;
  }

  async incrementUsage(id: string) {
    const prompt = await this.findOne(id);

    const [updatedPrompt] = await this.db
      .update(prompts)
      .set({
        usageCount: (prompt.usageCount || 0) + 1,
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();

    return updatedPrompt;
  }
}

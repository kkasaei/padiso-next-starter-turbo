import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { brands } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Injectable()
export class BrandsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createBrandDto: CreateBrandDto) {
    const [brand] = await this.db
      .insert(brands)
      .values({
        workspaceId: createBrandDto.workspaceId,
        websiteUrl: createBrandDto.websiteUrl,
        languages: createBrandDto.languages,
        targetAudiences: createBrandDto.targetAudiences,
        businessKeywords: createBrandDto.businessKeywords,
        competitors: createBrandDto.competitors,
        brandName: createBrandDto.brandName,
        brandColor: createBrandDto.brandColor,
        iconUrl: createBrandDto.iconUrl,
        sitemapUrl: createBrandDto.sitemapUrl,
        referralSource: createBrandDto.referralSource,
        status: createBrandDto.status,
        createdByUserId: createBrandDto.createdByUserId,
        isFavourite: createBrandDto.isFavourite,
      })
      .returning();

    return brand;
  }

  async findAll() {
    return this.db.select().from(brands);
  }

  async findByWorkspace(workspaceId: string) {
    return this.db
      .select()
      .from(brands)
      .where(eq(brands.workspaceId, workspaceId));
  }

  async findOne(id: string) {
    const [brand] = await this.db
      .select()
      .from(brands)
      .where(eq(brands.id, id));

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    // First check if brand exists
    await this.findOne(id);

    const [updatedBrand] = await this.db
      .update(brands)
      .set({
        ...updateBrandDto,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    return updatedBrand;
  }

  async remove(id: string) {
    // First check if brand exists
    await this.findOne(id);

    const [deletedBrand] = await this.db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();

    return deletedBrand;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { brandMembers } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateBrandMemberDto, UpdateBrandMemberDto } from './dto';

@Injectable()
export class BrandMembersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createBrandMemberDto: CreateBrandMemberDto) {
    const [member] = await this.db
      .insert(brandMembers)
      .values(createBrandMemberDto)
      .returning();

    return member;
  }

  async findAll() {
    return this.db.select().from(brandMembers);
  }

  async findByBrand(brandId: string) {
    return this.db
      .select()
      .from(brandMembers)
      .where(eq(brandMembers.brandId, brandId));
  }

  async findByUser(userId: string) {
    return this.db
      .select()
      .from(brandMembers)
      .where(eq(brandMembers.userId, userId));
  }

  async findOne(brandId: string, userId: string) {
    const [member] = await this.db
      .select()
      .from(brandMembers)
      .where(
        and(
          eq(brandMembers.brandId, brandId),
          eq(brandMembers.userId, userId),
        ),
      );

    if (!member) {
      throw new NotFoundException(
        `Brand member not found for brand ${brandId} and user ${userId}`,
      );
    }

    return member;
  }

  async update(
    brandId: string,
    userId: string,
    updateBrandMemberDto: UpdateBrandMemberDto,
  ) {
    // First check if member exists
    await this.findOne(brandId, userId);

    const [updatedMember] = await this.db
      .update(brandMembers)
      .set(updateBrandMemberDto)
      .where(
        and(
          eq(brandMembers.brandId, brandId),
          eq(brandMembers.userId, userId),
        ),
      )
      .returning();

    return updatedMember;
  }

  async remove(brandId: string, userId: string) {
    // First check if member exists
    await this.findOne(brandId, userId);

    const [deletedMember] = await this.db
      .delete(brandMembers)
      .where(
        and(
          eq(brandMembers.brandId, brandId),
          eq(brandMembers.userId, userId),
        ),
      )
      .returning();

    return deletedMember;
  }
}

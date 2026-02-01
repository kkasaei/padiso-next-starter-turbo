import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { workspaces } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto';

@Injectable()
export class WorkspacesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const [workspace] = await this.db
      .insert(workspaces)
      .values(createWorkspaceDto)
      .returning();

    return workspace;
  }

  async findAll() {
    return this.db.select().from(workspaces);
  }

  async findByClerkOrgId(clerkOrgId: string) {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.clerkOrgId, clerkOrgId));

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with Clerk Org ID ${clerkOrgId} not found`,
      );
    }

    return workspace;
  }

  async findOne(id: string) {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id));

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    // First check if workspace exists
    await this.findOne(id);

    const [updatedWorkspace] = await this.db
      .update(workspaces)
      .set({
        ...updateWorkspaceDto,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, id))
      .returning();

    return updatedWorkspace;
  }

  async remove(id: string) {
    // First check if workspace exists
    await this.findOne(id);

    const [deletedWorkspace] = await this.db
      .delete(workspaces)
      .where(eq(workspaces.id, id))
      .returning();

    return deletedWorkspace;
  }

  async incrementUsage(
    id: string,
    field: 'brands' | 'members' | 'storage' | 'apiCalls' | 'aiCredits',
    amount: number = 1,
  ) {
    const workspace = await this.findOne(id);

    const updates: any = {
      updatedAt: new Date(),
    };

    switch (field) {
      case 'brands':
        updates.usageBrandsCount = (workspace.usageBrandsCount || 0) + amount;
        updates.totalBrandsCreated =
          (workspace.totalBrandsCreated || 0) + amount;
        break;
      case 'members':
        updates.usageMembersCount = (workspace.usageMembersCount || 0) + amount;
        break;
      case 'storage':
        updates.usageStorageBytes = (workspace.usageStorageBytes || 0) + amount;
        updates.totalStorageBytesAllTime =
          (workspace.totalStorageBytesAllTime || 0) + amount;
        break;
      case 'apiCalls':
        updates.usageApiCallsCount =
          (workspace.usageApiCallsCount || 0) + amount;
        updates.totalApiCallsAllTime =
          (workspace.totalApiCallsAllTime || 0) + amount;
        break;
      case 'aiCredits':
        updates.usageAiCreditsUsed =
          (workspace.usageAiCreditsUsed || 0) + amount;
        updates.totalAiCreditsAllTime =
          (workspace.totalAiCreditsAllTime || 0) + amount;
        break;
    }

    const [updatedWorkspace] = await this.db
      .update(workspaces)
      .set(updates)
      .where(eq(workspaces.id, id))
      .returning();

    return updatedWorkspace;
  }
}

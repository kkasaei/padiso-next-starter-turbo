import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { subscriptions } from '@workspace/db';
import { DatabaseService } from '../../features/database/database.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const [subscription] = await this.db
      .insert(subscriptions)
      .values({
        ...createSubscriptionDto,
        currentPeriodStart: new Date(createSubscriptionDto.currentPeriodStart),
        currentPeriodEnd: new Date(createSubscriptionDto.currentPeriodEnd),
        startedAt: new Date(createSubscriptionDto.startedAt),
        trialStart: createSubscriptionDto.trialStart
          ? new Date(createSubscriptionDto.trialStart)
          : undefined,
        trialEnd: createSubscriptionDto.trialEnd
          ? new Date(createSubscriptionDto.trialEnd)
          : undefined,
        canceledAt: createSubscriptionDto.canceledAt
          ? new Date(createSubscriptionDto.canceledAt)
          : undefined,
        endedAt: createSubscriptionDto.endedAt
          ? new Date(createSubscriptionDto.endedAt)
          : undefined,
      })
      .returning();

    return subscription;
  }

  async findAll() {
    return this.db.select().from(subscriptions);
  }

  async findByWorkspace(workspaceId: string) {
    return this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId));
  }

  async findActiveByWorkspace(workspaceId: string) {
    return this.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.workspaceId, workspaceId),
          eq(subscriptions.isActive, true),
        ),
      );
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    const [subscription] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with Stripe ID ${stripeSubscriptionId} not found`,
      );
    }

    return subscription;
  }

  async findOne(id: string) {
    const [subscription] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    // First check if subscription exists
    await this.findOne(id);

    const updateData: any = {
      ...updateSubscriptionDto,
      updatedAt: new Date(),
    };

    // Convert date strings to Date objects
    if (updateSubscriptionDto.currentPeriodStart) {
      updateData.currentPeriodStart = new Date(
        updateSubscriptionDto.currentPeriodStart,
      );
    }
    if (updateSubscriptionDto.currentPeriodEnd) {
      updateData.currentPeriodEnd = new Date(
        updateSubscriptionDto.currentPeriodEnd,
      );
    }
    if (updateSubscriptionDto.startedAt) {
      updateData.startedAt = new Date(updateSubscriptionDto.startedAt);
    }
    if (updateSubscriptionDto.trialStart) {
      updateData.trialStart = new Date(updateSubscriptionDto.trialStart);
    }
    if (updateSubscriptionDto.trialEnd) {
      updateData.trialEnd = new Date(updateSubscriptionDto.trialEnd);
    }
    if (updateSubscriptionDto.canceledAt) {
      updateData.canceledAt = new Date(updateSubscriptionDto.canceledAt);
    }
    if (updateSubscriptionDto.endedAt) {
      updateData.endedAt = new Date(updateSubscriptionDto.endedAt);
    }

    const [updatedSubscription] = await this.db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning();

    return updatedSubscription;
  }

  async remove(id: string) {
    // First check if subscription exists
    await this.findOne(id);

    const [deletedSubscription] = await this.db
      .delete(subscriptions)
      .where(eq(subscriptions.id, id))
      .returning();

    return deletedSubscription;
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './features/database';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { BrandsModule } from './modules/brands/brands.module';
import { BrandMembersModule } from './modules/brand-members/brand-members.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { FilesModule } from './modules/files/files.module';
import { PromptsModule } from './modules/prompts/prompts.module';

@Module({
  imports: [
    DatabaseModule,
    WorkspacesModule,
    BrandsModule,
    BrandMembersModule,
    SubscriptionsModule,
    TasksModule,
    FilesModule,
    PromptsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

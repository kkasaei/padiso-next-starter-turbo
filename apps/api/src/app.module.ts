import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './features/database';
import { AuthModule } from './features/auth';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { BrandsModule } from './modules/brands/brands.module';
import { BrandMembersModule } from './modules/brand-members/brand-members.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { FilesModule } from './modules/files/files.module';
import { PromptsModule } from './modules/prompts/prompts.module';
import { McpModule } from './modules/mcp/mcp.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    WorkspacesModule,
    BrandsModule,
    BrandMembersModule,
    TasksModule,
    FilesModule,
    PromptsModule,
    McpModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

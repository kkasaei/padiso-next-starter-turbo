import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { BrandsModule } from '../brands/brands.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { TasksModule } from '../tasks/tasks.module';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [BrandsModule, WorkspacesModule, TasksModule, PromptsModule],
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}

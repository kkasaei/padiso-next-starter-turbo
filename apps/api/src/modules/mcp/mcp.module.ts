import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { BrandsModule } from '../brands/brands.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { DatabaseModule } from '../../features/database/database.module';

@Module({
  imports: [BrandsModule, WorkspacesModule, DatabaseModule],
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}

import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { BrandsModule } from '../brands/brands.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { DatabaseModule } from '../../features/database/database.module';
import { AuthModule } from '../../features/auth/auth.module';

@Module({
  imports: [BrandsModule, WorkspacesModule, DatabaseModule, AuthModule],
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}

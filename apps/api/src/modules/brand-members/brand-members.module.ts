import { Module } from '@nestjs/common';
import { BrandMembersService } from './brand-members.service';
import { BrandMembersController } from './brand-members.controller';
import { DatabaseModule } from '../../features/database';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandMembersController],
  providers: [BrandMembersService],
  exports: [BrandMembersService],
})
export class BrandMembersModule {}

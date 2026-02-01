import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BrandMemberRole } from './create-brand-member.dto';

export class UpdateBrandMemberDto {
  @ApiProperty({
    enum: BrandMemberRole,
    description: 'Updated member role',
    example: BrandMemberRole.ADMIN,
  })
  @IsEnum(BrandMemberRole)
  role: BrandMemberRole;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID } from 'class-validator';

export enum BrandMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export class CreateBrandMemberDto {
  @ApiProperty({
    description: 'Brand ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abc123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    enum: BrandMemberRole,
    description: 'Member role',
    example: BrandMemberRole.EDITOR,
    default: BrandMemberRole.OWNER,
  })
  @IsEnum(BrandMemberRole)
  role: BrandMemberRole;
}

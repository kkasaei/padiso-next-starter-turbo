import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export enum FileType {
  PDF = 'pdf',
  ZIP = 'zip',
  FIG = 'fig',
  DOC = 'doc',
  FILE = 'file',
}

export class CreateFileDto {
  @ApiProperty({
    description: 'Brand ID that this file belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'File name',
    example: 'Brand Guidelines.pdf',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: FileType,
    description: 'File type',
    example: FileType.PDF,
  })
  @IsEnum(FileType)
  type: FileType;

  @ApiProperty({
    description: 'File size in MB',
    example: 5,
  })
  @IsInt()
  @Min(0)
  sizeMB: number;

  @ApiProperty({
    description: 'File URL',
    example: 'https://storage.example.com/files/brand-guidelines.pdf',
  })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    description: 'File description',
    example: 'Complete brand guidelines for 2024',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Is this file a link asset',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isLinkAsset?: boolean;

  @ApiProperty({
    description: 'Clerk user ID of who added this file',
    example: 'user_2abc123',
  })
  @IsString()
  addedById: string;
}

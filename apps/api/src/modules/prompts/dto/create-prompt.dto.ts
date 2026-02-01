import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({
    description: 'Brand ID that this prompt belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'Prompt template name',
    example: 'Blog Post Generator',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Prompt description',
    example: 'Generate engaging blog posts based on keywords',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'The actual prompt content with variable placeholders like {{keyword}}',
    example:
      'Write a blog post about {{topic}} targeting {{audience}} with a {{tone}} tone.',
  })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Tags for categorizing prompts',
    example: ['blog', 'content', 'marketing'],
    default: [],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Configuration object for AI provider settings',
    example: { model: 'gpt-4', temperature: 0.7, max_tokens: 1000 },
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Clerk user ID of who created this prompt',
    example: 'user_2abc123',
  })
  @IsString()
  @IsOptional()
  createdByUserId?: string;
}

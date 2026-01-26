import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum ProjectStatus {
  BACKLOG = 'backlog',
  PLANNED = 'planned',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum ProjectPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'New Website Redesign' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Complete redesign of the company website',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Project start date',
    example: '2024-01-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Project end date',
    example: '2024-06-30',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    enum: ProjectStatus,
    description: 'Project status',
    example: ProjectStatus.PLANNED,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({
    enum: ProjectPriority,
    description: 'Project priority',
    example: ProjectPriority.HIGH,
  })
  @IsEnum(ProjectPriority)
  priority: ProjectPriority;

  @ApiPropertyOptional({
    description: 'Client name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsOptional()
  client?: string;

  @ApiPropertyOptional({
    description: 'Project type label',
    example: 'Development',
  })
  @IsString()
  @IsOptional()
  typeLabel?: string;

  @ApiPropertyOptional({
    description: 'Duration label',
    example: '6 months',
  })
  @IsString()
  @IsOptional()
  durationLabel?: string;

  @ApiPropertyOptional({
    description: 'Priority label for display',
    example: 'High Priority',
  })
  @IsString()
  @IsOptional()
  priorityLabel?: string;

  @ApiPropertyOptional({
    description: 'Location label',
    example: 'Remote',
  })
  @IsString()
  @IsOptional()
  locationLabel?: string;

  @ApiPropertyOptional({
    description: 'Sprint label',
    example: 'Sprint 1',
  })
  @IsString()
  @IsOptional()
  sprintLabel?: string;

  @ApiPropertyOptional({
    description: 'Estimate label',
    example: '120 hours',
  })
  @IsString()
  @IsOptional()
  estimateLabel?: string;

  @ApiPropertyOptional({
    description: 'Due date',
    example: '2024-06-30',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Progress percentage (0-100)',
    example: 25,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercent?: number;
}

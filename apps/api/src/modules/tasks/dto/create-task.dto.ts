import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TaskPriority {
  NO_PRIORITY = 'no-priority',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Brand ID that this task belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Complete homepage redesign',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Redesign the homepage to match new brand guidelines',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    description: 'Task status',
    example: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    description: 'Task priority',
    example: TaskPriority.HIGH,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Task tag',
    example: 'design',
  })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Assignee Clerk user ID',
    example: 'user_2abc123',
  })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    description: 'Task start date',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Task end date',
    example: '2024-01-30',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Due label for display',
    example: 'Due in 5 days',
  })
  @IsString()
  @IsOptional()
  dueLabel?: string;

  @ApiPropertyOptional({
    description: 'Due tone for styling',
    example: 'warning',
  })
  @IsString()
  @IsOptional()
  dueTone?: string;
}

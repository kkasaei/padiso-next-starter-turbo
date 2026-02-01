import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';

/**
 * Update Workspace DTO
 * Note: name, slug, and logoUrl are managed by Clerk and cannot be updated here.
 * Only clerkOrgId and business logic fields (billing, usage, etc.) can be updated.
 */
export class UpdateWorkspaceDto extends PartialType(
  OmitType(CreateWorkspaceDto, ['clerkOrgId'] as const),
) {}

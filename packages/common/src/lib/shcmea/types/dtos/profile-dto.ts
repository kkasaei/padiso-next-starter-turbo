import type { PersonalDetailsDto } from '@/types/dtos/personal-details-dto';
import type { PreferencesDto } from '@/types/dtos/preferences-dto';

// Clerk roles
type ClerkRole = 'org:admin' | 'org:member';

type ActiveOrganizationPermissions = { isOwner: boolean; role: ClerkRole };

export type ProfileDto = PersonalDetailsDto &
  PreferencesDto &
  ActiveOrganizationPermissions;

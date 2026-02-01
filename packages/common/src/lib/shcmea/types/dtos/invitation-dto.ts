// Note: Invitations are now handled by Clerk
// These types remain for backward compatibility but won't be actively used

// Clerk role types
type ClerkRole = 'org:admin' | 'org:member';

export type InvitationDto = {
  id: string;
  token: string;
  status: string; // Clerk invitation status
  email: string;
  role: ClerkRole;
  lastSent?: Date;
  dateAdded: Date;
};

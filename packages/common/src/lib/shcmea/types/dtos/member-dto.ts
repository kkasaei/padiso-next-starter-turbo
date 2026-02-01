// Clerk role types
type ClerkRole = 'org:admin' | 'org:member';

export type MemberDto = {
  id: string;
  image?: string;
  name: string;
  email: string;
  role: ClerkRole;
  isOwner: boolean;
  dateAdded: Date;
  lastLogin?: Date;
};

// Project status enum (mirrors database enum)
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED'

export type ProjectSettingsDto = {
  trackingFrequency?: 'daily' | 'weekly' | 'monthly';
  keywords?: string[];
  competitors?: string[];
  notifications?: {
    email?: boolean;
    slack?: boolean;
    discordWebhook?: string;
  };
  aiProvider?: string;
};

export type ProjectDto = {
  id: string;
  name: string;
  websiteUrl: string | null;
  description: string | null;
  status: ProjectStatus;
  isFavorite: boolean;
  iconUrl: string | null;
  settings: ProjectSettingsDto | null;
  orgId: string | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectListDto = {
  projects: ProjectDto[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};


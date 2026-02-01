import type { SiteDiscoveryState } from './site-discovery';
import type { ContextFilesState } from './context-files';

export type TrackingFrequency = 'daily' | 'weekly' | 'monthly';

export interface ProjectFormData {
  name: string;
  description: string;
  websiteUrl: string;
  country: string; // Primary country for the project
  aiGuidelines: string;
  trackingFrequency: TrackingFrequency;
  keywords: string;
  competitors: string;
  locations: string;
  // Site discovery configuration (llms.txt, sitemap.xml, etc.)
  siteDiscovery?: SiteDiscoveryState;
  // RAG context files (uploaded documents)
  contextFiles?: ContextFilesState;
}


import type { Metadata } from 'next';
import { TechnicalAuditHero } from '@/components/marketing/sections/TechnicalAuditHero';

export const metadata: Metadata = {
  title: 'Technical Audit | SearchFIT',
  description: 'Comprehensive SEO analysis and optimization recommendations. Find and fix technical issues that hurt your rankings.',
};

export default function TechnicalAuditPage() {
  return <TechnicalAuditHero />;
}

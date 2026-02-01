import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { AEOReport } from '@workspace/common/lib';

// Import all page components
import { PDFCoverPage } from './pages/PdfCoverPage';
import { PDFScoresSummary } from './pages/PdfScoresSummary';
import { PDFBrandRecognitionPage } from './pages/PdfBrandRecognition';
import { PDFPositioningCompetition } from './pages/PdfPositioningCompetition';
import { PDFSentimentAnalysis } from './pages/PdfSentimentAnalysis';
import { PDFStrategicInsights } from './pages/PdfStrategicInsights';
import { PDFNarrativeThemes } from './pages/PdfNarrativeThemes';
import { PDFContentIdeas } from './pages/PdfContentIdeas';
import { PDFAboutSearchFit } from './pages/PdfAboutSearchfit';
import { PDFContactCTA } from './pages/PdfContactCta';
import { PDFThankYou } from './pages/PdfThankYou';

interface PDFDocumentProps {
  data: AEOReport;
  domain: string;
}

/**
 * Main PDF Document - AEO Report
 * Matches SerchFIT.io report design exactly
 *
 * Structure (13 pages):
 * 1. Cover Page
 * 2. AEO Scores Summary
 * 3. Brand Recognition
 * 4-6. Brand Positioning (3 pages - one per provider: ChatGPT, Perplexity, Gemini)
 * 7. Sentiment Analysis
 * 8. Strategic Insights
 * 9. Narrative Themes
 * 10. Content Ideas
 * 11. About SearchFit
 * 12. Contact CTA
 * 13. Thank You
 */
export function AEOReportPDF({ data, domain }: PDFDocumentProps) {
  // Calculate average score
  const averageScore = Math.round(
    data.llmProviders.reduce((sum, p) => sum + p.score, 0) / data.llmProviders.length
  );

  // Format date
  const generatedDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Generate report ID
  const reportId = `${Date.now()}-1`;

  return (
    <Document
      title={`${domain} - AEO Report`}
      author="SearchFit"
      subject="Answer Engine Optimization Report"
      keywords="AEO, AI Search, SearchFit"
      creator="SearchFit"
      producer="SearchFit"
    >
      {/* Page 1: Cover Page */}
      <PDFCoverPage domain={domain} generatedDate={generatedDate} reportId={reportId} />

      {/* Page 2: AEO Scores Summary */}
      <PDFScoresSummary llmProviders={data.llmProviders} domain={domain} generatedDate={generatedDate} />

      {/* Page 3: Brand Recognition */}
      <PDFBrandRecognitionPage brandRecognition={data.brandRecognition} domain={domain} generatedDate={generatedDate} />

      {/* Pages 4-6: Positioning & Competition (3 pages - one per provider) */}
      <PDFPositioningCompetition
        brandPositioning={data.brandPositioning}
        marketCompetition={data.marketCompetition}
        domain={domain}
        generatedDate={generatedDate}
      />

      {/* Page 7: Sentiment Analysis */}
      <PDFSentimentAnalysis sentimentAnalysis={data.sentimentAnalysis} domain={domain} generatedDate={generatedDate} />

      {/* Page 8: Strategic Insights */}
      <PDFStrategicInsights analysisSummary={data.analysisSummary} domain={domain} generatedDate={generatedDate} />

      {/* Page 9: Narrative Themes */}
      <PDFNarrativeThemes narrativeThemes={data.narrativeThemes} domain={domain} generatedDate={generatedDate} />

      {/* Page 10: Content Ideas */}
      <PDFContentIdeas contentIdeas={data.contentIdeas} domain={domain} generatedDate={generatedDate} />

      {/* Page 11: About SearchFit */}
      <PDFAboutSearchFit domain={domain} generatedDate={generatedDate} />

      {/* Page 12: Contact CTA */}
      <PDFContactCTA />

      {/* Page 13: Thank You */}
      <PDFThankYou />
    </Document>
  );
}

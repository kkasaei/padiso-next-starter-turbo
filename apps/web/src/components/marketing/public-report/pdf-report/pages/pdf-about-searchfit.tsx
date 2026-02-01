import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/pdf-decorative-curves';
import { pdfStyles, colors } from '../pdf-styles';

interface PDFAboutSearchFitProps {
  domain: string;
  generatedDate: string;
}

/**
 * Page 11: About SearchFit
 */
export function PDFAboutSearchFit({ domain, generatedDate }: PDFAboutSearchFitProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>About Us</Text>
        <Text style={pdfStyles.pageTitle}>SEARCHFIT</Text>

        <Text style={{ fontSize: 12, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 12 }}>
          Leading Answer Engine Optimization platform helping brands succeed in AI-powered search.
        </Text>

        {/* What We Do */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 8 }}>
            What We Do
          </Text>
          <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4, marginBottom: 6 }}>
            SearchFit is the industry-leading Answer Engine Optimization (AEO) platform that helps businesses optimize
            their presence in AI-powered search engines like ChatGPT, Perplexity, Gemini, and Claude.
          </Text>
          <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>
            We analyze how your brand appears across major AI platforms, identify opportunities for improvement, and
            provide actionable strategies to enhance your visibility and positioning in the AI-first search landscape.
          </Text>
        </View>

        {/* Our Services */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 8 }}>
            Our Services
          </Text>
          <Text style={{ fontSize: 10, color: colors.text, marginBottom: 5 }}>• AEO Performance Monitoring & Analytics</Text>
          <Text style={{ fontSize: 10, color: colors.text, marginBottom: 5 }}>• Brand Visibility Optimization</Text>
          <Text style={{ fontSize: 10, color: colors.text, marginBottom: 5 }}>• Competitive Intelligence & Benchmarking</Text>
          <Text style={{ fontSize: 10, color: colors.text, marginBottom: 5 }}>• Content Strategy for AI Discoverability</Text>
          <Text style={{ fontSize: 10, color: colors.text, marginBottom: 5 }}>• AI Search Ranking Improvement</Text>
        </View>

        {/* Why It Matters */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 8 }}>
            Why AEO Matters
          </Text>
          <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>
            As consumers increasingly turn to AI-powered search engines for answers, traditional SEO is no longer enough.
            AEO ensures your brand is accurately represented, favorably positioned, and consistently cited by AI
            platforms when users ask questions related to your industry.
          </Text>
        </View>
      </View>

      {/* Page Footer */}
      <Text
        style={{
          position: 'absolute',
          bottom: 10,
          left: 80,
          fontSize: 12,
          color: colors.textGray,
        }}
      >
        11 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

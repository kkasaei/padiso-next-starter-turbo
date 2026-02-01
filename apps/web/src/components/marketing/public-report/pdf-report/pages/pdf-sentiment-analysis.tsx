import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/pdf-decorative-curves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@/lib/shcmea/aeo-report';

interface PDFSentimentAnalysisProps {
  sentimentAnalysis: AEOReport['sentimentAnalysis'];
  domain: string;
  generatedDate: string;
}

/**
 * Get provider logo from CDN
 * Note: React PDF has limited SVG support, so we use PNG versions for better compatibility
 */
function getProviderLogo(providerName: string): string {
  const name = providerName.toLowerCase();
  if (name.includes('chatgpt') || name.includes('openai')) {
    return 'https://cdn.searchfit.ai/assets/icons/openai.png';
  }
  if (name.includes('perplexity')) {
    return 'https://cdn.searchfit.ai/assets/icons/perplexity.png';
  }
  if (name.includes('gemini')) {
    return 'https://cdn.searchfit.ai/assets/icons/gemini.png';
  }
  return 'https://cdn.searchfit.ai/assets/icons/openai.png';
}

/**
 * Page 7: Sentiment Analysis
 */
export function PDFSentimentAnalysis({ sentimentAnalysis, domain, generatedDate }: PDFSentimentAnalysisProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();
  // Calculate average sentiment score
  const averageScore = Math.round(
    sentimentAnalysis.reduce((sum, sa) => sum + sa.totalScore, 0) / sentimentAnalysis.length
  );

  // Determine sentiment label based on average score
  const sentimentLabel = averageScore >= 70 ? 'Positive' : averageScore >= 40 ? 'Neutral' : 'Negative';
  const sentimentColor = averageScore >= 70 ? colors.primary : averageScore >= 40 ? colors.textGray : '#EF4444';

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>Perception Analysis</Text>
        <Text style={pdfStyles.pageTitle}>BRAND SENTIMENT</Text>

        <Text style={{ fontSize: 13, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 16 }}>
          How AI platforms perceive and present your brand&apos;s reputation and strengths.
        </Text>

        {/* Overall Sentiment - Compact */}
        <View style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: sentimentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: colors.white }}>{averageScore}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 4 }}>
              {sentimentLabel} Sentiment
            </Text>
            <Text style={{ fontSize: 12, color: colors.textGray }}>
              Average across {sentimentAnalysis.length} AI platforms
            </Text>
          </View>
        </View>

        {/* Provider Breakdown with Logos */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
            Platform Sentiment Scores
          </Text>
          {sentimentAnalysis.map((sa) => (
            <View key={sa.provider} style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              {/* Provider Logo */}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                src={getProviderLogo(sa.provider)}
                style={{
                  width: 28,
                  height: 28,
                  marginTop: 2,
                }}
              />

              {/* Provider Details */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 3 }}>
                  {sa.provider}: {sa.totalScore}/100
                </Text>
                <Text style={{ fontSize: 10, color: colors.textGray }}>
                  Polarization: {sa.polarization}% • Reliable Data: {sa.reliableData ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Key Sentiment Metrics (from first provider) */}
        {sentimentAnalysis[0] && sentimentAnalysis[0].metrics.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
              Key Sentiment Metrics
            </Text>
            {sentimentAnalysis[0].metrics.slice(0, 3).map((metric) => (
              <View key={metric.category} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 3 }}>
                  {metric.category} ({metric.score}/100)
                </Text>
                <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>{metric.description}</Text>
              </View>
            ))}
          </View>
        )}
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
        7 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/PdfDecorativeCurves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@workspace/common/lib';

interface PDFScoresSummaryProps {
  llmProviders: AEOReport['llmProviders'];
  domain: string;
  generatedDate: string;
}

/**
 * Get provider logo path
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
  return 'https://cdn.searchfit.ai/assets/icons/openai.png'; // Default fallback
}

/**
 * Get status message based on score
 */
function getStatusMessage(status: string, score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return "You're on the right track";
  if (score >= 40) return 'Needs improvement';
  return 'Critical attention needed';
}

/**
 * Get score color based on value
 */
function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#3B82F6'; // Blue
  if (score >= 40) return '#F59E0B'; // Orange
  return '#EF4444'; // Red
}

/**
 * Page 2: AEO Scores Summary
 * Shows scores from all AI providers with their logos
 */
export function PDFScoresSummary({ llmProviders, domain, generatedDate }: PDFScoresSummaryProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>AI Visibility Analysis</Text>
        <Text style={pdfStyles.pageTitle}>AEO Score (Overall)</Text>

        <Text style={{ fontSize: 14, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 20 }}>
          Your Answer Engine Optimization performance across major AI platforms
        </Text>

      {/* Provider Score Cards */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 24 }}>
        {llmProviders.map((provider) => {
          const scoreColor = getScoreColor(provider.score);
          const statusMessage = getStatusMessage(provider.status, provider.score);

          return (
            <View
              key={provider.name}
              style={{
                flex: 1,
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1pt solid #E5E7EB',
              }}
            >
              {/* Provider Logo and Name */}
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, width: '100%' }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  src={getProviderLogo(provider.name)}
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: colors.text }}>
                  {provider.name}
                </Text>
              </View>

              {/* Circular Progress Chart */}
              <View style={{ position: 'relative', width: 140, height: 140, marginBottom: 16 }}>
                {/* Background Circle */}
                <View
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    border: `10pt solid #E5E7EB`,
                  }}
                />
                {/* Progress Circle (simulated with border) */}
                <View
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    border: `10pt solid ${scoreColor}`,
                    borderBottom: `10pt solid #E5E7EB`,
                    borderLeft: provider.score < 75 ? `10pt solid #E5E7EB` : undefined,
                  }}
                />
                {/* Score Text */}
                <View
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 42, fontFamily: 'Helvetica-Bold', color: scoreColor }}>
                    {provider.score}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.textGray }}>
                    /100
                  </Text>
                </View>
              </View>

              {/* Status Message */}
              <Text style={{ fontSize: 13, fontFamily: 'Helvetica', color: scoreColor, textAlign: 'center' }}>
                {statusMessage}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Bottom Information Box */}
      <View
        style={{
          backgroundColor: '#F0F9FF',
          borderRadius: 12,
          padding: 16,
          display: 'flex',
          flexDirection: 'row',
          gap: 14,
          border: '1pt solid #BAE6FD',
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            backgroundColor: '#E0F2FE',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src="https://cdn.searchfit.ai/assets/icons/trending-up.png"
            style={{ width: 20, height: 20 }}
          />
        </View>

        {/* Text Content */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 6 }}>
            You&apos;re on the right track
          </Text>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica', color: colors.textGray, lineHeight: 1.5 }}>
            There&apos;s room to further optimize for AEO. Review the report below to see your brand&apos;s answer engine performance versus competitors and areas for growth.
          </Text>
        </View>
      </View>
      </View>

      {/* Page Footer - Absolutely positioned at bottom */}
      <Text
        style={{
          position: 'absolute',
          bottom: 10,
          left: 80,
          fontSize: 12,
          color: colors.textGray,
        }}
      >
        2 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

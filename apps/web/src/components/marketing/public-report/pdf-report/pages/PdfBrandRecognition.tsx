import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/PdfDecorativeCurves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@/lib/shcmea/aeo-report';

interface PDFBrandRecognitionPageProps {
  brandRecognition: AEOReport['brandRecognition'];
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
  return 'https://cdn.searchfit.ai/assets/icons/openai.png';
}

/**
 * Get score color based on value
 */
function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#F59E0B'; // Orange
  if (score >= 40) return '#3B82F6'; // Blue
  return '#EF4444'; // Red
}

/**
 * Get market position badge text
 */
function getMarketPosition(score: number): string {
  if (score >= 90) return 'Leader';
  if (score >= 70) return 'Emerging';
  if (score >= 50) return 'Established';
  return 'Growing';
}

/**
 * Page 3: Brand Recognition Analysis
 */
export function PDFBrandRecognitionPage({ brandRecognition, domain, generatedDate }: PDFBrandRecognitionPageProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>Brand Analysis</Text>
        <Text style={pdfStyles.pageTitle}>Brand Recognition</Text>

        <Text style={{ fontSize: 14, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 20 }}>
          Shows how visible your brand is across digital channels. Higher scores mean more people recognize your brand name.
        </Text>

        {/* Provider Cards */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
          {brandRecognition.map((br) => {
            const scoreColor = getScoreColor(br.score);
            const marketPosition = getMarketPosition(br.score);

            return (
              <View
                key={br.provider}
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1pt solid #E5E7EB',
                }}
              >
                {/* Provider Logo, Name and Badge */}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src={getProviderLogo(br.provider)}
                      style={{ width: 28, height: 28 }}
                    />
                    <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: colors.text }}>
                      {br.provider}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: colors.textGray }}>
                    {marketPosition}
                  </Text>
                </View>

                {/* Score */}
                <Text style={{ fontSize: 48, fontFamily: 'Helvetica-Bold', color: scoreColor, marginBottom: 4 }}>
                  {br.score}
                  <Text style={{ fontSize: 20, color: colors.textGray }}> /100</Text>
                </Text>

                {/* Progress Bar */}
                <View style={{ marginBottom: 16 }}>
                  <View style={{ width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 }}>
                    <View
                      style={{
                        width: `${br.score}%`,
                        height: 8,
                        backgroundColor: scoreColor,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                </View>

                {/* Brand Archetype and Confidence */}
                <View style={{ marginBottom: 16 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image
                        src="https://cdn.searchfit.ai/assets/icons/user.png"
                        style={{ width: 14, height: 14 }}
                      />
                      <Text style={{ fontSize: 11, color: colors.textGray }}>Brand Archetype</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image
                        src="https://cdn.searchfit.ai/assets/icons/trending-up.png"
                        style={{ width: 14, height: 14 }}
                      />
                      <Text style={{ fontSize: 11, color: colors.textGray }}>Confidence</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: colors.text, flex: 1 }}>
                      {br.brandArchetype}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: colors.text }}>
                      {br.confidenceLevel}%
                    </Text>
                  </View>
                </View>

                {/* Metrics Row */}
                <View style={{ display: 'flex', flexDirection: 'row', gap: 12, paddingTop: 12, borderTop: '1pt solid #E5E7EB' }}>
                  {/* Mention Depth */}
                  <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src="https://cdn.searchfit.ai/assets/icons/eye.png"
                      style={{ width: 20, height: 20, marginBottom: 4 }}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 2 }}>
                      {br.mentionDepth}
                    </Text>
                    <Text style={{ fontSize: 9, color: colors.textGray, textAlign: 'center' }}>
                      Mention Depth
                    </Text>
                  </View>

                  {/* Source Quality */}
                  <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src="https://cdn.searchfit.ai/assets/icons/award.png"
                      style={{ width: 20, height: 20, marginBottom: 4 }}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 2 }}>
                      {br.sourceQuality}
                    </Text>
                    <Text style={{ fontSize: 9, color: colors.textGray, textAlign: 'center' }}>
                      Source Quality
                    </Text>
                  </View>

                  {/* Data Richness */}
                  <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src="https://cdn.searchfit.ai/assets/icons/database.png"
                      style={{ width: 20, height: 20, marginBottom: 4 }}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 2 }}>
                      {br.dataRichness}
                    </Text>
                    <Text style={{ fontSize: 9, color: colors.textGray, textAlign: 'center' }}>
                      Data Richness
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
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
        3 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

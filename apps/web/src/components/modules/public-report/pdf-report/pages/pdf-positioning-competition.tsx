import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/pdf-decorative-curves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@/schemas/aeo-report';

interface PDFPositioningCompetitionProps {
  brandPositioning: AEOReport['brandPositioning'];
  marketCompetition: AEOReport['marketCompetition'];
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
 * Page 4-6: Brand Positioning & Market Competition (3 pages - one per provider)
 */
export function PDFPositioningCompetition({
  brandPositioning,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  marketCompetition,
  domain,
  generatedDate,
}: PDFPositioningCompetitionProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <>
      {brandPositioning.providers.map((provider, index) => {
        const pageNumber = 4 + index;
        const yourBrand = provider.positions.find((pos) => pos.isYourBrand);
        const allPositions = provider.positions;

        // Calculate max value for bar chart scaling
        const maxValue = Math.max(...allPositions.map((pos) => Math.abs(pos.x) + Math.abs(pos.y)));

        return (
          <Page key={provider.provider} size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
            {/* Decorative Curves */}
            <PDFDecorativeCurves />

            {/* Main Content */}
            <View style={pdfStyles.contentPage}>
              <Text style={pdfStyles.sectionName}>Market Position</Text>
              <Text style={pdfStyles.pageTitle}>Brand Positioning</Text>

              <Text style={{ fontSize: 13, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 12 }}>
                See where your brand stands in the competitive landscape
              </Text>

              {/* Provider Badge */}
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  src={getProviderLogo(provider.provider)}
                  style={{ width: 28, height: 28 }}
                />
                <View
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.white }}>
                    {provider.provider}
                  </Text>
                </View>
              </View>

              {/* Horizontal Bar Chart */}
              <View style={{ marginBottom: 12 }}>
                {/* Chart Title */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.text }}>
                    Market Position Score
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.textGray }}>
                    {brandPositioning.xAxisLabel.low} to {brandPositioning.xAxisLabel.high}
                  </Text>
                </View>

                {/* Bar Chart - Your Brand First */}
                {yourBrand && (
                  <View style={{ marginBottom: 8 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.text, width: 160 }}>
                        {yourBrand.name}
                      </Text>
                      <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View
                          style={{
                            backgroundColor: colors.primary,
                            height: 22,
                            width: `${(Math.abs(yourBrand.x) / maxValue) * 100}%`,
                            borderRadius: 4,
                          }}
                        />
                        <Text style={{ fontSize: 10, color: colors.text, marginLeft: 6 }}>
                          {yourBrand.x.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Competitors - Limit to 4 for consistent height */}
                {allPositions
                  .filter((pos) => !pos.isYourBrand)
                  .slice(0, 4)
                  .map((pos, idx) => (
                    <View key={pos.name} style={{ marginBottom: 6 }}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Helvetica',
                            color: colors.textGray,
                            width: 160,
                          }}
                        >
                          {pos.name}
                        </Text>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <View
                            style={{
                              backgroundColor: idx % 2 === 0 ? '#93C5FD' : '#60A5FA',
                              height: 18,
                              width: `${(Math.abs(pos.x) / maxValue) * 100}%`,
                              borderRadius: 4,
                            }}
                          />
                          <Text style={{ fontSize: 9, color: colors.textGray, marginLeft: 6 }}>
                            {pos.x.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>

              {/* Axis Info */}
              <View
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 6,
                  padding: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 4 }}>
                  Positioning Scale:
                </Text>
                <Text style={{ fontSize: 9, color: colors.textGray, lineHeight: 1.4 }}>
                  X-Axis: {brandPositioning.xAxisLabel.low} (left) → {brandPositioning.xAxisLabel.high} (right)
                </Text>
                <Text style={{ fontSize: 9, color: colors.textGray, lineHeight: 1.4 }}>
                  Y-Axis: {brandPositioning.yAxisLabel.low} (bottom) → {brandPositioning.yAxisLabel.high} (top)
                </Text>
              </View>

              {/* Interpretation */}
              <View style={{ marginTop: 10, paddingTop: 10, borderTop: '1pt solid #E5E7EB' }}>
                <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.5 }}>
                  {yourBrand ? (
                    <>
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>Interpretation: </Text>
                      Your brand is positioned at {yourBrand.x.toFixed(1)} on the market scale.
                      {yourBrand.x > 0
                        ? ' This indicates a strong presence in the enterprise/premium segment.'
                        : ' This suggests positioning in the accessible/value-focused segment.'
                      }
                    </>
                  ) : (
                    <>
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>Interpretation: </Text>
                      This chart shows how brands are positioned across the market spectrum.
                      Longer bars indicate stronger positioning in enterprise/premium segment.
                    </>
                  )}
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
              {pageNumber} | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
            </Text>
          </Page>
        );
      })}
    </>
  );
}

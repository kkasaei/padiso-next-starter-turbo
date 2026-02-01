import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/PdfDecorativeCurves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@/lib/shcmea/aeo-report';

interface PDFStrategicInsightsProps {
  analysisSummary: AEOReport['analysisSummary'];
  domain: string;
  generatedDate: string;
}

/**
 * Page 8: Strategic Insights & Recommendations
 */
export function PDFStrategicInsights({ analysisSummary, domain, generatedDate }: PDFStrategicInsightsProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>Strategic Recommendations</Text>
        <Text style={pdfStyles.pageTitle}>KEY INSIGHTS</Text>

        <Text style={{ fontSize: 13, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 16 }}>
          Actionable insights to improve your AI visibility and brand positioning.
        </Text>

        {/* Market Trajectory */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
            Market Trajectory
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: colors.primary,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.white }}>
                {analysisSummary.marketTrajectory.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: colors.text, lineHeight: 1.5 }}>
            {analysisSummary.marketTrajectory.description}
          </Text>
        </View>

        {/* Strengths */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
            Key Strengths
          </Text>
          {analysisSummary.strengths.slice(0, 2).map((strength, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 3 }}>
                {strength.title}
              </Text>
              <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>{strength.description}</Text>
            </View>
          ))}
        </View>

        {/* Opportunities */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
            Growth Opportunities
          </Text>
          {analysisSummary.opportunities.slice(0, 2).map((opportunity, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 3 }}>
                {opportunity.title}
              </Text>
              <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>{opportunity.description}</Text>
            </View>
          ))}
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
        8 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

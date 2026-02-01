import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/PdfDecorativeCurves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@workspace/common/lib';

interface PDFNarrativeThemesProps {
  narrativeThemes: AEOReport['narrativeThemes'];
  domain: string;
  generatedDate: string;
}

/**
 * Page 9: Narrative Themes
 */
export function PDFNarrativeThemes({ narrativeThemes, domain, generatedDate }: PDFNarrativeThemesProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>Content Strategy</Text>
        <Text style={pdfStyles.pageTitle}>NARRATIVE THEMES</Text>

        <Text style={{ fontSize: 12, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 12 }}>
          Common themes and narratives that AI platforms associate with your brand.
        </Text>

        {/* Narrative Themes List */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
            Key Narrative Themes
          </Text>
          {narrativeThemes.slice(0, 10).map((theme, index) => (
            <Text key={index} style={{ fontSize: 10, color: colors.text, marginBottom: 6, lineHeight: 1.3 }}>
              {index + 1}. {theme}
            </Text>
          ))}
        </View>

        {narrativeThemes.length > 10 && (
          <Text style={{ fontSize: 10, color: colors.textGray, marginTop: 8 }}>
            + {narrativeThemes.length - 10} more themes identified
          </Text>
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
        9 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

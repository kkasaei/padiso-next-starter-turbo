import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { PDFDecorativeCurves } from '../shared/PdfDecorativeCurves';
import { pdfStyles, colors } from '../pdf-styles';
import type { AEOReport } from '@workspace/common/lib';

interface PDFContentIdeasProps {
  contentIdeas: AEOReport['contentIdeas'];
  domain: string;
  generatedDate: string;
}

/**
 * Page 10: Content Ideas & Opportunities
 */
export function PDFContentIdeas({ contentIdeas, domain, generatedDate }: PDFContentIdeasProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  // Separate by priority
  const highPriority = contentIdeas.filter((idea) => idea.priority === 'high');
  const mediumPriority = contentIdeas.filter((idea) => idea.priority === 'medium');

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>Content Opportunities</Text>
        <Text style={pdfStyles.pageTitle}>CONTENT IDEAS</Text>

        <Text style={{ fontSize: 12, fontFamily: 'Helvetica', color: colors.textGray, marginBottom: 12 }}>
          Strategic content opportunities to improve your visibility in AI-powered search.
        </Text>

        {/* High-Priority Ideas */}
        {highPriority.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
              High-Priority Content Ideas
            </Text>
            {highPriority.slice(0, 2).map((idea, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.primary, marginBottom: 3 }}>
                  {idea.title} ({idea.category})
                </Text>
                <Text style={{ fontSize: 10, color: colors.text, lineHeight: 1.4 }}>{idea.description}</Text>
                {idea.topics.length > 0 && (
                  <Text style={{ fontSize: 9, color: colors.textGray, marginTop: 3 }}>
                    Topics: {idea.topics.slice(0, 4).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Medium-Priority Ideas */}
        {mediumPriority.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.text, marginBottom: 10 }}>
              Additional Content Ideas
            </Text>
            {mediumPriority.slice(0, 4).map((idea, index) => (
              <Text key={index} style={{ fontSize: 10, color: colors.text, marginBottom: 6, lineHeight: 1.3 }}>
                • {idea.title} ({idea.category})
              </Text>
            ))}
          </View>
        )}

        {contentIdeas.length > 6 && (
          <Text style={{ fontSize: 10, color: colors.textGray, marginTop: 10 }}>
            + {contentIdeas.length - 6} more content ideas available
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
        10 | {displayDomain} AEO REPORT - {generatedDate} | call +61 452 219 022
      </Text>
    </Page>
  );
}

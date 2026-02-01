import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles, colors } from '../pdf-styles';

interface PDFCoverPageProps {
  domain: string;
  generatedDate: string;
  reportId: string;
}

/**
 * Cover Page - Matches SerchFIT.io report design exactly
 * Shows domain name, report date, and contact information
 */
export function PDFCoverPage({ domain, generatedDate, reportId }: PDFCoverPageProps) {
  const displayDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toUpperCase();

  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Background Image */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src="https://cdn.searchfit.ai/assets/pdf/background.png"
        style={{
          position: 'absolute',
          width: 1280,
          height: 720,
          top: 0,
          left: 0,
        }}
      />

      {/* Main Content */}
      <View style={pdfStyles.coverPage}>
        {/* Top Section - Domain & Date */}
        <View>
          <Text style={pdfStyles.coverTitle}>{displayDomain}</Text>
          <Text style={pdfStyles.coverSubtitle}>AEO REPORT - {generatedDate}</Text>
        </View>

        {/* Bottom Section - Contact Info with Photo */}
        <View style={pdfStyles.coverFooter}>
          {/* Houman's Profile Photo */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src="https://cdn.searchfit.ai/assets/pdf/houman.jpeg"
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              border: `4pt solid ${colors.primary}`,
            }}
          />

          {/* Contact Details */}
          <View style={pdfStyles.profileInfo}>
            <Text style={pdfStyles.profileName}>Houman Asefi</Text>
            <Text style={pdfStyles.profileTitle}>CEO</Text>
            <Text style={pdfStyles.profileContact}>+61 452 219 022</Text>
            <Text style={pdfStyles.profileContact}>houman@searchfit.ai</Text>
          </View>
        </View>
      </View>

      {/* Report ID - Absolutely positioned at lower left */}
      <Text style={pdfStyles.reportId}>Report ID: {reportId}</Text>
    </Page>
  );
}

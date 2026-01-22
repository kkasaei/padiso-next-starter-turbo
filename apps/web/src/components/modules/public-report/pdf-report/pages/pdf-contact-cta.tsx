import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles, colors } from '../pdf-styles';

/**
 * Contact CTA Page - Matches SerchFIT.io report design exactly
 * Shows contact information and call-to-action
 */
export function PDFContactCTA() {
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
      <View style={pdfStyles.contactPage}>
        <Text style={pdfStyles.contactHeader}>Contact Me</Text>
        <Text style={pdfStyles.contactTitle}>We&apos;d love to tell you more!</Text>

        {/* Houman's Profile Photo */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          src="https://cdn.searchfit.ai/assets/pdf/houman.jpeg"
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            border: `5pt solid ${colors.primary}`,
            marginBottom: 24,
          }}
        />

        {/* Contact Details */}
        <Text style={pdfStyles.contactName}>Houman Asefi</Text>
        <Text style={pdfStyles.contactPosition}>CEO</Text>
        <View style={{ marginTop: 8 }}>
          <Text style={pdfStyles.contactDetails}>+61 452 219 022</Text>
          <Text style={pdfStyles.contactDetails}>houman@searchfit.ai</Text>
        </View>
      </View>
    </Page>
  );
}

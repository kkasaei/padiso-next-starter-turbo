import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';

/**
 * Thank You Page - Matches SerchFIT.io report design exactly
 * Simple thank you message
 */
export function PDFThankYou() {
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
      <View style={pdfStyles.thankYouPage}>
        <Text style={pdfStyles.thankYouText}>THANK YOU</Text>
      </View>
    </Page>
  );
}

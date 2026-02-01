import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { PDFDecorativeCurves } from './PdfDecorativeCurves';

interface PDFContentPageProps {
  sectionName: string;
  pageTitle: string;
  children: React.ReactNode;
}

/**
 * Reusable Content Page Layout - Matches SerchFIT.io report design
 * Section Name + Page Title + Content
 */
export function PDFContentPage({ sectionName, pageTitle, children }: PDFContentPageProps) {
  return (
    <Page size={{ width: 1280, height: 720 }} style={pdfStyles.page}>
      {/* Decorative Curves */}
      <PDFDecorativeCurves />

      {/* Main Content */}
      <View style={pdfStyles.contentPage}>
        <Text style={pdfStyles.sectionName}>{sectionName}</Text>
        <Text style={pdfStyles.pageTitle}>{pageTitle}</Text>
        <View>{children}</View>
      </View>
    </Page>
  );
}

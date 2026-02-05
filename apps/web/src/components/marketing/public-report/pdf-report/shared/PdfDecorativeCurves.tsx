import React from 'react';
import { View, Image } from '@react-pdf/renderer';

/**
 * Decorative curved lines background
 * Uses the CDN-hosted background image for server-side PDF generation
 */
export function PDFDecorativeCurves() {
  return (
    <View
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 1280,
        height: 720,
      }}
    >
      <Image
        src="https://cdn.searchfit.ai/assets/pdf/background.png"
        style={{
          width: 1280,
          height: 720,
          objectFit: 'cover',
        }}
      />
    </View>
  );
}

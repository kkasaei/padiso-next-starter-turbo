import React from 'react';
import { View, Image } from '@react-pdf/renderer';

/**
 * Decorative curved lines background
 * Uses the actual background image from public/pdf/width_1280.png
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
        src="/pdf/width_1280.png"
        style={{
          width: 1280,
          height: 720,
          objectFit: 'cover',
        }}
      />
    </View>
  );
}

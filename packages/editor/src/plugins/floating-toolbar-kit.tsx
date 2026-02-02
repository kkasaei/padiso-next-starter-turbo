'use client';

import { createPlatePlugin } from 'platejs/react';

import { FloatingToolbar } from '../floating-toolbar';
import { FloatingToolbarButtons } from '../floating-toolbar-buttons';

export const FloatingToolbarKit = [
  createPlatePlugin({
    key: 'floating-toolbar',
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      ),
    },
  }),
];

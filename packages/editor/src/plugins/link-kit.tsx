'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkElement } from '../link-node';
import { LinkFloatingToolbar } from '../link-toolbar';

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
];

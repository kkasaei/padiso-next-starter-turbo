import { BaseCalloutPlugin } from '@platejs/callout';

import { CalloutElementStatic } from '../callout-node-static';

export const BaseCalloutKit = [
  BaseCalloutPlugin.withComponent(CalloutElementStatic),
];

import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '../toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];

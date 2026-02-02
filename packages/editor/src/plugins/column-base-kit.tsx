import { BaseColumnItemPlugin, BaseColumnPlugin } from '@platejs/layout';

import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from '../column-node-static';

export const BaseColumnKit = [
  BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
  BaseColumnItemPlugin.withComponent(ColumnElementStatic),
];

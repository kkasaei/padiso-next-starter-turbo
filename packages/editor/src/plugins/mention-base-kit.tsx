import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '../mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];

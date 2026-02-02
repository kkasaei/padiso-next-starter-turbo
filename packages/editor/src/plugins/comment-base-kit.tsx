import { BaseCommentPlugin } from '@platejs/comment';

import { CommentLeafStatic } from '../comment-node-static';

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
];

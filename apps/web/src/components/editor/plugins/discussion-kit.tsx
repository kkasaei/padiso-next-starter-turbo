'use client';

import type { TComment } from '@/components/ui/comment';

import { createPlatePlugin } from 'platejs/react';

import { BlockDiscussion } from '@/components/ui/block-discussion';

export type TDiscussion = {
  id: string;
  comments: TComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
};

export type TDiscussionUser = {
  id: string;
  avatarUrl: string;
  name: string;
  hue?: number;
};

// Default empty state - will be configured by the parent component
const defaultDiscussions: TDiscussion[] = [];

// Default user data - will be populated dynamically
const defaultUsers: Record<string, TDiscussionUser> = {};

// This plugin is purely UI. It's only used to store the discussions and users data
// The currentUserId, discussions, and users should be configured by the parent component
export const discussionPlugin = createPlatePlugin({
  key: 'discussion',
  options: {
    currentUserId: '',
    discussions: defaultDiscussions,
    users: defaultUsers,
    // Callback when discussions change - for persistence
    onDiscussionsChange: undefined as ((discussions: TDiscussion[]) => void) | undefined,
  },
})
  .configure({
    render: { aboveNodes: BlockDiscussion },
  })
  .extendSelectors(({ getOption }) => ({
    currentUser: () => getOption('users')[getOption('currentUserId')],
    user: (id: string) => getOption('users')[id],
  }));

export const DiscussionKit = [discussionPlugin];

// Helper function to create initial configuration for the discussion plugin
export function createDiscussionConfig(config: {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatarUrl: string;
  discussions?: TDiscussion[];
  onDiscussionsChange?: (discussions: TDiscussion[]) => void;
}) {
  const users: Record<string, TDiscussionUser> = {
    [config.currentUserId]: {
      id: config.currentUserId,
      avatarUrl: config.currentUserAvatarUrl,
      name: config.currentUserName,
    },
  };

  // Add users from existing discussions
  if (config.discussions) {
    config.discussions.forEach((discussion) => {
      discussion.comments.forEach((comment) => {
        if (!users[comment.userId]) {
          // For users not yet in our map, we'll need to fetch their data
          // For now, create a placeholder
          users[comment.userId] = {
            id: comment.userId,
            avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${comment.userId}`,
            name: comment.userId,
          };
        }
      });
    });
  }

  return {
    currentUserId: config.currentUserId,
    discussions: config.discussions || [],
    users,
    onDiscussionsChange: config.onDiscussionsChange,
  };
}

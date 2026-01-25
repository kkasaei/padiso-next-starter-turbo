'use client';

import * as React from 'react';

import { MessageSquareShare } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ToolbarButton } from './toolbar';

// Custom event for sending selection to chat
export const SEND_TO_CHAT_EVENT = 'sendToChat';

export interface SendToChatEvent extends CustomEvent {
  detail: {
    text: string;
  };
}

export function SendToChatButton() {
  const editor = useEditorRef();

  const handleClick = () => {
    // Get selected text from editor
    const { selection } = editor;
    
    if (!selection) return;

    // Get the selected text
    const selectedText = editor.api.string(selection);
    
    if (!selectedText?.trim()) return;

    // Dispatch custom event with selected text
    const event = new CustomEvent(SEND_TO_CHAT_EVENT, {
      detail: { text: selectedText },
    });
    window.dispatchEvent(event);
  };

  return (
    <ToolbarButton
      tooltip="Send selection to AI Chat"
      onClick={handleClick}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <MessageSquareShare className="h-4 w-4" />
      <span className="ml-1">Send to Chat</span>
    </ToolbarButton>
  );
}


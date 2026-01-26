'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  Bot,
  PanelRightClose,
  Sparkles,
  CopyIcon,
  RefreshCcwIcon,
  MessageSquarePlus,
  CheckCircle2,
  Pencil,
  Loader2,
} from 'lucide-react'
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import { Loader } from '@/components/ai-elements/loader'
import { toast } from 'sonner'
import { SEND_TO_CHAT_EVENT, type SendToChatEvent } from '@/components/ui/send-to-chat-button'

/** Project context for AI-powered content generation */
export interface ProjectContext {
  projectId: string
  projectName: string
  websiteUrl?: string | null
  description?: string | null
  industry?: string
  icp?: string // Ideal Customer Profile / Target Audience
  valueProposition?: string
  keywords?: string[]
  competitors?: string[]
  aiGuidelines?: string
  locations?: string[]
}

interface AIAssistantPanelProps {
  onCollapse: () => void
  editorContent?: string
  /** Currently selected text in the editor */
  selectedText?: string | null
  /** Callback to update the editor content */
  onUpdateContent?: (content: string, mode: 'replace' | 'append' | 'prepend' | 'update-section', originalText?: string) => void
  /** 'card' renders with card wrapper, 'sheet' renders without wrapper for use in Sheet */
  variant?: 'card' | 'sheet'
  /** Context for the AI assistant - changes empty state text and behavior */
  context?: 'content' | 'opportunities' | 'llm-text'
  /** Project context for AI content generation */
  projectContext?: ProjectContext
}

export function AIAssistantPanel({
  onCollapse,
  editorContent,
  selectedText,
  onUpdateContent,
  variant = 'card',
  context = 'content',
  projectContext,
}: AIAssistantPanelProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Track which tool calls we've already processed
  const processedToolCalls = useRef<Set<string>>(new Set())

  // Track the last text that was sent to chat for section updates
  const lastSentTextRef = useRef<string | null>(null)

  const { messages, status, sendMessage, regenerate, error, setMessages } =
    useChat({
      onError: (err) => {
        console.error('Chat error:', err)
        toast.error('Failed to get AI response. Please try again.')
      },
    })

  // Watch for tool invocations and execute them
  useEffect(() => {
    if (!onUpdateContent) return

    // Look through all messages for tool invocations
    for (const message of messages) {
      if (message.role !== 'assistant' || !message.parts) continue

      for (const part of message.parts) {
        // Check all part types that might be tool calls
        const partType = String(part.type)

        // AI SDK tool invocations
        if (partType === 'tool-invocation' || partType.startsWith('tool-')) {
          const toolPart = part as unknown as {
            type: string
            toolCallId?: string
            toolInvocationId?: string
            toolName?: string
            state?: string
            args?: Record<string, unknown>
            input?: Record<string, unknown>
          }

          const toolCallId = toolPart.toolCallId || toolPart.toolInvocationId || ''
          const toolName = toolPart.toolName || partType.replace('tool-', '')
          const args = toolPart.args || toolPart.input

          // Only process updateEditor tool calls that haven't been processed
          // Wait for 'input-available' or 'output-available' state (when args are ready)
          const isReady = toolPart.state === 'input-available' ||
                          toolPart.state === 'output-available' ||
                          toolPart.state === 'result'

          if (
            toolName === 'updateEditor' &&
            toolCallId &&
            args &&
            isReady &&
            !processedToolCalls.current.has(toolCallId)
          ) {
            processedToolCalls.current.add(toolCallId)

            const toolArgs = args as {
              content?: string
              mode?: 'replace' | 'append' | 'prepend' | 'update-section'
              explanation?: string
            }

            if (toolArgs?.content) {
              const mode = toolArgs.mode || 'replace'

              // For update-section mode, pass the original text for find-and-replace
              const originalText = mode === 'update-section' ? lastSentTextRef.current ?? undefined : undefined

              onUpdateContent(toolArgs.content, mode, originalText)

              // Clear the stored text after use
              if (mode === 'update-section') {
                lastSentTextRef.current = null
              }

              // Show appropriate toast based on mode
              if (mode === 'update-section') {
                toast.success('Section updated in editor')
              } else if (mode === 'append') {
                toast.success('Content added to end')
              } else if (mode === 'prepend') {
                toast.success('Content added to beginning')
              } else {
                toast.success('Content replaced in editor')
              }
            }
          }
        }
      }
    }
  }, [messages, onUpdateContent])

  // Listen for "Send to Chat" events from the editor toolbar
  useEffect(() => {
    const handleSendToChat = (event: Event) => {
      const customEvent = event as SendToChatEvent
      const textFromEvent = customEvent.detail?.text

      if (textFromEvent) {
        // Store the original text for section updates
        lastSentTextRef.current = textFromEvent

        // Prepend instruction to the selected text
        setText(`Regarding this text:\n\n"${textFromEvent}"\n\n`)
        // Focus the textarea
        textareaRef.current?.focus()
      }
    }

    window.addEventListener(SEND_TO_CHAT_EVENT, handleSendToChat)
    return () => window.removeEventListener(SEND_TO_CHAT_EVENT, handleSendToChat)
  }, [])

  const handleNewChat = () => {
    setMessages([])
    setText('')
  }

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return

    sendMessage(
      { text: message.text },
      {
        body: {
          editorContent,
          selectedSection: selectedText, // Pass selected text so AI knows what to update
          context, // Pass the context type (content, opportunities, llm-text)
          projectContext, // Pass full project context for LLM text generation
        },
      }
    )

    setText('')
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const handleRegenerate = () => {
    regenerate()
  }

  // Extract text content from message parts for copy functionality
  const getMessageText = (message: (typeof messages)[0]): string => {
    if (!message.parts) return ''
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => ('text' in part ? part.text : ''))
      .join('')
  }

  return (
    <div
      className={
        variant === 'card'
          ? 'dark:bg-polar-900 dark:border-polar-800 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs'
          : 'flex h-full w-full flex-col overflow-hidden bg-white dark:bg-polar-900'
      }
    >
      {/* Chat header */}
      <div className="dark:border-polar-800 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <div className="text-sm font-medium">AI Assistant</div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="dark:hover:bg-polar-700 relative flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-transparent px-2 text-xs font-medium text-gray-600 ring-offset-background transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-white"
              type="button"
              aria-label="New chat"
              title="Start a new chat"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>New</span>
            </button>
          )}
          {variant === 'card' && (
            <button
              onClick={onCollapse}
              className="dark:hover:bg-polar-700 relative flex h-6 w-6 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-transparent p-2 text-sm font-medium text-black ring-offset-background transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-transparent dark:text-white [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0"
              type="button"
              aria-label="Collapse panel"
              title="Collapse panel"
            >
              <PanelRightClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat content - flex-1 with min-h-0 to allow shrinking within flex container */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Conversation className="h-full overflow-y-auto">
          <ConversationContent className="items-start px-4 pb-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                description={
                  context === 'opportunities'
                    ? 'Ask me about your opportunities, generate new ones, or get recommendations for content and actions.'
                    : context === 'llm-text'
                    ? 'I can generate complete LLM text based on your project context, keywords, and target audience. Just ask me to write!'
                    : 'Ask me to edit your content, optimize for SEO, or create new sections. I can directly update the editor!'
                }
                icon={<Sparkles className="size-6" />}
                title={
                  context === 'opportunities'
                    ? 'Opportunities AI Assistant'
                    : context === 'llm-text'
                    ? 'LLM Text Generator'
                    : 'Content AI Assistant'
                }
              />
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                    <p className="text-sm font-medium text-destructive">
                      Error: {error.message}
                    </p>
                  </div>
                )}
                {messages.map((message, messageIndex) => {
                  const messageText = getMessageText(message)
                  const isLastMessage = messageIndex === messages.length - 1

                  return (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.parts?.map((part, partIndex) => {
                          const isLastPart = partIndex === message.parts.length - 1

                          switch (part.type) {
                            case 'text':
                              return (
                                <MessageResponse key={`${message.id}-${partIndex}`}>
                                  {part.text}
                                </MessageResponse>
                              )
                            case 'reasoning':
                              return (
                                <Reasoning
                                  key={`${message.id}-${partIndex}`}
                                  className="w-full mb-2"
                                  isStreaming={
                                    status === 'streaming' &&
                                    isLastMessage &&
                                    isLastPart
                                  }
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              )
                            default: {
                              // Handle tool invocations (various formats)
                              const partType = String(part.type)
                              if (partType === 'tool-invocation' || partType.startsWith('tool-')) {
                                const toolPart = part as unknown as {
                                  type: string
                                  toolName?: string
                                  state?: string
                                  args?: { explanation?: string }
                                  input?: { explanation?: string }
                                }

                                const toolName = toolPart.toolName || partType.replace('tool-', '')

                                if (toolName === 'updateEditor') {
                                  const isInProgress = toolPart.state === 'input-streaming' ||
                                                       toolPart.state === 'partial-call' ||
                                                       toolPart.state === 'call'
                                  return (
                                    <span
                                      key={`${message.id}-${partIndex}`}
                                      className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                                    >
                                      {isInProgress ? (
                                        <>
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                          <span>Sprinkling AI magic</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                          <span>Content added</span>
                                        </>
                                      )}
                                    </span>
                                  )
                                }
                              }
                              return null
                            }
                          }
                        }) ?? (
                          // Fallback for messages without parts
                          <MessageResponse>{messageText}</MessageResponse>
                        )}
                      </MessageContent>
                      {message.role === 'assistant' && (
                        <MessageActions>
                          <MessageAction
                            onClick={handleRegenerate}
                            label="Retry"
                            tooltip="Regenerate response"
                          >
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            onClick={() => handleCopy(messageText)}
                            label="Copy"
                            tooltip="Copy to clipboard"
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                        </MessageActions>
                      )}
                    </Message>
                  )
                })}
              </>
            )}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* Chat input */}
      <div className="dark:border-polar-800 shrink-0 border-t border-gray-200 px-4 py-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
              placeholder={
                context === 'opportunities'
                  ? 'Ask about opportunities or generate new ones...'
                  : context === 'llm-text'
                  ? 'Write LLM text for my project...'
                  : 'Ask me to edit or create content...'
              }
              className="min-h-10 max-h-32"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <div className="flex-1" />
            <PromptInputSubmit
              disabled={!text.trim() || status === 'streaming'}
              status={status}
              className="rounded-full"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}

'use client';

/**
 * PromptEditor - A Plate.js-based editor for AI agent prompts with variable placeholder support
 *
 * Features:
 * - Rich text editing with Plate.js
 * - Variable placeholders ({{variable}}) that can be inserted and styled
 * - Click-to-insert available variables
 * - Clean, minimal interface
 */

import * as React from 'react';
import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, normalizeNodeId, KEYS } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { cn } from '@workspace/common/lib';

import { PromptEditorKit } from './prompt-editor-kit';
import { Editor, EditorContainer } from './editor';
import { FixedToolbar } from './fixed-toolbar';
import { ToolbarGroup } from './toolbar';
import { MarkToolbarButton } from './mark-toolbar-button';
import { Button } from '@workspace/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import type { PromptTemplateDto } from '@workspace/common/lib/shcmea/types/prompt-template';
import { Library, Loader2 } from 'lucide-react';

export interface PromptEditorProps {
  /** Initial prompt content (plain text or markdown) */
  value?: string;
  /** Callback when content changes (receives plain text string) */
  onChange?: (value: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Available variables that can be inserted */
  availableVariables?: string[];
  /** Project ID for loading prompt library */
  projectId?: string;
  /** Additional class names */
  className?: string;
  /** Fixed height of the editor content area */
  height?: string;
}

/**
 * Deserialize text/markdown content to editor value
 */
function deserializeContent(content: string) {
  try {
    const tempEditor = createSlateEditor({
      plugins: [...PromptEditorKit],
    });
    const value = tempEditor.getApi(MarkdownPlugin).markdown.deserialize(content);
    return value;
  } catch {
    // Fallback: create paragraph with text
    return [{ type: 'p', children: [{ text: content }] }];
  }
}

/**
 * Serialize editor value to plain text (preserving variables)
 */
function serializeToText(editor: ReturnType<typeof usePlateEditor>): string {
  if (!editor) return '';
  try {
    // Get markdown first
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize();
    return markdown;
  } catch {
    // Fallback: extract text from nodes
    const extractText = (nodes: unknown[]): string => {
      return nodes
        .map((node: any) => {
          if (node.text) return node.text;
          if (node.children) return extractText(node.children);
          return '';
        })
        .join('');
    };
    return extractText(editor.children);
  }
}

export const PromptEditor = React.forwardRef<HTMLDivElement, PromptEditorProps>(
  function PromptEditor(
    {
      value = '',
      onChange,
      placeholder = 'Enter your prompt...',
      availableVariables = [],
      projectId,
      className,
      height = '200px',
    },
    ref
  ) {
    const editorContainerRef = React.useRef<HTMLDivElement>(null);

    // Track if we're updating from internal changes to avoid loops
    const isInternalUpdateRef = React.useRef(false);

    const [isPromptLibraryOpen, setIsPromptLibraryOpen] = React.useState(false);
    const [prompts, setPrompts] = React.useState<PromptTemplateDto[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isLoadingPrompts, setIsLoadingPrompts] = React.useState(false);

    // Load prompts from library
    

    // Load prompts when popover opens
    React.useEffect(() => {
      if (isPromptLibraryOpen && projectId) {
        // TODO: Fetch prompts - loading state
      }
    }, [isPromptLibraryOpen, projectId, searchQuery]);

    // Insert selected prompt
    const handleSelectPrompt = React.useCallback(
      (prompt: PromptTemplateDto) => {
        if (onChange) {
          // Mark that we're making an internal change
          isInternalUpdateRef.current = true;
          onChange(prompt.prompt);
          setIsPromptLibraryOpen(false);
          setSearchQuery('');
          // Reset flag after onChange completes
          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        }
      },
      [onChange]
    );

    // Generate a stable editor ID that doesn't change
    const editorIdRef = React.useRef(`prompt-editor-${Math.random().toString(36).substr(2, 9)}`);
    const editorId = editorIdRef.current;

    // Compute initial value from text - only use initial value to avoid recreation
    const [initialValue] = React.useState(() => value);
    const editorValue = React.useMemo(() => {
      if (initialValue) {
        return deserializeContent(initialValue);
      }
      return defaultValue;
    }, [initialValue]);

    const editor = usePlateEditor({
      plugins: PromptEditorKit,
      value: editorValue,
      id: editorId,
    });

    // Update editor content when value prop changes externally (not from user typing)
    React.useEffect(() => {
      if (value !== undefined && !isInternalUpdateRef.current) {
        const currentText = serializeToText(editor);
        // Only update if the value changed externally (not from our own onChange)
        if (currentText !== value) {
          isInternalUpdateRef.current = true;
          const newValue = deserializeContent(value);
          editor.tf.withoutNormalizing(() => {
            while (editor.children.length > 0) {
              editor.tf.removeNodes({ at: [0] });
            }
            editor.tf.insertNodes(newValue, { at: [0] });
          });
          // Reset flag after update completes
          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        }
      }
    }, [value, editor]);

    // Handle content changes
    const handleChange = React.useCallback(
      ({ value }: { value: unknown }) => {
        if (value && onChange) {
          // Mark that we're making an internal change to prevent sync loop
          isInternalUpdateRef.current = true;
          const text = serializeToText(editor);
          onChange(text);
          // Reset flag after onChange completes
          requestAnimationFrame(() => {
            isInternalUpdateRef.current = false;
          });
        }
      },
      [editor, onChange]
    );

    // Insert variable at cursor position
    const insertVariable = React.useCallback(
      (variable: string) => {
        // Focus the editor container first
        if (editorContainerRef.current) {
          const editable = editorContainerRef.current.querySelector('[contenteditable="true"]') as HTMLElement;
          if (editable) {
            editable.focus();
          }
        }

        // Ensure editor is focused
        editor.tf.focus();

        // Get current selection
        const { selection } = editor;

        // If no selection, move to end of document
        if (!selection) {
          // Get the last block in the editor
          const lastBlock = editor.api.block({ at: [editor.children.length - 1] });
          if (lastBlock) {
            const [, path] = lastBlock;
            // Select the end of the last block
            editor.tf.select(path);
            // Collapse selection to end
            editor.tf.collapse({ edge: 'end' });
          }
        }

        // Insert the variable text
        editor.tf.insertText(variable);
      },
      [editor]
    );

    return (
      <div ref={ref} className={cn('flex flex-col', className)}>
        <Plate editor={editor} onChange={handleChange}>
          <div ref={editorContainerRef} className="flex flex-col rounded-lg border overflow-hidden">
            {/* Toolbar */}
            <FixedToolbar className="border-b border-border bg-muted/30 px-2 py-1 gap-0.5">
              <ToolbarGroup>
                <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘B)">
                  <span className="font-bold text-sm">B</span>
                </MarkToolbarButton>
                <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘I)">
                  <span className="italic text-sm">I</span>
                </MarkToolbarButton>
              </ToolbarGroup>

              {projectId && (
                <>
                  <div className="mx-1 h-4 w-px bg-border" />
                  <ToolbarGroup>
                    <Popover open={isPromptLibraryOpen} onOpenChange={setIsPromptLibraryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          title="Insert from prompt library"
                        >
                          <Library className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search prompts..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            {isLoadingPrompts ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            ) : prompts.length === 0 ? (
                              <CommandEmpty>
                                {searchQuery ? 'No prompts found' : 'No prompts in library'}
                              </CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {prompts.map((prompt) => (
                                  <CommandItem
                                    key={prompt.id}
                                    value={prompt.id}
                                    onSelect={() => handleSelectPrompt(prompt)}
                                    className="flex flex-col items-start gap-1 py-3"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-medium text-sm">{prompt.name}</span>
                                      {prompt.tags.length > 0 && (
                                        <div className="flex gap-1">
                                          {prompt.tags.slice(0, 2).map((tag) => (
                                            <span
                                              key={tag}
                                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {prompt.description && (
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {prompt.description}
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground/70 line-clamp-2 mt-1">
                                      {prompt.prompt.slice(0, 100)}
                                      {prompt.prompt.length > 100 ? '...' : ''}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </ToolbarGroup>
                </>
              )}
            </FixedToolbar>

            {/* Editor Content */}
            <EditorContainer
              variant="default"
              className="relative border-0 overflow-y-auto"
              style={{ height, maxHeight: height }}
            >
              <Editor
                variant="none"
                placeholder={placeholder}
                className="px-4 pt-6 pb-3 text-base md:text-sm"
              />
            </EditorContainer>
          </div>
        </Plate>

        {/* Available Variables */}
        {availableVariables.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-gray-400 dark:text-polar-500">Available:</span>
            {availableVariables.map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => insertVariable(variable)}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-polar-800 text-gray-600 dark:text-polar-300 hover:bg-gray-200 dark:hover:bg-polar-700 transition-colors"
              >
                {variable}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

// Default empty value
const defaultValue = normalizeNodeId([
  {
    children: [{ text: '' }],
    type: 'p',
  },
]);

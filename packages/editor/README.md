# @workspace/editor

Rich text editor components built on Plate.js for all apps in the monorepo.

## Features

- 📝 Full-featured rich text editor
- 🎨 Multiple editor variants (simple, full, prompt-specific)
- 🧩 Extensible plugin system
- 🎯 AI-powered editing capabilities
- 📦 Reusable across all apps

## Usage

### Simple Editor

```tsx
import { SimpleEditor } from '@workspace/editor/simple-editor';

function MyComponent() {
  return <SimpleEditor value={content} onChange={setContent} />;
}
```

### Full Editor

```tsx
import { Editor } from '@workspace/editor/editor';

function MyComponent() {
  return <Editor value={content} onChange={setContent} />;
}
```

### Prompt Editor

```tsx
import { PromptEditor } from '@workspace/editor/prompt-editor';

function MyComponent() {
  return <PromptEditor value={prompt} onChange={setPrompt} />;
}
```

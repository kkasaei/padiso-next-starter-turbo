# @workspace/trigger

Trigger.dev integration for background jobs and scheduled tasks.

## Setup

1. Add the following environment variables to your `.env` file:

```env
TRIGGER_PROJECT_ID=your_project_id
TRIGGER_API_KEY=your_api_key
TRIGGER_API_URL=https://api.trigger.dev  # Optional, defaults to production
```

2. Install dependencies:

```bash
pnpm install
```

## Usage

### Creating Tasks

Create new tasks in the `src/tasks` directory:

```typescript
// src/tasks/example-task.ts
import { task } from "@trigger.dev/sdk";

export const exampleTask = task({
  id: "example-task",
  run: async (payload: { message: string }) => {
    console.log("Running task with:", payload.message);
    return { success: true };
  },
});
```

### Triggering Tasks

Import and trigger tasks from your application:

```typescript
import { exampleTask } from "@workspace/trigger";

await exampleTask.trigger({ message: "Hello, World!" });
```

## Development

Run the Trigger.dev development server:

```bash
pnpm dev
```

## Documentation

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Trigger.dev Quick Start](https://trigger.dev/docs/quick-start)

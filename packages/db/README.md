# @workspace/db

Database package using Drizzle ORM and PostgreSQL.

## Setup

1. Set the `DATABASE_URL` environment variable:
   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

## Scripts

- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema changes directly to database (dev only)
- `pnpm db:studio` - Open Drizzle Studio to view/edit data
- `pnpm db:seed` - Seed the database with mock data

## Usage

```typescript
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";

// Query example
const allUsers = await db.select().from(users);
```

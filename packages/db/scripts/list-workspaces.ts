import { db } from '../src/db';
import { workspaces } from '../src/schema/index';
import { desc } from 'drizzle-orm';

async function main() {
  const ws = await db
    .select({
      id: workspaces.id,
      clerkOrgId: workspaces.clerkOrgId,
      planId: workspaces.planId,
      stripeCustomerId: workspaces.stripeCustomerId,
      status: workspaces.status,
      createdAt: workspaces.createdAt,
    })
    .from(workspaces)
    .orderBy(desc(workspaces.createdAt))
    .limit(10);
  
  console.log('Recent workspaces:');
  ws.forEach(w => {
    console.log(`- ${w.id} | clerk: ${w.clerkOrgId} | plan: ${w.planId || 'none'} | customer: ${w.stripeCustomerId || 'none'} | status: ${w.status}`);
  });
  
  process.exit(0);
}

main().catch(console.error);

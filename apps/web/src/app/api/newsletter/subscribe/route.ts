import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@workspace/newsletter';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { email } = subscribeSchema.parse(body);

    // Subscribe to newsletter
    const result = await subscribeToNewsletter(email);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Newsletter API] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

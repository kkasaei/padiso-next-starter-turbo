import { Resend } from 'resend';
import { env } from './env';

// ============================================================
// RESEND CLIENT
// ============================================================

const getResendClient = () => {
  if (!env.EMAIL_RESEND_API_KEY) {
    throw new Error('EMAIL_RESEND_API_KEY is not configured');
  }
  return new Resend(env.EMAIL_RESEND_API_KEY);
};

// ============================================================
// TYPES
// ============================================================

export interface NewsletterContact {
  id: string;
  email: string;
  created_at?: string;
  unsubscribed?: boolean;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  contactId?: string;
  alreadySubscribed?: boolean;
}

// ============================================================
// CONTACT METHODS
// ============================================================

/**
 * Get a contact by email address
 * Returns null if contact doesn't exist
 */
export async function getContactByEmail(
  email: string
): Promise<NewsletterContact | null> {
  try {
    const resend = getResendClient();
    const response = await resend.contacts.get({ email });

    if (response.data?.id) {
      return {
        id: response.data.id,
        email: response.data.email,
        created_at: response.data.created_at,
        unsubscribed: response.data.unsubscribed,
      };
    }

    return null;
  } catch (error) {
    const resendError = error as { statusCode?: number; name?: string };

    // Contact not found is expected - return null
    if (resendError.statusCode === 404 || resendError.name === 'not_found') {
      return null;
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Create a new contact
 * Returns the created contact ID
 */
export async function createContact(email: string): Promise<string> {
  const resend = getResendClient();
  const { data, error } = await resend.contacts.create({
    email,
    unsubscribed: false,
  });

  if (error) {
    // Handle duplicate contact error (race condition)
    if (error.message?.includes('already exists')) {
      console.log('[Newsletter] Contact already exists, fetching existing...');
      const existingContact = await getContactByEmail(email);

      if (existingContact?.id) {
        return existingContact.id;
      }
    }

    throw new Error(`Failed to create contact: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error('Contact created but no ID returned');
  }

  return data.id;
}

/**
 * Add a contact to a segment
 */
export async function addContactToSegment(
  contactId: string,
  segmentId: string
): Promise<boolean> {
  const resend = getResendClient();
  const { error } = await resend.contacts.segments.add({
    contactId,
    segmentId,
  });

  if (error) {
    // Already in segment is not an error
    if (error.message?.includes('already') ||
        error.message?.includes('duplicate')) {
      return true;
    }

    throw new Error(`Failed to add to segment: ${error.message}`);
  }

  return true;
}

// ============================================================
// MAIN SUBSCRIPTION METHOD
// ============================================================

/**
 * Subscribe an email to the newsletter
 * Handles the full flow: check -> create -> add to segment
 */
export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  const normalizedEmail = email.toLowerCase();

  console.log('[Newsletter] Subscription attempt:', {
    email: normalizedEmail,
    timestamp: new Date().toISOString(),
  });

  // Validate configuration
  if (!env.NEWSLETTER_SEGMENT_ID) {
    console.error('[Newsletter] NEWSLETTER_SEGMENT_ID not configured');
    throw new Error('Newsletter service is not configured');
  }

  try {
    // Step 1: Check if contact exists
    let contactId: string | undefined;
    const existingContact = await getContactByEmail(normalizedEmail);

    if (existingContact?.id) {
      contactId = existingContact.id;
      console.log('[Newsletter] Contact already exists:', {
        email: normalizedEmail,
        contactId,
      });
    } else {
      // Step 2: Create contact if it doesn't exist
      console.log('[Newsletter] Creating new contact:', {
        email: normalizedEmail,
      });

      contactId = await createContact(normalizedEmail);

      console.log('[Newsletter] ✅ Contact created:', {
        email: normalizedEmail,
        contactId,
      });
    }

    if (!contactId) {
      throw new Error('Failed to get or create contact');
    }

    // Step 3: Add contact to segment
    const addedToSegment = await addContactToSegment(
      contactId,
      env.NEWSLETTER_SEGMENT_ID
    );

    if (!addedToSegment) {
      throw new Error('Failed to add contact to segment');
    }

    console.log('[Newsletter] ✅ Successfully subscribed:', {
      email: normalizedEmail,
      contactId,
      segmentId: env.NEWSLETTER_SEGMENT_ID,
    });

    // Check if this was an existing contact already in the segment
    const alreadySubscribed = existingContact !== null;

    return {
      success: true,
      message: alreadySubscribed
        ? "You're already subscribed to our newsletter!"
        : 'Thank you for subscribing! Check your inbox for confirmation.',
      contactId,
      alreadySubscribed,
    };
  } catch (error) {
    console.error('[Newsletter] Subscription error:', error);
    throw error;
  }
}

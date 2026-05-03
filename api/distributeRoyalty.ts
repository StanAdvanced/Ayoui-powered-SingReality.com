import * as functions from 'firebase-functions/v2';
import Stripe from 'stripe';

// Initialize Stripe with secure secret
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

/**
 * Handles royalty disbursements via Stripe Connect.
 * Triggered by Firestore events when a track earns money (e.g., from streams/sales).
 */
export const distributeRoyalty = functions.firestore.onDocumentCreated(
  'royalty_events/{eventId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const { amount, recipients } = data;

    // Distribute proportionally
    for (const recipient of recipients) {
      await stripe.transfers.create({
        amount: Math.floor(amount * recipient.share),
        currency: 'usd',
        destination: recipient.stripeAccountId,
        metadata: { eventId: event.id, trackId: data.trackId }
      });
    }
  }
);

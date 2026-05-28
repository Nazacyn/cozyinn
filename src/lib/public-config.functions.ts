import { createServerFn } from "@tanstack/react-start";

/**
 * Returns publishable runtime config to the browser.
 * Reads from server-only process.env (Lovable Cloud secrets) so the
 * values do NOT need to be prefixed with VITE_.
 *
 * Only include values that are SAFE to expose publicly
 * (e.g. Stripe *publishable* key, Voiceflow project ID).
 */
export const getPublicConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    return {
      voiceflowId: process.env.VOICEFLOW_ID ?? "",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
    };
  },
);
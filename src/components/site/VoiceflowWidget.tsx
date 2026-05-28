import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPublicConfig } from "@/lib/public-config.functions";

/**
 * Voiceflow chat widget loader with a custom StripePaymentExtension.
 *
 * Secrets `VOICEFLOW_ID` and `STRIPE_PUBLISHABLE_KEY` are stored as Lovable
 * Cloud secrets (no VITE_ prefix). They are read on the server via the
 * `getPublicConfig` server function and delivered to the browser at runtime.
 */
export function VoiceflowWidget() {
  const fetchConfig = useServerFn(getPublicConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    if (window.__voiceflowLoaded) return;

    let cancelled = false;

    (async () => {
      const config = await fetchConfig();
      if (cancelled) return;
      if (!config?.voiceflowId) {
        console.warn(
          "[VoiceflowWidget] VOICEFLOW_ID is not set in Lovable Cloud secrets.",
        );
        return;
      }

      // @ts-ignore
      window.__voiceflowLoaded = true;

      const script = document.createElement("script");
      script.src = "https://voiceflow.com";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
      // @ts-ignore
      if (!window.voiceflow?.chat) return;

      // Register the Stripe payment response extension.
      const StripePaymentExtension = {
        name: "StripePaymentExtension",
        type: "response",
        match: ({ trace }: any) => trace.type === "StripePayment",
        render: async ({ trace, element }: any) => {
          try {
            if (!config.stripePublishableKey) {
              throw new Error(
                "STRIPE_PUBLISHABLE_KEY is not set in Lovable Cloud secrets.",
              );
            }
            // @ts-ignore
            const stripe = window.Stripe(config.stripePublishableKey);
            const { client_secret: clientSecret } = trace.payload || {};
            const elements = stripe.elements({ clientSecret });

            const container = document.createElement("div");
            container.className = "vf-stripe-payment p-4 rounded-xl bg-white shadow";
            const mount = document.createElement("div");
            mount.id = `stripe-payment-element-${Date.now()}`;
            container.appendChild(mount);

            const payBtn = document.createElement("button");
            payBtn.textContent = "Pay now";
            payBtn.className =
              "mt-3 w-full rounded-full bg-[#0070f3] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition";
            container.appendChild(payBtn);

            element.appendChild(container);

            const paymentElement = elements.create("payment");
            paymentElement.mount(mount);

            payBtn.addEventListener("click", async () => {
              payBtn.setAttribute("disabled", "true");
              payBtn.textContent = "Processing…";
              try {
                const { error } = await stripe.confirmPayment({
                  elements,
                  confirmParams: {},
                  redirect: "if_required",
                });
                // @ts-ignore
                window.voiceflow.chat.interact({
                  type: "payment_completed",
                  payload: { payment_status: error ? "failed" : "success" },
                });
              } catch {
                // @ts-ignore
                window.voiceflow.chat.interact({
                  type: "payment_completed",
                  payload: { payment_status: "failed" },
                });
              }
            });
          } catch (err) {
            console.error("StripePaymentExtension error", err);
            // @ts-ignore
            window.voiceflow.chat.interact({
              type: "payment_completed",
              payload: { payment_status: "failed" },
            });
          }
        },
      };

        // @ts-ignore
        window.voiceflow.chat.load({
          verify: { projectID: config.voiceflowId },
          url: "https://voiceflow.com",
          versionID: "production",
          voice: { url: "https://voiceflow.com" },
          assistant: { extensions: [StripePaymentExtension] },
        });
      };

      const slot =
        document.getElementById("chat-widget-slot") || document.body;
      slot.appendChild(script);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchConfig]);

  return null;
}
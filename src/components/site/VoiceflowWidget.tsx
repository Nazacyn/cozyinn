import { useEffect } from "react";

/**
 * Voiceflow chat widget loader with a custom StripePaymentExtension.
 *
 * NOTE: Vite only exposes env vars prefixed with VITE_ to the client bundle.
 * The keys below (`VOICEFLOW_ID`, `STRIPE_SECRET_KEY`) are read literally as
 * requested; if they are undefined at runtime, expose them as
 * `VITE_VOICEFLOW_ID` / `VITE_STRIPE_PUBLISHABLE_KEY` instead. The publishable
 * Stripe key is the safe one to ship to the browser — never the secret key.
 */
export function VoiceflowWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    if (window.__voiceflowLoaded) return;
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
            // @ts-ignore
            const stripe = window.Stripe(import.meta.env.STRIPE_SECRET_KEY);
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
        verify: { projectID: import.meta.env.VOICEFLOW_ID },
        url: "https://voiceflow.com",
        versionID: "production",
        voice: { url: "https://voiceflow.com" },
        assistant: { extensions: [StripePaymentExtension] },
      });
    };

    const slot = document.getElementById("chat-widget-slot") || document.body;
    slot.appendChild(script);
  }, []);

  return null;
}
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPublicConfig } from "@/lib/public-config.functions";

declare global {
  interface Window {
    voiceflow: any;
    Stripe: any;
  }
}

export function VoiceflowWidget() {
  const fetchConfig = useServerFn(getPublicConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    // Load Stripe.js safely
    if (!document.getElementById("stripe-js-script")) {
      const stripeScript = document.createElement("script");
      stripeScript.id = "stripe-js-script";
      stripeScript.src = "https://js.stripe.com/v3/";
      stripeScript.async = true;
      document.head.appendChild(stripeScript);
    }

    // Prevent duplicate VF widget loads
    if (document.getElementById("voiceflow-widget-core")) {
      return;
    }

    (async () => {
      let config = {
        voiceflowId: "6a1841e4ca2e1d53feb8c42b",
        stripePublishableKey: "",
      };

      try {
        const fetched = await fetchConfig();
        if (fetched?.voiceflowId) {
          config.voiceflowId = fetched.voiceflowId;
        }
        if (fetched?.stripePublishableKey) {
          config.stripePublishableKey = fetched.stripePublishableKey;
        }
      } catch (e) {
        console.log("[Voiceflow] Using fallback configuration.");
      }

      if (cancelled) return;

      const script = document.createElement("script");
      script.id = "voiceflow-widget-core";
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        if (!window.voiceflow?.chat) {
          console.error("Voiceflow widget failed to initialize");
          return;
        }

        const StripePaymentExtension = {
          name: "StripePaymentExtension",
          type: "response",
          match: ({ trace }: any) => trace.type === "StripePayment",
          render: async ({ trace, element }: any) => {
            try {
              if (!window.Stripe) {
                throw new Error("Stripe.js failed to load");
              }

              const stripeKey = config.stripePublishableKey;
              if (!stripeKey) {
                throw new Error("Missing Stripe publishable key");
              }

              const stripe = window.Stripe(stripeKey);
              const clientSecret = trace.payload?.client_secret;
              if (!clientSecret) {
                throw new Error("Missing PaymentIntent client_secret");
              }

              const elements = stripe.elements({ clientSecret });

              const container = document.createElement("div");
              container.className = "vf-stripe-payment p-4 rounded-xl bg-white shadow border border-gray-100 my-2";
              container.style.color = "#000000";

              const mount = document.createElement("div");
              mount.id = `stripe-payment-element-${Date.now()}`;
              container.appendChild(mount);

              const payBtn = document.createElement("button");
              payBtn.textContent = "Pay now";
              payBtn.className = "mt-3 w-full rounded-full bg-[#0070f3] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition";
              container.appendChild(payBtn);

              element.appendChild(container);

              const paymentElement = elements.create("payment");
              paymentElement.mount(mount);

              payBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                payBtn.disabled = true;
                payBtn.textContent = "Processing…";
                try {
                  const { error } = await stripe.confirmPayment({
                    elements,
                    redirect: "if_required",
                  });
                  window.voiceflow.chat.interact({
                    type: "payment_completed",
                    payload: {
                      payment_status: error ? "failed" : "success",
                    },
                  });
                } catch (err) {
                  console.error(err);
                  window.voiceflow.chat.interact({
                    type: "payment_completed",
                    payload: {
                      payment_status: "failed",
                    },
                  });
                } finally {
                  payBtn.disabled = false;
                  payBtn.textContent = "Pay now";
                }
              });
            } catch (err) {
              console.error("StripePaymentExtension error", err);
            }
          },
        };

        window.voiceflow.chat.load({
          verify: { projectID: config.voiceflowId },
          config: { versionID: "production" },
          assistant: { extensions: [StripePaymentExtension] }
        });
      };

      // FIXED: Moved outside the onload block so the script actually injects into the web page document body!
      document.body.appendChild(script);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchConfig]);

  return null;
}

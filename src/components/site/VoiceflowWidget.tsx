import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPublicConfig } from "@/lib/public-config.functions";
import { checkPaymentStatus } from "@/lib/payment.functions";

declare global {
  interface Window {
    voiceflow: any;
    Stripe: any;
  }
}

function waitForStripe(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.Stripe) return resolve();
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("Stripe.js failed to load"));
      }
      setTimeout(tick, 100);
    };
    tick();
  });
}

export function VoiceflowWidget() {
  const fetchConfig = useServerFn(getPublicConfig);
  const checkPayment = useServerFn(checkPaymentStatus);

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

    // Shield against duplicate widget injections during routing switches
    if (document.getElementById("voiceflow-widget-core")) {
      return;
    }

    (async () => {
      const config = {
        voiceflowId: "6a1b34fb7b492825fac2c932",
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
        console.log("[Voiceflow] Cloud configuration lookup skipped, using default fallbacks.");
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
              await waitForStripe();

              const stripeKey = config.stripePublishableKey;
              if (!stripeKey) {
                throw new Error("Missing Stripe publishable key");
              }

              const stripe = window.Stripe(stripeKey);

              const clientSecret: string | undefined = trace.payload?.client_secret;
              if (!clientSecret) {
                throw new Error("Missing Checkout Session client_secret");
              }

              // Create container
              const container = document.createElement("div");
              container.className =
                "vf-stripe-checkout p-2 rounded-xl bg-white shadow-sm border border-gray-100 my-2 w-full max-w-sm mx-auto";

              const checkoutMount = document.createElement("div");
              const checkoutId = `stripe-checkout-instance-${Date.now()}`;
              checkoutMount.id = checkoutId;
              container.appendChild(checkoutMount);
              element.appendChild(container);

              let completed = false;

              // Stripe Embedded Checkout, requires Checkout Session client_secret from n8n
              const checkout = await stripe.initEmbeddedCheckout({
                clientSecret,
                onComplete: async () => {
                  if (completed) return;
                  completed = true;

                  const status = document.createElement("p");
                  status.className = "text-sm text-gray-600 mt-2 text-center";
                  status.textContent = "Confirming your payment...";
                  container.appendChild(status);

                  // The session ID is the part of the client secret before "_secret_"
                  const sessionId = clientSecret.split("_secret_")[0];
                  let result = "pending";

                  for (let i = 0; i < 6 && result !== "paid"; i++) {
                    try {
                      const r = await checkPayment({
                        data: { checkout_session_id: sessionId },
                      });
                      result = r?.status ?? "pending";
                    } catch {
                      result = "pending";
                    }
                    if (result !== "paid") {
                      await new Promise((res) => setTimeout(res, 2000));
                    }
                  }

                  status.textContent =
                    result === "paid"
                      ? "Payment confirmed."
                      : "Payment received. Waiting for final confirmation...";

                  window.voiceflow.chat.interact({
                    type: "text",
                    payload: "I've completed my payment.",
                  });
                },
              });

              checkout.mount(checkoutMount);
            } catch (err) {
              console.error("StripePaymentExtension error", err);
              window.voiceflow.chat.interact({
                type: "text",
                payload: "I couldn't open the payment form.",
              });
            }
          },
        };

        // Stable userID persisted in localStorage so session survives re-renders
        let userId = localStorage.getItem("vf_user_id");
        if (!userId) {
          userId = "cozyinn-user-" + Date.now().toString();
          localStorage.setItem("vf_user_id", userId);
        }

        window.voiceflow.chat.load({
          verify: { projectID: config.voiceflowId },
          config: { versionID: "production" },
          user: {
            name: "Guest",
            userID: userId,
          },
          assistant: { extensions: [StripePaymentExtension] },
        });
      };

      document.body.appendChild(script);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchConfig, checkPayment]);

  return null;
}

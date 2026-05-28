import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPublicConfig } from "@/lib/public-config.functions";

export function VoiceflowWidget() {
  const fetchConfig = useServerFn(getPublicConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let cancelled = false;

    // 1. Safely inject Stripe.js library
    if (!document.getElementById("stripe-js-script")) {
      const stripeScript = document.createElement("script");
      stripeScript.id = "stripe-js-script";
      stripeScript.src = "https://stripe.com";
      stripeScript.async = true;
      document.head.appendChild(stripeScript);
    }

    // 2. Prevent creating duplicate Voiceflow scripts on React re-renders
    if (document.getElementById("voiceflow-widget-core")) {
      // If script exists but widget disappeared, force a reload trigger
      // @ts-ignore
      if (window.voiceflow?.chat?.load && !document.querySelector('.vpw-widget-launcher')) {
        try {
          // @ts-ignore
          window.voiceflow.chat.open();
        } catch(e) {}
      }
      return;
    }

    (async () => {
      let config = { voiceflowId: "6a10ad0b5e0209f1acec04f6", stripePublishableKey: "" };
      
      try {
        const fetched = await fetchConfig();
        if (fetched?.voiceflowId) config.voiceflowId = fetched.voiceflowId;
        if (fetched?.stripePublishableKey) config.stripePublishableKey = fetched.stripePublishableKey;
      } catch (e) {
        console.log("[Voiceflow] Cloud secrets read skipped, running fallback credentials.");
      }

      if (cancelled) return;

      const script = document.createElement("script");
      script.id = "voiceflow-widget-core";
      script.src = "https://voiceflow.com";
      script.type = "text/javascript";
      script.async = true;
      
      script.onload = () => {
        // @ts-ignore
        if (!window.voiceflow?.chat) return;

        const StripePaymentExtension = {
          name: "StripePaymentExtension",
          type: "response",
          match: ({ trace }: any) => trace.type === "StripePayment",
          render: async ({ trace, element }: any) => {
            try {
              const stripeKey = config.stripePublishableKey || "pk_test_51P3exampleYourKeyHere";
              
              // @ts-ignore
              const stripe = window.Stripe(stripeKey);
              const { client_secret: clientSecret } = trace.payload || {};
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
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          voice: { url: "https://runtime-api.voiceflow.com" },
          assistant: { extensions: [StripePaymentExtension] },
        });
      };

      document.body.appendChild(script);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchConfig]);

  return null;
}

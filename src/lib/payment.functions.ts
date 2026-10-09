import { createServerFn } from "@tanstack/react-start";

export const checkPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { checkout_session_id: string }) => d)
  .handler(async ({ data }) => {
    if (!/^cs_[A-Za-z0-9_]+$/.test(data.checkout_session_id)) {
      return { status: "not_found" };
    }

    const url = process.env.N8N_CHECK_PAYMENT_URL;
    const key = process.env.N8N_CHECK_PAYMENT_KEY;
    if (!url || !key) {
      console.error("Missing N8N_CHECK_PAYMENT_URL or N8N_CHECK_PAYMENT_KEY");
      return { status: "pending" };
    }
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": key },
      body: JSON.stringify({ checkout_session_id: data.checkout_session_id }),
    });

    if (!res.ok) return { status: "pending" };
    const json = await res.json();
    return { status: json.status ?? "pending" };
  });

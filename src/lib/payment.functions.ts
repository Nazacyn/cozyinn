import { createServerFn } from "@tanstack/react-start";

export const checkPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { checkout_session_id: string }) => d)
  .handler(async ({ data }) => {
    if (!/^cs_[A-Za-z0-9_]+$/.test(data.checkout_session_id)) {
      return { status: "not_found" };
    }

    const res = await fetch(process.env.N8N_CHECK_PAYMENT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.N8N_CHECK_PAYMENT_KEY!,
      },
      body: JSON.stringify({ checkout_session_id: data.checkout_session_id }),
    });

    if (!res.ok) return { status: "pending" };
    const json = await res.json();
    return { status: json.status ?? "pending" };
  });

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS Preflight perfectly
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { application_id, customer_email, customer_phone, customer_name, amount } = await req.json();

    const appId = Deno.env.get("CASHFREE_APP_ID");
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!appId || !secretKey) {
      throw new Error("Missing Cashfree API keys in Supabase Dashboard.");
    }

    // Generate a unique order ID appending epoch timestamp
    const orderId = `reg_${application_id}_${Date.now()}`;

    const requestBody = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${application_id}_user`,
        customer_email: customer_email || "no-reply@antilabs.com",
        customer_phone: customer_phone || "9999999999",
        customer_name: customer_name || "AntiLabs Customer"
      },
      order_meta: {
        // Redirection URL is dynamically required by Cashfree
        return_url: "http://localhost:5174/"
      }
    };

    // Hit Cashfree Sandbox Gateway
    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API Error:", data);
      throw new Error(data.message || "Failed to create Cashfree order");
    }

    return new Response(JSON.stringify({ 
      payment_session_id: data.payment_session_id,
      order_id: data.order_id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

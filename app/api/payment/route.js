import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, productId, customerDetails } = body;

    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Amount is required" }),
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount, // Amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        productId,
        customerEmail: customerDetails?.email,
        customerName: customerDetails?.name
      }
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify({
      ...order,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    }), { status: 200 });
  } catch (err) {
    console.error("Payment error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Payment processing failed" }),
      { status: 500 }
    );
  }
}

"use client";
import Script from "next/script";

export default function BuyButton({ amount = 50000, label = "Buy Now", className = "" }) {
  const handlePayment = async () => {
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Smart Device Control",
        description: "Purchase IoT Device",
        order_id: order.id,
        handler: function (response) {
          alert("✅ Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <button
        onClick={handlePayment}
        className={className || "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"}
      >
        {label}
      </button>
    </>
  );
}

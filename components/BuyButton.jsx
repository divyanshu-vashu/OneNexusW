"use client";
import Script from "next/script";

export default function BuyButton({ amount = 50000, label = "Buy Now" }) {
  // amount is in paise (₹500 = 50000)

  const handlePayment = async () => {
    const res = await fetch("/api/payment", { method: "POST" });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Smart Device Control",
      description: "IoT Device Purchase",
      order_id: order.id,
      handler: function (response) {
        alert("✅ Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      {/* Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <button
        onClick={handlePayment}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-700 transition"
      >
        {label}
      </button>
    </>
  );
}

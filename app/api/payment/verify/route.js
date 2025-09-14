import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, productId, amount, customerDetails } = body;

    // Verify the payment signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Prepare order details for email
    const orderDetails = {
      'Order ID': orderId,
      'Payment ID': paymentId,
      'Amount': `₹${(amount / 100).toFixed(2)}`,
      'Product ID': productId,
      'Customer Name': customerDetails.name,
      'Email': customerDetails.email,
      'Phone': customerDetails.phone,
      'Address': customerDetails.address,
      'City': customerDetails.city,
      'State': customerDetails.state,
      'Pincode': customerDetails.pincode,
      'Order Date': new Date().toLocaleString(),
    };

    // Send confirmation email to customer
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: customerDetails.email,
        subject: `Order Confirmation #${orderId}`,
        orderDetails: orderDetails
      }),
    });

    // Send notification to admin
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'admin@smartremote.com',
        subject: `New Order #${orderId}`,
        orderDetails: orderDetails
      }),
    });

    // Here you would typically save the order to your database
    // await saveOrderToDatabase({
    //   orderId,
    //   paymentId,
    //   amount,
    //   productId,
    //   customerDetails,
    //   status: 'completed',
    //   createdAt: new Date()
    // });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
      paymentId,
      amount,
      customerDetails
    }, { status: 200 });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

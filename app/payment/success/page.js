'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// A small, reusable component for the loading state.
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Verifying your payment...</p>
    </div>
  </div>
);

// A reusable component for displaying errors.
const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
      <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
      <h2 className="mt-4 text-xl font-bold text-gray-900">Payment Error</h2>
      <p className="mt-2 text-sm text-gray-600">{error}</p>
      <div className="mt-6">
        <Link
          href="/contact"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Contact Support
        </Link>
      </div>
    </div>
  </div>
);

// A component to display a single detail item for better code reuse.
const OrderDetailItem = ({ label, value, valueClassName = '' }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    <p className={`mt-1 text-sm text-gray-900 ${valueClassName}`}>{value}</p>
  </div>
);

// The main component for the success page.
const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch and verify payment details
  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
      try {
        // In a real application, you would make a fetch request to your backend here.
        // e.g., const response = await fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify({ paymentId, orderId }) });
        
        // Simulating the API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mocking order details based on URL params for demonstration
        setOrderDetails({
          orderId: orderId,
          paymentId: paymentId,
          amount: searchParams.get('amount') ? `₹${(parseInt(searchParams.get('amount')) / 100).toLocaleString('en-IN')}` : 'N/A',
          productId: searchParams.get('productId') || 'N/A',
          status: 'Completed',
          date: new Date().toLocaleString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        });
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Failed to verify your payment. Please contact support for assistance.');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId && orderId) {
      verifyPayment();
    } else {
      // If essential parameters are missing, redirect to the homepage.
      router.push('/');
    }
  }, [searchParams, router]);

  // Conditional rendering based on the state
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
          
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <h3 className="text-xl leading-6 font-bold text-white">
                  Order Confirmed!
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-blue-100">
                  Thank you for your purchase. Your order has been successfully processed.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <OrderDetailItem label="Order Number" value={orderDetails?.orderId} />
              <OrderDetailItem label="Date" value={orderDetails?.date} />
              <OrderDetailItem label="Payment ID" value={orderDetails?.paymentId} />
              <OrderDetailItem 
                label="Payment Status" 
                value={
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {orderDetails?.status}
                  </span>
                } 
              />
              <div className="sm:col-span-2">
                <h4 className="text-sm font-medium text-gray-500">Amount Paid</h4>
                <p className="mt-1 text-3xl font-bold text-gray-900">{orderDetails?.amount}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-base font-medium text-gray-900">Next Steps</h4>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a confirmation to your email address with the full order details. You will receive another email once your order has shipped.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Order History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';

// A reusable form input component to reduce boilerplate
const FormInput = ({ id, name, label, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full p-2 rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// The main Checkout Page component
const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState({ id: '', name: 'Product', amount: '0' });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Effect to load product details from URL parameters on component mount
  useEffect(() => {
    const productId = searchParams.get('id');
    const amount = searchParams.get('amount');
    const productName = searchParams.get('name');

    if (!productId || !amount || !productName) {
      // If essential product info is missing, redirect to the shop page
      router.push('/shop');
    } else {
      setProduct({ id: productId, name: productName, amount });
    }
  }, [searchParams, router]);

  // Handles changes in form inputs and clears validation errors on typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validates the entire form and sets errors if any field is invalid
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'A valid email is required';
    if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'A valid 10-digit phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = 'A valid 6-digit pincode is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Main submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Create a Razorpay order via our backend API
      const orderResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(product.amount * 100), // Amount in paise
          productId: product.id,
          customerDetails: formData,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error((await orderResponse.json()).error || 'Failed to create Razorpay order.');
      }

      const orderData = await orderResponse.json();
      const { id: orderId, key: razorpayKey } = orderData;

      // 2. Open the Razorpay checkout modal
      const options = {
        key: razorpayKey,
        amount: Math.round(product.amount * 100),
        currency: 'INR',
        name: 'SmartRemote Inc.',
        description: `Order for ${product.name}`,
        order_id: orderId,
        handler: (response) => {
          // 3. On successful payment, redirect to our success page for verification
          const successUrl = `/payment/success?paymentId=${response.razorpay_payment_id}&orderId=${orderId}&amount=${product.amount * 100}&productId=${product.id}`;
          router.push(successUrl);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          productId: product.id,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => setLoading(false), // Stop loading if user closes the modal
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment processing error:', error);
      alert(error.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onError={(e) => console.error('Razorpay SDK failed to load', e)}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">Please provide your details to complete the purchase.</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">Order Summary</h2>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">{product.name}</span>
              <span className="font-bold text-gray-900">₹{product.amount}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            <FormInput id="name" name="name" label="Full Name" value={formData.name} onChange={handleChange} error={formErrors.name} placeholder="John Doe" type="text" />
            <FormInput id="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} error={formErrors.email} placeholder="you@example.com" type="email" />
            <FormInput id="phone" name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} error={formErrors.phone} placeholder="9876543210" type="tel" />
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="123 Main St, Apartment 4B"
              />
              {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="city" name="city" label="City" value={formData.city} onChange={handleChange} error={formErrors.city} placeholder="Mumbai" type="text" />
              <FormInput id="state" name="state" label="State" value={formData.state} onChange={handleChange} error={formErrors.state} placeholder="Maharashtra" type="text" />
              <FormInput id="pincode" name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} error={formErrors.pincode} placeholder="400001" type="text" />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Proceed to Pay ₹${product.amount}`}
              </button>
            </div>

            <p className="pt-2 text-center text-xs text-gray-500">
              By completing your purchase, you agree to our{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline">Terms of Service</Link>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
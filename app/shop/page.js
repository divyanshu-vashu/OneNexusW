"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import the ModelViewer component with SSR disabled
const ModelViewer = dynamic(
  () => import('@/components/ModelViewer'),
  { ssr: false, loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading 3D model...</div>
    </div>
  )}
);

const products = [
  {
    id: "smart-switch",
    name: "Smart Switch",
    price: 89900, // in paise
    displayPrice: 899,
    model: "/assets/model/1final_online.glb",
    shortDesc: "Control your lights and appliances remotely.",
  },
  {
    id: "smart-plug",
    name: "Smart Plug",
    price: 79900, // in paise
    displayPrice: 799,
    model: "/assets/model/2plug.glb",
    shortDesc: "Automate any device with ease.",
  },
];

export default function ShopPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    quantity: 1
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const totalAmount = selectedProduct.price * formData.quantity;
    
    const options = {
      key: "rzp_test_YVP3ZDEfL1w9HN", // Replace with your Razorpay key
      amount: totalAmount,
      currency: "INR",
      name: "OneNexus",
      description: `Order for ${selectedProduct.name}`,
      image: "/assets/images/Nlogo.png",
      handler: async function (response) {
        try {
          // Send data to Formspree after successful payment
          const formspreeResponse = await fetch("https://formspree.io/f/xkgrjvza", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              product: selectedProduct.name,
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              quantity: formData.quantity,
              amount: totalAmount / 100, // Convert back to rupees
              payment_id: response.razorpay_payment_id
            })
          });
          
          if (formspreeResponse.ok) {
            setPaymentSuccess(true);
            // Reset form after 3 seconds and close modal
            setTimeout(() => {
              setShowPaymentForm(false);
              setPaymentSuccess(false);
            }, 3000);
          } else {
            alert("Payment succeeded but failed to send order details. Please contact support.");
          }
        } catch (error) {
          console.error('Error:', error);
          alert("An error occurred while processing your order. Please contact support.");
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: "#2563eb"
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      alert('Error initializing payment. Please try again.');
    }
  };

  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: 'Inter', sans-serif !important;
        overflow-y: scroll;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }

      body::-webkit-scrollbar {
        width: 8px;
      }

      body::-webkit-scrollbar-track {
        background: transparent;
      }

      body::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: content-box;
      }

      body::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.4);
      }

      #scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(to right, #3b82f6, #06b6d4);
        width: 0;
        z-index: 50;
        transition: width 0.1s ease;
      }

      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        z-index: 40;
        padding: 0.75rem 1.5rem;
        transition: all 0.3s ease;
      }

      .header-container {
        max-width: 80rem;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: #1f2937;
        font-weight: 800;
        font-size: 1.5rem;
        transition: color 0.3s ease;
      }

      .logo:hover {
        color: #2563eb;
      }

      .logo-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(to right, #3b82f6, #06b6d4);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
      }

      .nav-desktop {
        display: none;
        align-items: center;
        gap: 2rem;
      }

      @media (min-width: 1024px) {
        .nav-desktop {
          display: flex;
        }
      }

      .nav-link {
        color: #374151;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
      }

      .nav-link:hover {
        color: #2563eb;
        background-color: #f3f4f6;
      }

      .nav-buttons {
        display: none;
        align-items: center;
        gap: 1rem;
      }

      @media (min-width: 1024px) {
        .nav-buttons {
          display: flex;
        }
      }

      .header-btn {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }

      .btn-login {
        color: #374151;
        background: transparent;
      }

      .btn-login:hover {
        background-color: #f3f4f6;
      }

      .btn-register {
        color: white;
        background-color: #2563eb;
      }

      .btn-register:hover {
        background-color: #1d4ed8;
      }

      .btn-buy {
        color: white;
        background: linear-gradient(to right, #16a34a, #059669);
      }

      .btn-buy:hover {
        background: linear-gradient(to right, #15803d, #047857);
      }

      .mobile-menu-btn {
        display: block;
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
      }

      @media (min-width: 1024px) {
        .mobile-menu-btn {
          display: none;
        }
      }

      .mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: none;
        padding: 1rem;
      }

      .mobile-menu.open {
        display: block;
      }

      .mobile-nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .mobile-nav-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .shop-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        padding: 8rem 1.5rem 5rem 1.5rem;
        position: relative;
        overflow: hidden;
      }

      .shop-container::before {
        content: '';
        position: absolute;
        top: -20%;
        right: -30%;
        width: 70%;
        height: 140%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%);
        border-radius: 50%;
        z-index: 1;
      }

      .shop-content {
        max-width: 80rem;
        width: 100%;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 2;
      }

      .shop-header {
        margin-bottom: 4rem;
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s ease forwards;
      }

      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .shop-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 9999px;
        color: #2563eb;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .shop-title {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: #111827;
        line-height: 1.1;
      }

      @media (min-width: 768px) {
        .shop-title {
          font-size: 3.5rem;
        }
      }

      .shop-description {
        font-size: 1.25rem;
        color: #6b7280;
        line-height: 1.6;
        max-width: 48rem;
        margin: 0 auto;
      }

      .products-grid {
        display: grid;
        gap: 2.5rem;
        margin-top: 2rem;
      }

      @media (min-width: 768px) {
        .products-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .product-card {
        background: white;
        padding: 2.5rem;
        border-radius: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(229, 231, 235, 0.5);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        transform: translateY(50px);
        animation: fadeInUp 0.8s ease forwards;
        position: relative;
        overflow: hidden;
      }

      .product-card:nth-child(1) { animation-delay: 0.2s; }
      .product-card:nth-child(2) { animation-delay: 0.4s; }

      .product-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
        transition: left 0.6s ease;
      }

      .product-card:hover::before {
        left: 100%;
      }

      .product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.2);
      }

      .product-image-container {
        width: 100%;
        max-width: 300px;
        height: 200px;
        border-radius: 1rem;
        overflow: hidden;
        margin-bottom: 1.5rem;
        position: relative;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .product-card:hover .product-image {
        transform: scale(1.05);
      }

      .product-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: #111827;
      }

      .product-description {
        color: #6b7280;
        margin-bottom: 1rem;
        line-height: 1.6;
        text-align: center;
        max-width: 280px;
      }

      .product-price {
        font-size: 1.25rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        color: #2563eb;
      }

      .product-actions {
        display: flex;
        gap: 1rem;
        margin-top: auto;
        width: 100%;
        max-width: 280px;
      }

      .btn-more {
        flex: 1;
        padding: 0.75rem 1.5rem;
        background: white;
        color: #2563eb;
        border: 2px solid #2563eb;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        text-align: center;
        width: 100%;
      }

      .btn-more:hover {
        background: #2563eb;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
      }

      .btn-buy-wrapper {
        flex: 1;
      }

      .buy-button {
        width: 100% !important;
        padding: 0.75rem 1.5rem !important;
        background: white !important;
        color: #2563eb !important;
        border: 2px solid #2563eb !important;
        border-radius: 0.75rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
      }

      .buy-button:hover {
        background: #2563eb !important;
        color: white !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3) !important;
      }

      .feature-highlight {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: linear-gradient(to right, #f59e0b, #d97706);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease;
      }

      .product-card:hover .feature-highlight {
        opacity: 1;
        transform: scale(1);
      }

      .currency-symbol {
        font-size: 1rem;
        font-weight: 600;
      }
    `;
    
    // Scroll progress bar
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = scrollPercent + "%";
    };
    window.addEventListener("scroll", handleScroll);

    document.head.appendChild(styleElement);
    setIsLoaded(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#f9fafb', color: '#1f2937', fontFamily: 'Inter, sans-serif' }}>
      {/* Progress bar */}
      <div className="min-h-screen bg-gray-50">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <div id="scroll-progress" />
        {showPaymentForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {paymentSuccess ? (
                  <div className="p-4 bg-green-100 text-green-800 rounded-md text-center">
                    ✅ Payment successful and your order has been placed!
                  </div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block font-medium mb-1">Product Name</label>
                      <input 
                        type="text" 
                        value={selectedProduct.name}
                        readOnly 
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Price</label>
                      <input 
                        type="text" 
                        value={`₹${selectedProduct.displayPrice}`}
                        readOnly 
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Quantity</label>
                      <input 
                        type="number" 
                        name="quantity"
                        min="1" 
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required 
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Shipping Address</label>
                      <textarea 
                        name="address" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                        className="w-full border border-gray-300 rounded-md px-4 py-2" 
                        rows="3"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow"
                    >
                      Pay ₹{selectedProduct.displayPrice * formData.quantity} & Confirm Order
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
        <header className="header">
          <div className="header-container">
            <Link href="/" className="logo">
              <img 
                src="/assets/images/Nlogo.png" 
                alt="SmartRemote Logo" 
                style={{ height: '40px' }} 
              />
            </Link>

            <nav className="nav-desktop">
              <Link href="/#features" className="nav-link">Features</Link>
              <Link href="/#how-it-works" className="nav-link">How It Works</Link>
              <Link href="/#specs" className="nav-link">Specifications</Link>
              <Link href="/support" className="nav-link">Support</Link>
            </nav>

            <div className="nav-buttons">
              <Link href="/login" className="header-btn btn-login">Login</Link>
              <Link href="/register" className="header-btn btn-register">Register</Link>
              <Link href="/shop" className="header-btn btn-buy">Buy Now</Link>
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <div className="mobile-nav-links">
                <Link href="/#features" className="nav-link">Features</Link>
                <Link href="/#how-it-works" className="nav-link">How It Works</Link>
                <Link href="/#specs" className="nav-link">Specifications</Link>
                <Link href="/support" className="nav-link">Support</Link>
              </div>
              <div className="mobile-nav-buttons">
                <Link href="/login" className="header-btn btn-login">Login</Link>
                <Link href="/register" className="header-btn btn-register">Register</Link>
                <Link href="/shop" className="header-btn btn-buy">Buy Now</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Shop Content */}
        <div className="shop-container">
          <div className="shop-content">
            <div className="shop-header">
              <div className="shop-badge">
                🛒 Premium IoT Solutions
              </div>
              <h1 className="shop-title">
                Our Products
              </h1>
              <p className="shop-description">
                Discover our range of smart devices designed to transform your home 
                and business with cutting-edge IoT technology.
              </p>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-100">
                    <ModelViewer 
                      modelPath={product.model}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.shortDesc}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-gray-900">₹{product.displayPrice.toLocaleString()}</span>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/shop/${product.id}`} 
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowPaymentForm(true);
                            setPaymentSuccess(false);
                            setFormData({
                              name: '',
                              phone: '',
                              email: '',
                              address: '',
                              quantity: 1
                            });
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
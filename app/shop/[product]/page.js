"use client";
import { notFound } from "next/navigation";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from "react";

// Dynamically import the ModelViewer component with SSR disabled
const ModelViewer = dynamic(
  () => import('@/components/ModelViewer'),
  { ssr: false }
);

const productDetails = {
  "smart-switch": {
    name: "Smart Switch",
    price: 899,
    model: "/assets/model/1final_online.glb",
    description:
      "Control your lights and appliances with a tap or voice command. Works with Alexa and Google Home.",
    features: ["Wi-Fi Enabled", "Energy Monitoring", "Voice Control"],
  },
  "smart-plug": {
    name: "Smart Plug",
    price: 799,
    model: "/assets/model/2plug.glb",
    description:
      "Automates appliances with scheduling and remote control. Perfect for everyday electronics.",
    features: ["Compact Design", "Easy Setup", "Alexa & Google Home Support"],
  },
};

export default function ProductPage({ params }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // unwrap params (Next.js 15+)
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.product;
  const product = productDetails[productId];

  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement("style");
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

      .product-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        padding: 8rem 1.5rem 5rem 1.5rem;
        position: relative;
        overflow: hidden;
      }

      .product-container::before {
        content: '';
        position: absolute;
        top: 0;
        right: -50%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
        border-radius: 50%;
        z-index: 1;
      }

      .product-content {
        max-width: 80rem;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 3rem;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .breadcrumb a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .breadcrumb a:hover {
        color: #1d4ed8;
      }

      .product-card {
        background: white;
        border-radius: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid rgba(229, 231, 235, 0.5);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }

      .product-card:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .product-grid {
        display: grid;
        gap: 3rem;
        padding: 3rem;
      }

      @media (min-width: 768px) {
        .product-grid {
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }
      }

      .product-image-container {
        position: relative;
        border-radius: 1rem;
        overflow: hidden;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 2rem;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-image {
        border-radius: 0.75rem;
        transition: transform 0.3s ease;
      }

      .product-image:hover {
        transform: scale(1.05);
      }

      .product-info {
        padding: 1rem 0;
      }

      .product-badge {
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

      .product-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }

      @media (min-width: 768px) {
        .product-title {
          font-size: 3rem;
        }
      }

      .product-description {
        font-size: 1.125rem;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .features-section {
        margin-bottom: 2rem;
      }

      .features-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 1rem;
      }

      .features-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;
      }

      .feature-item:hover {
        background: #f1f5f9;
        border-color: #2563eb;
      }

      .feature-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: #2563eb;
        flex-shrink: 0;
      }

      .feature-text {
        color: #374151;
        font-weight: 500;
      }

      .price-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%);
        border-radius: 1rem;
        border: 1px solid #e2e8f0;
      }

      .price {
        font-size: 2.5rem;
        font-weight: 800;
        color: #2563eb;
        margin-bottom: 0.5rem;
      }

      .price-label {
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .buy-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .modern-buy-button {
        background: linear-gradient(to right, #2563eb, #1d4ed8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1.125rem;
        font-weight: 600;
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: none;
        cursor: pointer;
        width: 100%;
      }

      .modern-buy-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
        background: linear-gradient(to right, #1d4ed8, #1e40af);
      }

      .guarantee-text {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 1rem;
      }
    `;
    
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  if (!product) return notFound();

  return (
    <div style={{ backgroundColor: '#f9fafb', color: '#1f2937', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            <div className="logo-icon">SR</div>
            <span>SmartRemote</span>
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
            <Link href="/shop" className="header-btn btn-buy">Shop</Link>
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
              <Link href="/shop" className="header-btn btn-buy">Shop</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Product Page Content */}
      <div className="product-container">
        <div className="product-content">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          {/* Product Card */}
          <div className="product-card">
            <div className="product-grid">
              {/* Product Image */}
              <div className="product-image-container w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <ModelViewer 
                  modelPath={product.model}
                  className="w-full h-full"
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-badge">
                  ✨ Premium Quality
                </div>
                
                <h1 className="product-title">{product.name}</h1>
                
                <p className="product-description">{product.description}</p>

                {/* Features */}
                <div className="features-section">
                  <h3 className="features-title">Key Features</h3>
                  <div className="features-list">
                    {product.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="price-section">
                  <div className="price">₹{product.price.toLocaleString()}</div>
                  <div className="price-label">Free shipping • 30-day returns</div>
                </div>

                {/* Buy Button */}
                <div className="buy-section">
                  <Link 
                    href={`/checkout?id=${product.id}&amount=${product.price}&name=${encodeURIComponent(product.name)}`}
                    className="buy-button w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 100 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    </svg>
                    Buy Now - ₹{product.price.toLocaleString()}
                  </Link>
                  <p className="guarantee-text">
                    🛡️ 30-day money-back guarantee • ⚡ Fast delivery • 🔒 Secure payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

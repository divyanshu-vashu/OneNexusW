"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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

      .register-main {
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8rem 1.5rem 2rem 1.5rem;
        position: relative;
        overflow: hidden;
      }

      .register-main::before {
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

      .register-container {
        position: relative;
        z-index: 2;
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        width: 100%;
        max-width: 28rem;
        border: 1px solid rgba(229, 231, 235, 0.5);
      }

      .register-title {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        color: #111827;
        text-align: center;
      }

      .register-subtitle {
        color: #6b7280;
        text-align: center;
        margin-bottom: 2rem;
        font-size: 0.875rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background-color: #f9fafb;
      }

      .form-input:focus {
        outline: none;
        border-color: #2563eb;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .form-input::placeholder {
        color: #9ca3af;
      }

      .register-button {
        width: 100%;
        background: linear-gradient(to right, #2563eb, #1d4ed8);
        color: white;
        padding: 0.875rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        margin-bottom: 1.5rem;
      }

      .register-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
      }

      .register-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
      }

      .login-link {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .login-link a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .login-link a:hover {
        color: #1d4ed8;
      }

      .success-message {
        background-color: #d1fae5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        text-align: center;
      }

      .error-message {
        background-color: #fee2e2;
        border: 1px solid #fca5a5;
        color: #991b1b;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        text-align: center;
      }
    `;
    
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Sending registration request with:', { name, email, password: '***' });
      const response = await fetch('https://onenexus.vashuvd.site/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const responseData = await response.json().catch(() => ({}));
      console.log('Registration response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          throw new Error('A user with this email already exists.');
        }
        if (response.status === 422) {
          const validationError = responseData.error || responseData.message || 'Validation failed';
          throw new Error(validationError);
        }
        throw new Error(
          responseData.message || 
          responseData.error?.message ||
          responseData.error ||
          `Registration failed with status ${response.status}`
        );
      }
      
      // If registration is successful, redirect to login with success message
      router.push('/login?registered=true');
      
    } catch (err) {
      const errorMessage = err.message.includes('Failed to fetch') 
        ? 'Unable to connect to the server. Please check your internet connection.'
        : err.message;
      
      setError(errorMessage);
      console.error('Registration error:', {
        error: err,
        name,
        email,
        passwordLength: password?.length
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', color: '#1f2937', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
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

      {/* Main Register Section */}
      <main className="register-main">
        <div className="register-container">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join thousands of users who trust SmartRemote for their smart home needs
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link href="/login">Sign in here</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
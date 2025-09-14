"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setUser } = useAppContext();
  const router = useRouter();

  // Check for success message from registration
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please login with your credentials.');
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

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

      .login-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        padding: 8rem 1.5rem 5rem 1.5rem;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .login-container::before {
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

      .login-card {
        background: white;
        border-radius: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid rgba(229, 231, 235, 0.5);
        backdrop-filter: blur(10px);
        padding: 3rem;
        width: 100%;
        max-width: 28rem;
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
      }

      .login-card:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-badge {
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

      .login-title {
        font-size: 2rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 0.5rem;
        line-height: 1.1;
      }

      .login-subtitle {
        color: #6b7280;
        font-size: 1rem;
        line-height: 1.5;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }

      .form-input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.75rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f9fafb;
        box-sizing: border-box;
      }

      .form-input:focus {
        outline: none;
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .form-input::placeholder {
        color: #9ca3af;
      }

      .login-button {
        width: 100%;
        background: linear-gradient(to right, #2563eb, #1d4ed8);
        color: white;
        padding: 0.875rem 1rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        margin-bottom: 1rem;
      }

      .login-button:hover {
        background: linear-gradient(to right, #1d4ed8, #1e40af);
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
      }

      .google-button {
        width: 100%;
        background: white;
        color: #374151;
        padding: 0.875rem 1rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        border: 2px solid #e5e7eb;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .google-button:hover {
        border-color: #dc2626;
        color: #dc2626;
        background: #fef2f2;
        transform: translateY(-1px);
      }

      .divider {
        position: relative;
        margin: 1.5rem 0;
        text-align: center;
      }

      .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e5e7eb;
        z-index: 1;
      }

      .divider-text {
        background: white;
        padding: 0 1rem;
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
        position: relative;
        z-index: 2;
      }

      .register-link {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 2rem;
      }

      .register-link a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .register-link a:hover {
        color: #1d4ed8;
      }

      .buy-now-section {
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }

      .buy-now-label {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        font-weight: 500;
      }

      .buy-now-button {
        width: 100%;
        background: linear-gradient(to right, #16a34a, #059669);
        color: white;
        padding: 0.875rem 1rem;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
      }

      .buy-now-button:hover {
        background: linear-gradient(to right, #15803d, #047857);
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.4);
      }

      @media (max-width: 640px) {
        .login-card {
          padding: 2rem;
        }
        
        .login-title {
          font-size: 1.5rem;
        }
      }
    `;
    
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      console.log('Sending login request with:', { email });
      const response = await fetch('https://onenexus.vashuvd.site/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const responseData = await response.json().catch(() => ({}));
      console.log('Login response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw new Error(
          responseData.message || 
          responseData.error?.message || 
          responseData.error ||
          `Login failed with status ${response.status}`
        );
      }
      
      // If login is successful, redirect to dashboard
      if (responseData.user || responseData.token) {
        // Store the token if available
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }
        
        // Set user data in context
        if (responseData.user) {
          setUser(responseData.user);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Login successful but no user data received');
      }
    } catch (err) {
      const errorMessage = err.message.includes('Failed to fetch') 
        ? 'Unable to connect to the server. Please check your internet connection.'
        : err.message;
      
      setError(errorMessage);
      console.error('Login error:', err);
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
            <Image 
              src="/assets/images/Nlogo.png" 
              alt="SmartRemote Logo" 
              width={120}
              height={40}
              style={{ height: '40px', width: 'auto' }} 
              priority
            />
          </Link>

          <nav className="nav-desktop">
            <Link href="/#features" className="nav-link">Features</Link>
            <Link href="/#how-it-works" className="nav-link">How It Works</Link>
            <Link href="/#specs" className="nav-link">Specifications</Link>
            <Link href="/support" className="nav-link">Support</Link>
          </nav>

          <div className="nav-buttons">
            <Link href="/register" className="header-btn btn-register">Register</Link>
            <Link href="/shop" className="header-btn btn-buy">Shop Now</Link>
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
              <Link href="/register" className="header-btn btn-register">Register</Link>
              <Link href="/shop" className="header-btn btn-buy">Shop Now</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-badge">
              Welcome Back
            </div>
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">Access your smart device dashboard</p>
          </div>

          {successMessage && (
            <div style={{ 
              color: 'green', 
              marginBottom: '1rem', 
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0'
            }}>
              {successMessage}
            </div>
          )}
          {error && (
            <div style={{ 
              color: '#b91c1c', 
              marginBottom: '1rem', 
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.5rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                'Signing In...'
              ) : (
                <>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">or continue with</span>
          </div>

          <button onClick={() => signIn("google")} className="google-button">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="register-link">
            Don&apos;t have an account? 
            <Link href="/register"> Create one here</Link>
          </div>

          <div className="buy-now-section">
            <p className="buy-now-label">Ready to get started?</p>
            <Link href="/shop" className="buy-now-button">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              Shop Smart Devices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
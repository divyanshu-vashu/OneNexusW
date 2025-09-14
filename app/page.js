"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      html, body {
        max-width: 100%;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
      }

      * {
        box-sizing: border-box;
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

      section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }

      section.visible {
        opacity: 1;
        transform: translateY(0);
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
        width: 100vw;
        overflow: hidden;
      }

      .header-container {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        box-sizing: border-box;
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

      .hero-section {
        background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        padding: 8rem 1.5rem 5rem 1.5rem;
        position: relative;
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
      }

      .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        right: -50%;
        width: 150%;
        height: 100%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
        border-radius: 50%;
        z-index: 1;
      }

      .hero-content {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 2.5rem;
        position: relative;
        z-index: 2;
        padding: 0 1rem;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .hero-content {
          flex-direction: row;
        }
      }

      .hero-text {
        width: 100%;
        text-align: center;
      }

      @media (min-width: 768px) {
        .hero-text {
          width: 55%;
          text-align: left;
        }
      }

      .hero-badge {
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

      .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        color: #111827;
        line-height: 1.1;
      }

      @media (min-width: 768px) {
        .hero-title {
          font-size: 4rem;
        }
      }

      .hero-description {
        font-size: 1.25rem;
        color: #6b7280;
        margin-bottom: 2rem;
        line-height: 1.6;
        max-width: 32rem;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 2rem;
        width: 100%;
        max-width: 100%;
      }

      @media (min-width: 768px) {
        .hero-buttons {
          justify-content: flex-start;
        }
      }

      .btn-primary {
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
        gap: 0.5rem;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
      }

      .btn-secondary {
        background: white;
        color: #374151;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1.125rem;
        font-weight: 600;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-secondary:hover {
        border-color: #2563eb;
        color: #2563eb;
        transform: translateY(-1px);
      }

      .hero-stats {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        max-width: 100%;
        padding: 0 1rem;
      }

      @media (min-width: 768px) {
        .hero-stats {
          justify-content: flex-start;
        }
      }

      .stat-item {
        text-align: center;
      }

      @media (min-width: 768px) {
        .stat-item {
          text-align: left;
        }
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: #2563eb;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
      }

      .hero-animation {
        width: 100%;
        max-width: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
      }

      @media (min-width: 768px) {
        .hero-animation {
          width: 45%;
        }
      }

      .section-white {
        padding: 5rem 1.5rem;
        background-color: white;
      }

      .section-gray {
        padding: 5rem 1.5rem;
        background-color: #f9fafb;
      }

      .section-container {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
        padding: 0 1rem;
        box-sizing: border-box;
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #dbeafe;
        color: #2563eb;
        font-size: 0.875rem;
        font-weight: 600;
        border-radius: 9999px;
        margin-bottom: 1rem;
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: #111827;
      }

      .section-description {
        font-size: 1.25rem;
        color: #6b7280;
        line-height: 1.6;
        max-width: 48rem;
        margin: 0 auto;
      }

      .features-grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 3rem;
      }

      @media (min-width: 768px) {
        .features-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .features-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border: 1px solid #f3f4f6;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
      }

      .feature-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(to right, #3b82f6, #06b6d4);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
      }

      .feature-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #111827;
      }

      .feature-description {
        color: #6b7280;
        line-height: 1.6;
      }

      .specs-grid {
        display: grid;
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      @media (min-width: 768px) {
        .specs-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .spec-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }

      .spec-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: #dbeafe;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2563eb;
      }

      .spec-content h4 {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
      }

      .spec-content p {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .testimonials-grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 3rem;
      }

      @media (min-width: 768px) {
        .testimonials-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .testimonials-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .testimonial-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .testimonial-content {
        font-style: italic;
        color: #374151;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .author-avatar {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(to right, #3b82f6, #06b6d4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
      }

      .author-info h5 {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
      }

      .author-info p {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .cta-section {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        text-align: center;
        padding: 6rem 1.5rem;
        position: relative;
        overflow: hidden;
      }

      .cta-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
        animation: float 20s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }

      .cta-content {
        position: relative;
        z-index: 2;
        max-width: 48rem;
        margin: 0 auto;
      }

      .cta-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }

      @media (min-width: 768px) {
        .cta-title {
          font-size: 3rem;
        }
      }

      .cta-description {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-white {
        background-color: white;
        color: #2563eb;
        font-weight: 700;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-white:hover {
        background-color: #f8fafc;
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      }

      .btn-outline {
        background-color: transparent;
        color: white;
        font-weight: 600;
        padding: 1rem 2rem;
        border: 2px solid white;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-outline:hover {
        background-color: white;
        color: #2563eb;
        transform: translateY(-1px);
      }

      .footer {
        background-color: #111827;
        color: #d1d5db;
        padding: 3rem 1.5rem 1.5rem 1.5rem;
        position: relative;
      }

      .footer-content {
        max-width: 80rem;
        margin: 0 auto;
      }

      .footer-grid {
        display: grid;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      @media (min-width: 768px) {
        .footer-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .footer-section h4 {
        color: white;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .footer-section a {
        color: #9ca3af;
        text-decoration: none;
        display: block;
        margin-bottom: 0.5rem;
        transition: color 0.3s ease;
      }

      .footer-section a:hover {
        color: white;
      }

      .footer-bottom {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #9ca3af;
        border-top: none;
        padding-top: 0;
        display: block;
      }

      /* Animation delays for sections */
      section:nth-child(1) { transition-delay: 0.1s; }
      section:nth-child(2) { transition-delay: 0.2s; }
      section:nth-child(3) { transition-delay: 0.3s; }
      section:nth-child(4) { transition-delay: 0.4s; }
      section:nth-child(5) { transition-delay: 0.5s; }
    `;
    
    document.head.appendChild(styleElement);

    // Load Lottie player script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.head.appendChild(script);

    // Scroll progress bar
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = scrollPercent + "%";

      // Check for arrow visibility
      const section = document.getElementById('3d-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        setShowArrow(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Fade sections
    const sections = document.querySelectorAll("section");
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((s) => fadeObserver.observe(s));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((s) => fadeObserver.unobserve(s));
      document.head.removeChild(styleElement);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#f9fafb', color: '#1f2937', fontFamily: 'Inter, sans-serif' }}>
      {/* Progress bar */}
      <div id="scroll-progress"></div>

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
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#how-it-works" className="nav-link">How It Works</Link>
            <Link href="#specs" className="nav-link">Specifications</Link>
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
              <Link href="#features" className="nav-link">Features</Link>
              <Link href="#how-it-works" className="nav-link">How It Works</Link>
              <Link href="#specs" className="nav-link">Specifications</Link>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            {/* <div className="hero-badge">
              🚀 Trusted by 10,000+ Smart Homes Worldwide
            </div> */}
            <h1 className="hero-title">
              Transform Any Device Into a Smart Device
            </h1>
            <p className="hero-description">
              Experience the future of home automation with our cutting-edge IoT device. 
              Control any electronic device remotely with military-grade security and 
              enterprise-level reliability.
            </p>
            <div className="hero-buttons">
              <Link href="/shop" className="btn-primary">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
                Buy Now 
              </Link>
              <Link href="#demo" className="btn-secondary">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Watch Setup
              </Link>
            </div>
            {/* Statistics section commented out - will be added later
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9★</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
            */}
          </div>
          <div className="hero-animation">
            <dotlottie-player
              src="https://lottie.host/619e2698-a1eb-4c5c-997a-b4b8d863eec4/eqc7PfaS6a.lottie"
              background="transparent"
              speed="1"
              style={{ width: "100%", maxWidth: "600px", height: "500px" }}
              loop
              autoPlay
            />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="section-gray">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">ADVANCED FEATURES</div>
            <h2 className="section-title">Everything You Need for Smart Control</h2>
            <p className="section-description">
              Our IoT device combines cutting-edge technology with user-friendly design 
              to deliver the most comprehensive smart home solution available.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="feature-title">Universal Compatibility</h3>
              <p className="feature-description">
                Works with any AC or DC powered device. From lamps and fans to coffee makers 
                and industrial equipment - control everything from one dashboard.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.414 5 5 0 017.072 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="feature-title">Reliable Wi-Fi Connectivity</h3>
              <p className="feature-description">
                Enjoy stable 2.4 GHz Wi-Fi with 802.11 b/g/n support, ensuring smooth communication and dependable performance for your devices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="feature-title">Bank-Level Security</h3>
              <p className="feature-description">
                End-to-end encryption, secure authentication, and regular security updates 
                keep your devices and data protected from cyber threats.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Real-Time Monitoring</h3>
              <p className="feature-description">
                Instantly check whether your devices are On or Off with our simple and reliable status updates.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="feature-title">Voice Assistant Ready</h3>
              <p className="feature-description">
                Compatible with Alexa.Control your devices 
                with simple voice commands for hands-free operation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="feature-title">Smart Automation</h3>
              <p className="feature-description">
                Create intelligent schedules, trigger-based automations, and energy-saving 
                routines that adapt to your lifestyle automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section id="specs" className="section-white">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">SPECIFICATIONS</div>
            <h2 className="section-title">Technical Excellence</h2>
            <p className="section-description">
              Built with industrial-grade components and cutting-edge technology for 
              reliable, long-lasting performance.
            </p>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Power Rating</h4>
                <p>Up to 15A / 1800W continuous load</p>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.414 5 5 0 017.072 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Connectivity</h4>
                <p>Wi-Fi 6 (802.11ax), 2.4GHz + 5GHz</p>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Security</h4>
                <p>AES-256 encryption, WPA3, secure boot</p>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Response Time</h4>
                <p> 100ms local,  500ms cloud commands</p>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Support</h4>
                <p>24x7 Technical support provided</p>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h3v-8a1 1 0 011-1h4a1 1 0 011 1v8h3a1 1 0 001-1V7l-7-5z"/>
                </svg>
              </div>
              <div className="spec-content">
                <h4>Operating Range</h4>
                <p>-10°C to 55°C, 0-90% humidity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-gray">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">SIMPLE SETUP</div>
            <h2 className="section-title">Get Started in Minutes</h2>
            <p className="section-description">
              Our intuitive setup process gets you up and running with smart control 
              in just three easy steps.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(to right, #10b981, #059669)'}}>
                <span style={{fontSize: '1.5rem', fontWeight: '800'}}>1</span>
              </div>
              <h3 className="feature-title">Plug & Connect</h3>
              <p className="feature-description">
                Simply plug your device into our smart outlet and connect to your Wi-Fi 
                using our mobile app. The setup wizard guides you through each step.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(to right, #f59e0b, #d97706)'}}>
                <span style={{fontSize: '1.5rem', fontWeight: '800'}}>2</span>
              </div>
              <h3 className="feature-title">Configure & Customize</h3>
              <p className="feature-description">
                Personalize your device with custom names for easy identification.Set schedules to turn devices On or Off automatically at your preferred times.Create smart automation rules to make your devices work together seamlessly. 
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{background: 'linear-gradient(to right, #8b5cf6, #7c3aed)'}}>
                <span style={{fontSize: '1.5rem', fontWeight: '800'}}>3</span>
              </div>
              <h3 className="feature-title">Control Anywhere</h3>
              <p className="feature-description">
                Stay connected to your devices from anywhere in the world.Control them easily through our mobile app, voice assistants, or web dashboard.Enjoy the freedom of managing your smart home anytime, on any platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - Commented out for now
      <section id="testimonials" className="section-white">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">CUSTOMER REVIEWS</div>
            <h2 className="section-title">Loved by Thousands</h2>
            <p className="section-description">
              Join over 10,000 satisfied customers who have transformed their homes 
              and businesses with SmartRemote.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Game changer! I can now control my workshop equipment remotely and monitor 
                power usage. The energy savings alone paid for the device in 3 months."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MJ</div>
                <div className="author-info">
                  <h5>Mike Johnson</h5>
                  <p>Workshop Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                "Perfect for my elderly parents. I can help them control lights and devices 
                remotely, and the app sends me alerts if anything unusual happens."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SC</div>
                <div className="author-info">
                  <h5>Sarah Chen</h5>
                  <p>Caregiver</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                "As a tech professional, I'm impressed by the security features and API access. 
                Integration with our existing systems was seamless."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">RP</div>
                <div className="author-info">
                  <h5>Robert Park</h5>
                  <p>IT Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Demo Video Section */}
      <section className="section-gray">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">LIVE DEMO</div>
            <h2 className="section-title">See It In Action</h2>
            <p className="section-description">
              Watch how easy it is to set up and control your devices with SmartRemote.
            </p>
          </div>
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '48rem',
            margin: '0 auto',
            aspectRatio: '16/9',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
          }}>
            <video
              ref={(video) => {
                if (video) {
                  const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                      if (entry.isIntersecting) {
                        video.play().catch(() => {
                          // Autoplay failed, which is expected in many browsers
                        });
                      } else {
                        video.pause();
                      }
                    });
                  }, { threshold: 0.5 });
                  observer.observe(video);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Cg transform='translate(400,225)'%3E%3Ccircle r='50' fill='%232563eb' opacity='0.1'/%3E%3Cpolygon points='-15,-20 -15,20 20,0' fill='%232563eb'/%3E%3C/g%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%236b7280' font-family='Inter, sans-serif' font-size='18'%3ESmartRemote Demo%3C/text%3E%3C/svg%3E"
              controls
              muted
              loop
              preload="metadata"
            >
              <source src="/assets/videos/demoVid.mp4" type="video/mp4" />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                color: '#6b7280',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}>
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '0.75rem'}}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Your browser does not support the video tag.
              </div>
            </video>
          </div>
        </div>
      </section>

      {/* 3D Model Viewer */}
      <section id="3d-section" style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: '3rem 1.5rem'
      }}>
        <div style={{textAlign: 'center', width: '100%', maxWidth: '80rem', position: 'relative'}}>
          <div className="section-badge" style={{marginBottom: '1rem'}}>3D MODEL</div>
          <h2 className="section-title" style={{marginBottom: '2rem'}}>Explore the Design</h2>
          <iframe
            src="/assets/build/index.html"
            style={{
              width: '100%',
              maxWidth: '62.5rem',
              height: '43.75rem',
              border: 'none',
              borderRadius: '1.25rem',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
              margin: '0 auto'
            }}
          ></iframe>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Make Your Home Smarter?
          </h2>
          <p className="cta-description">
            Be the first to unlock the future of smart living with our brand-new model. Start your journey today and transform your home or business with innovation that’s built to impress!
          </p>
          <div className="cta-buttons">
            <Link href="/shop" className="btn-white">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              Buy Now 
            </Link>
            <Link href="/demo" className="btn-outline">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              Watch Setup
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* <div className="footer-content"> */}
          <div className="footer-grid">
            <div className="footer-section">
              {/* <h4>SmartRemote</h4>
              <p style={{color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem'}}>
                Making homes and businesses smarter, one device at a time.
              </p> */}
              <div style={{display: 'flex', gap: '1rem'}}>
                {/* <a href="#" style={{color: '#9ca3af'}}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a> */}
                {/* <a href="#" style={{color: '#9ca3af'}}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a> */}
              </div>
            </div>
            
            {/* <div className="footer-section">
              <h4>Product</h4>
              <Link href="/features">Features</Link>
              <Link href="/specifications">Specifications</Link>
              <Link href="/compatibility">Compatibility</Link>
              <Link href="/pricing">Pricing</Link>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <Link href="/help">Help Center</Link>
              <Link href="/setup">Setup Guide</Link>
              <Link href="/api">API Documentation</Link>
              <Link href="/warranty">Warranty</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div> */}
          
          <div className="footer-bottom">
            <p>&copy; 2025 SmartRemote Inc. All rights reserved. | Designed for the future of smart homes.</p>
          </div>
        </div>
      </footer>
      {showArrow && (
        <Link href="#cta-section" style={{
          position: 'fixed',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          zIndex: 1000
        }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 1)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.9)'}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
      )}
    </div>
  );
}
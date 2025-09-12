"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .support-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
      }

      .back-button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .back-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #2563eb;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: background-color 0.2s;
      }

      .back-button:hover {
        background-color: #f3f4f6;
      }

      .support-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .support-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 1rem;
      }

      .support-subtitle {
        font-size: 1.25rem;
        color: #6b7280;
        max-width: 700px;
        margin: 0 auto;
      }

      .support-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      @media (min-width: 1024px) {
        .support-grid {
          grid-template-columns: 3fr 2fr;
        }
      }

      .support-form {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
      }

      .form-input, .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.3s;
      }

      .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }

      .form-textarea {
        min-height: 150px;
        resize: vertical;
      }

      /* Header Styles */
      .header {
        background: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 50;
        padding: 1rem 0;
      }

      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.25rem;
        color: #111827;
      }

      .logo img {
        height: 40px;
      }

      .nav-desktop {
        display: flex;
        gap: 1.5rem;
      }

      .nav-link {
        color: #4b5563;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }

      .nav-link:hover {
        color: #2563eb;
      }

      .nav-buttons {
        display: flex;
        gap: 0.75rem;
      }

      .header-btn {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s;
      }

      .header-btn:not(.btn-primary) {
        color: #4b5563;
      }

      .header-btn:hover:not(.btn-primary) {
        color: #2563eb;
      }

      .btn-primary {
        background: #2563eb;
        color: white;
      }

      .btn-primary:hover {
        background: #1d4ed8;
      }

      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        color: #4b5563;
      }

      .mobile-menu {
        display: none;
        padding: 1rem 2rem;
        background: white;
        border-top: 1px solid #e5e7eb;
      }

      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .mobile-nav-link {
        color: #4b5563;
        text-decoration: none;
        padding: 0.75rem 0;
        font-weight: 500;
      }

      .mobile-nav-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      .mobile-nav-btn {
        display: block;
        padding: 0.75rem;
        text-align: center;
        border-radius: 0.375rem;
        font-weight: 500;
        text-decoration: none;
      }

      .mobile-nav-btn:not(.btn-primary) {
        color: #4b5563;
        border: 1px solid #e5e7eb;
      }

      @media (max-width: 1024px) {
        .nav-desktop, .nav-buttons {
          display: none;
        }

        .mobile-menu-btn {
          display: block;
        }

        .mobile-menu {
          display: block;
        }
      }

      .submit-btn {
        background: #2563eb;
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.3s;
        width: 100%;
      }

      .submit-btn:hover {
        background: #1d4ed8;
      }

      .submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .status-message {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
      }

      .status-success {
        background-color: #dcfce7;
        color: #166534;
      }

      .status-error {
        background-color: #fee2e2;
        color: #991b1b;
      }

      .team-section {
        background: #f9fafb;
        border-radius: 1rem;
        padding: 2rem;
      }

      .team-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .team-grid {
        display: grid;
        gap: 1.5rem;
      }

      .team-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
      }

      .team-card:hover {
        transform: translateY(-2px);
      }

      .team-avatar {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: #dbeafe;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e40af;
        flex-shrink: 0;
      }

      .team-info h4 {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
      }

      .team-role {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .team-email {
        color: #3b82f6;
        font-size: 0.875rem;
        text-decoration: none;
        display: inline-block;
        margin-top: 0.25rem;
      }

      .team-email:hover {
        text-decoration: underline;
      }

      .contact-info {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
      }

      .contact-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #4b5563;
        margin-bottom: 0.75rem;
      }

      .contact-icon {
        color: #3b82f6;
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ 
          success: true, 
          message: 'Your message has been sent successfully! We will get back to you soon.' 
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to send message. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamMembers = [
    {
      name: 'Anurag Kumar',
      role: 'Device Support',
      email: 'support@smartremote.com',
      initial: 'AK'
    },
    {
      name: 'Divyanshu Singh',
      role: 'Technical Support',
      email: 'tech@smartremote.com',
      initial: 'DS'
    },
    {
      name: 'Swanand Yamgar',
      role: 'Technical Support',
      email: 'yamgarswanand@gmail.com',
      initial: 'SY'
    }
  ];

  return (
    <div className="support-container">
      {/* Header */}
      <header className="header" style={{ marginBottom: '2rem' }}>
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
            <Link href="/login" className="header-btn">Login</Link>
            <Link href="/register" className="header-btn btn-primary">Get Started</Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link href="/#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
              <Link href="/#testimonials" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
              <Link href="/#specs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Specifications</Link>
              <Link href="/support" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Support</Link>
              <div className="mobile-nav-buttons">
                <Link href="/login" className="mobile-nav-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="mobile-nav-btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="support-content">
        <h1 className="support-title">How can we help you?</h1>
        <p className="support-subtitle">
          Our support team is here to help you with any questions or issues you might have.
          Fill out the form below or contact our support team directly.
        </p>
      </div>

      <div className="support-grid">
        <div className="support-form">
          {submitStatus.message && (
            <div className={`status-message ${submitStatus.success ? 'status-success' : 'status-error'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="How can we help?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="team-section">
          <h2 className="team-title">Our Support Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  {member.initial}
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  <a href={`mailto:${member.email}`} className="team-email">
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-info">
            <h3 className="contact-title">Contact Information</h3>
            <div className="contact-item">
              <svg className="contact-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@smartremote.com</span>
            </div>
            <div className="contact-item">
              <svg className="contact-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
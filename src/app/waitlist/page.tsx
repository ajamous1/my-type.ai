'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './waitlist.module.css';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Thanks for joining our waitlist! We\'ll notify you when MyType is ready.');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Join the MyType Waitlist</h1>
            <p className={styles.subtitle}>
              Be the first to know when MyType launches. Get early access to our AI-powered typography tool.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Joining...' : 'Join Waitlist'}
                </button>
              </div>
              {message && (
                <div className={`${styles.message} ${styles.error}`}>
                  {message}
                </div>
              )}
            </form>
          ) : (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successMessage}>{message}</p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setMessage('');
                }}
                className={styles.addAnotherButton}
              >
                Add Another Email
              </button>
            </div>
          )}

          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>What you&apos;ll get:</h3>
            <ul className={styles.featuresList}>
              <li>Early access to MyType when it launches</li>
              <li>Exclusive updates on new features</li>
              <li>Special launch pricing for waitlist members</li>
              <li>Priority support and feedback opportunities</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

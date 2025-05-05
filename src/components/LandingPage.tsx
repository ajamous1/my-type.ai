'use client';

import { useEffect, useState } from 'react';
import { FontCardsContainer } from './FontCard';
import styles from '@/styles/LandingPage.module.css';

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fonts = [
    { fontName: 'Helvetica' },
    { fontName: 'Courier New' },
    { fontName: 'Times' },
    { fontName: 'Inter' },
    { fontName: 'Verdana' },
    { fontName: 'Georgia' },
  ];

  const visibleFonts = () => {
    return windowWidth <= 576 ? fonts.slice(1, 6) : fonts;
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.gridBackground}></div>

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.logoContainer}>
            <img src="/assets/logos/MyType.svg" alt="MyType Logo" className={styles.logoSvg} />
          </div>

          <FontCardsContainer fonts={visibleFonts()} />

          <div className={styles.heroContent}>
            <h1>Unlock your brand<br />with type.</h1>
            <button className={styles.ctaButton}>Get Started</button>
          </div>
        </div>
      </main>

      <div className={styles.sideContent}>
        <h2>By designers, for designers</h2>
        <h3>We've designed this tool perfectly to streamline your workflow.</h3>
      </div>

      <div className={styles.sideContent}>
        <h2>Anywhere, any type</h2>
        <h3>Stay updated on our latest products!</h3>
      </div>

      <div className={styles.sideContent}>
        <h2>Find your type</h2>
        <h3>Get the extension now, it's free!</h3>
      </div>
    </div>
  );
}

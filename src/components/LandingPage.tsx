'use client';

import { useEffect, useState } from 'react';
import FontCard from './FontCard';
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
    { fontName: 'Futura' },
    { fontName: 'Avant Garde' },
    { fontName: 'Garamond' },
    { fontName: 'Inter' },
    { fontName: 'Times New Roman' },
  ];

  const visibleFonts = () => {
    return windowWidth <= 576 ? fonts.slice(1, 6) : fonts;
  };

  const createGridCells = () => {
    const cells = [];
    const cols = Math.ceil(windowWidth / 150) + 1;
    const rows = Math.ceil((typeof window !== 'undefined' ? window.innerHeight : 1000) / 150) * 5;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells.push(
          <div
            key={`cell-${i}-${j}`}
            className={styles.gridCell}
            style={{
              top: `${i * 150}px`,
              left: `${j * 150}px`,
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.landingPage}>
      {/* Background grid */}
      <div className={styles.gridContainer}>
        {createGridCells()}
      </div>

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.logoContainer}>
            <img src="/assets/logos/MyType.svg" alt="MyType Logo" className={styles.logoSvg} />
          </div>

          {/* Cards Container */}
          <div className={styles.fontCardsContainer}>
            {visibleFonts().map((font, index) => (
              <FontCard
                key={index}
                fontName={font.fontName}
          
              />
            ))}
          </div>

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

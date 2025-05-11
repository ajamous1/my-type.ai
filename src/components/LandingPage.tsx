'use client';

import { useEffect, useState } from 'react';
import FontCard from './FontCard';
import styles from '@/styles/LandingPage.module.css';

interface Font {
  fontName: string;
  image?: string;
}

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fonts: Font[] = [
    { fontName: 'Helvetica' },
    { fontName: 'Futura' },
    { fontName: 'Avant Garde' },
    { fontName: 'Garamond' },
    { fontName: 'Inter' },
    { fontName: 'Times New Roman' },
  ];

  const createGridCells = () => {
    const cells = [];
    const cols = Math.ceil(windowWidth / 150) + 4;
    const rows = Math.ceil((typeof window !== 'undefined' ? window.innerHeight : 1000) / 150) + 3;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cells.push(
          <div
            key={`cell-${i}-${j}`}
            className={styles.gridCell}
            style={{ top: `${i * 150}px`, left: `${j * 150}px` }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.gridContainer}>{createGridCells()}</div>

      <main className={styles.mainContent}>
        <div className={styles.heroContent}>
          <h1>
            Unlock your brand
            <br />
            with type.
          </h1>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
      </main>
      
      <div className={styles.scrollWrapper}>
        <div className={styles.fontCardsContainer}>
          {fonts.map((font, index) => (
            <FontCard key={index} fontName={font.fontName} image={font.image} />
          ))}
        </div>
      </div>
      
      <main className={styles.mainContent}>

        <div className={styles.sideContentContainer}>
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
      </main>
    </div>
  );
}
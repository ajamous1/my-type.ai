'use client';

import { useEffect, useState } from 'react';
import FontCard from './assets/FontCard';
import BentoGrid from './assets/grid/BentoGrid';
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

  // These are the Adobe integrations with their ID values
  const integrations = [
    { id: 'acrobat', name: 'Adobe Acrobat' },
    { id: 'aftereffects', name: 'Adobe After Effects' },
    { id: 'illustrator', name: 'Adobe Illustrator' },
    { id: 'photoshop', name: 'Adobe Photoshop' },
    { id: 'premierepro', name: 'Adobe Premiere Pro' },
    { id: 'figma', name: 'Figma' },
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
            <h2>By designers, for designers.</h2>
            <h3>Find the font you're looking in the click of a button.</h3>
            <BentoGrid />
          </div>

          {/* Integration section with side-by-side layout */}
          <div className={styles.sideContent}>
            <div className={styles.integrationsSection}>
              <div className={styles.integrationsText}>
                <h2>Coming soon...</h2>
                <h3>
                  Integrate with your favorite design tools and streamline your workflow.
                </h3>
              </div>
              
              <div className={styles.integrationsContainer}>
                <div className={styles.integrationsGrid}>
                  {/* First row of Adobe logos */}
                  <div className={styles.integrationsRow}>
                    {integrations.slice(0, 3).map((integration) => (
                      <div 
                        className={styles.integrationItem} 
                        key={integration.id}
                        data-app={integration.id}
                      >
                        <img
                          src={`/assets/logos/${integration.id}.svg`}
                          alt={integration.name}
                          className={styles.integrationLogo}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Second row of Adobe logos */}
                  <div className={styles.integrationsRow}>
                    {integrations.slice(3).map((integration) => (
                      <div 
                        className={styles.integrationItem} 
                        key={integration.id}
                        data-app={integration.id}
                      >
                        <img
                          src={`/assets/logos/${integration.id}.svg`}
                          alt={integration.name}
                          className={styles.integrationLogo}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sideContent}>
            <h2>Find your type.</h2>
           
          </div>
        </div>
      </main>
    </div>
  );
}
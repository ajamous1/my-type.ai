'use client';

import { useEffect, useState, useRef } from 'react';
import FontCard from './FontCard';
import styles from '@/styles/LandingPage.module.css';

// Define the Font type
interface Font {
  fontName: string;
  image?: string;
}

export default function LandingPage() {
  // Scrolling functionality
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeftPosition, setScrollLeftPosition] = useState<number>(0);
  
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center the cards on initial load with a slight delay to ensure DOM is ready
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const timer = setTimeout(() => {
      const containerWidth = container.offsetWidth;
      const cardWidth = 320; // 20rem in pixels (assuming 1rem = 16px)
      
      // Calculate the container's center position
      const containerCenter = containerWidth / 2;
      
      // Set initial scroll position to center the second card (Futura)
      // For the second card, we need one full card width + some spacing
      const scrollPosition = (cardWidth * 1.5) - containerCenter + (cardWidth / 2);
      
      container.scrollLeft = scrollPosition;
    }, 100);
    
    return () => clearTimeout(timer);
  }, [windowWidth]); // Re-run when window width changes

  const fonts: Font[] = [
    { fontName: 'Helvetica' }, 
    { fontName: 'Futura' },
    { fontName: 'Avant Garde' },
    { fontName: 'Garamond' },
    { fontName: 'Inter' },
    { fontName: 'Times New Roman' },
  ];

  const visibleFonts = () => {
    return windowWidth <= 576 ? fonts.slice(0, 5) : fonts;
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

  // Manual scroll functions
  const scrollLeftHandler = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };
  
  const scrollRightHandler = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };
  
  // Mouse drag handlers for better scrolling UX
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftPosition(container.scrollLeft);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Speed multiplier
    container.scrollLeft = scrollLeftPosition - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
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

          {/* Enhanced Cards Container with scroll functionality */}
          <div 
            ref={scrollContainerRef}
            className={styles.fontCardsContainer}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {visibleFonts().map((font, index) => (
              <FontCard
                key={index}
                fontName={font.fontName}
                image={font.image}
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
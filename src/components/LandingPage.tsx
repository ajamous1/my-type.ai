'use client';

import { useEffect, useState, useRef } from 'react';
import FontCard from './FontCard';
import styles from '@/styles/LandingPage.module.css';

interface Font {
  fontName: string;
  image?: string;
}

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPosition, setScrollLeftPosition] = useState(0);

  const [windowWidth, setWindowWidth] = useState<number>(0);


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Initial setup
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

  const visibleFonts = () => fonts;


  const createGridCells = () => {
    const cells = [];
    // Add extra columns and rows to ensure the grid covers viewport
    const cols = Math.ceil(windowWidth / 150) + 3;
    const rows = Math.ceil((typeof window !== 'undefined' ? window.innerHeight : 1000) / 150) + 3;

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

  // Track velocity for kinetic scrolling
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  
  // Enhanced mouse handlers with inertia
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Stop any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftPosition(container.scrollLeft);
    setLastX(e.pageX);
    setLastTimestamp(Date.now());
    
    // Apply a grabbing cursor
    container.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Increased multiplier for smoother feel
    container.scrollLeft = scrollLeftPosition - walk;
    
    // Calculate velocity for inertia effect
    const now = Date.now();
    const elapsed = now - lastTimestamp;
    if (elapsed > 0) {
      const delta = e.pageX - lastX;
      setScrollVelocity(delta / elapsed * 15); // Increased multiplier for more momentum
      setLastX(e.pageX);
      setLastTimestamp(now);
    }
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(false);
    container.style.cursor = 'grab';
    document.body.style.userSelect = '';
    
    // Apply inertia effect
    if (Math.abs(scrollVelocity) > 0.5) {
      applyInertia();
    }
  };

  const handleMouseLeave = handleMouseUp;

  // Enhanced touch handlers with inertia
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Stop any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeftPosition(container.scrollLeft);
    setLastX(e.touches[0].pageX);
    setLastTimestamp(Date.now());
    document.body.style.overscrollBehavior = 'none'; // Prevent browser pull-to-refresh
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!isDragging || !container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Increased multiplier for smoother feel
    container.scrollLeft = scrollLeftPosition - walk;
    
    // Calculate velocity for inertia effect
    const now = Date.now();
    const elapsed = now - lastTimestamp;
    if (elapsed > 0) {
      const delta = e.touches[0].pageX - lastX;
      setScrollVelocity(delta / elapsed * 15); // Increased multiplier for more momentum
      setLastX(e.touches[0].pageX);
      setLastTimestamp(now);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.body.style.overscrollBehavior = '';
    
    // Apply inertia effect
    if (Math.abs(scrollVelocity) > 0.5) {
      applyInertia();
    }
  };
  
  // Apply inertia scrolling animation
  const applyInertia = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let velocity = scrollVelocity;
    const friction = 0.95; // Higher value = less friction
    
    const animateScroll = () => {
      if (Math.abs(velocity) < 0.2) {
        // Stop animation when slow enough
        cancelAnimationFrame(animationRef.current!);
        animationRef.current = undefined;
        return;
      }
      
      container.scrollLeft -= velocity;
      velocity *= friction;
      animationRef.current = requestAnimationFrame(animateScroll);
    };
    
    animationRef.current = requestAnimationFrame(animateScroll);
  };
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.landingPage}>
      <div className={styles.gridContainer}>
        {createGridCells()}
      </div>

      <div className={styles.pageWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.heroContent}>
            <h1>Unlock your brand<br />with type.</h1>
            <button className={styles.ctaButton}>Get Started</button>
          </div>

          <div className={styles.heroSection}>
            <div 
              ref={scrollContainerRef}
              className={styles.fontCardsContainer}
            >
              {visibleFonts().map((font, index) => (
                <FontCard
                  key={index}
                  fontName={font.fontName}
                  image={font.image}
                />
              ))}
            </div>
          </div>
        </main>

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
      </div>
    </div>
  );
}
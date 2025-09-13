'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/FontCard.module.css';
import landingStyles from '@/styles/LandingPage.module.css';
import { useTheme } from '@/contexts/ThemeContext';

export interface FontCardProps {
  fontName: string;
  index?: number;
}

const FontCard = ({ fontName, index = 0 }: FontCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [animated, setAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Animation effect on first render
  useEffect(() => {
    const delay = 300 + (index * 100); // Staggered delay based on card index
    
    // Set a timer to start the animation after the delay
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [index]);

  const getFontDescription = (name: string): string => {
    switch (name) {
      case 'Helvetica': return 'A classic Swiss sans-serif known for its clarity and neutrality.';
      case 'Futura': return 'A geometric sans-serif typeface designed in the 1920s.';
      case 'Avant Garde': return 'Inspired by the logo of the Avant Garde magazine.';
      case 'Garamond': return 'An old-style serif font used in books and publishing.';
      case 'Inter': return 'A modern sans-serif designed for digital interfaces.';
      case 'Times New Roman': return 'A traditional serif font used in newspapers and academia.';
      default: return 'A beautiful typeface with distinctive characteristics.';
    }
  };

  const getSvgPath = (name: string): string => {
    const normalized = name.replace(/\s+/g, '').toLowerCase();
    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const suffix = isDark ? '-dark' : '';
    return `/assets/cards/mytypecard${normalized}${suffix}.svg`;
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles.fontCardWrapper} ${landingStyles.dealCardAnimation} ${animated ? landingStyles.animate : ''}`} 
      onClick={() => setFlipped(prev => !prev)}
    >
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
        <div className={styles.cardFront}>
          <img src={getSvgPath(fontName)} alt={fontName} className={styles.fontImage} />
        </div>
        <div className={styles.cardBack}>
          <h3>{fontName}</h3>
          <p>{getFontDescription(fontName)}</p>
        </div>
      </div>
    </div>
  );
};

export default FontCard;
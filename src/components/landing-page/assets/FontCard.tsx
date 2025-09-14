'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/FontCard.module.css';
import landingStyles from '@/styles/LandingPage.module.css';
import { useDarkMode } from '@/hooks/useDarkMode';
import FontCardBack from '../../FontCardBack';
import { FontMeta, getFontByName } from '../../../data/fonts';

export interface FontCardProps {
  fontName: string;
  index?: number;
}

const FontCard = ({ fontName, index = 0 }: FontCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [animated, setAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = useDarkMode();

  // Animation effect on first render
  useEffect(() => {
    const delay = 120 + (index * 40); // Staggered delay based on card index (150% faster)
    
    // Set a timer to start the animation after the delay
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [index]);

  // Use the shared font data
  const getFontMeta = (name: string): FontMeta => {
    return getFontByName(name);
  };

  const getSvgPath = (name: string): string => {
    const normalized = name.replace(/\s+/g, '').toLowerCase();
    const suffix = isDark ? '-dark' : '';
    return `/assets/cards/mytypecard${normalized}${suffix}.svg`;
  };

  const handleCardClick = () => {
    setFlipped(prev => !prev);
  };

  return (
    <div 
      ref={cardRef}
      className={`${styles.fontCardWrapper} ${landingStyles.dealCardAnimation} ${animated ? landingStyles.animate : ''}`} 
      onClick={handleCardClick}
    >
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
        <div className={styles.cardFront}>
          <img src={getSvgPath(fontName)} alt={fontName} className={styles.fontImage} />
        </div>
        <div className={styles.cardBack}>
          <FontCardBack 
            font={getFontMeta(fontName)}
            showGrid={false}
            className={styles.fontCardBackContent}
          />
        </div>
      </div>
    </div>
  );
};

export default FontCard;
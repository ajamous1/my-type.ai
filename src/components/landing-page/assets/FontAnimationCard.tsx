'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/FontAnimationCard.module.css';

interface Font {
  fontName: string;
}

interface FontAnimationCardProps {
  size?: 'default' | 'small' | 'large' | 'full';
  title: string;
  description: string;
}

const fonts: Font[] = [
  { fontName: 'Helvetica' },
  { fontName: 'Futura' },
  { fontName: 'Avant Garde' },
  { fontName: 'Garamond' },
  { fontName: 'Inter' },
  { fontName: 'Times New Roman' },
];

const FontAnimationCard: React.FC<FontAnimationCardProps> = ({ 
  size = 'default',
  title,
  description
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for the radial highlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!animationContainerRef.current) return;
    
    const rect = animationContainerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Create duplicated font array for seamless looping
  const repeatedFonts = [...fonts, ...fonts, ...fonts, ...fonts];
  
  return (
    <div 
      className={`${styles.fontCard} ${styles[size]}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.cardHeader}>
        <div className={styles.thumbnail}>
          <span className={styles.thumbnailText}>T</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.description}>{description}</p>
      
      <div 
        ref={animationContainerRef}
        className={`${styles.fontAnimationContainer} ${isHovering ? styles.slowAnimation : ''}`}
      >
        <div 
          className={styles.fontList} 
          style={{
            animationPlayState: isHovering ? 'paused' : 'running'
          }}
        >
          {repeatedFonts.map((font, index) => (
            <div 
              key={`${font.fontName}-${index}`} 
              className={styles.fontItem}
              style={{ 
                fontFamily: font.fontName,
              }}
            >
              {font.fontName}
            </div>
          ))}
        </div>
        
        {/* Top blur overlay */}
        <div className={`${styles.blurOverlay} ${styles.topBlur}`}></div>
        
        {/* Bottom blur overlay */}
        <div className={`${styles.blurOverlay} ${styles.bottomBlur}`}></div>
        
        {/* Hover highlight effect */}
        {isHovering && (
          <div 
            className={styles.hoverHighlight}
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default FontAnimationCard;
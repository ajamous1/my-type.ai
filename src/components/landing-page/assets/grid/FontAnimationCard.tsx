'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/BentoGrid.module.css';
import Image from 'next/image';

const fonts = [
  'Helvetica', 'Futura', 'Avant Garde',
  'Garamond', 'Inter', 'Times New Roman',
];

interface FontAnimationCardProps {
  title?: string;
  description?: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function FontAnimationCard({
  title = 'Typographic Depth',
  description = 'Explore the visual hierarchy and impact of different typefaces',
  size = 'large',
}: FontAnimationCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 425);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      container.querySelectorAll<HTMLElement>(`.${styles.fallingText}`).forEach((el) => {
        const elRect = el.getBoundingClientRect();
        const elCenterX = elRect.left + elRect.width / 2 - rect.left;
        const elCenterY = elRect.top + elRect.height / 2 - rect.top;

        const distance = Math.hypot(elCenterX - mouseX, elCenterY - mouseY);
        const intensity = Math.max(0, 1 - distance / 300);
        el.style.setProperty('--text-intensity', intensity.toString());
        el.style.setProperty('--el-mouse-x', `${mouseX - (elRect.left - rect.left)}px`);
        el.style.setProperty('--el-mouse-y', `${mouseY - (elRect.top - rect.top)}px`);
      });
    };

    const handleLeave = () => {
      setIsCardHovered(false);
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const generateFontItems = (offset = 0) =>
    Array.from({ length: 12 }).map((_, i) => (
      <span
        key={offset + i}
        className={styles.fallingText}
        style={{
          fontFamily: fonts[(offset + i) % fonts.length],
          '--text-intensity': '0',
        } as React.CSSProperties}
      >
        Aa
      </span>
    ));

  return (
    <div
      className={`${styles.bentoCard} ${styles[size]}`}
      onMouseEnter={() => {
        setIsCardHovered(true);
        setHasInteracted(true);
      }}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div className={styles.cardContentRow}>
        <div className={`${styles.leftColumn} ${isMobile ? styles.fullWidth : ''}`}>
          <div className={styles.cardHeader}>
            <div className={styles.thumbnail}>
              <Image 
                src="/assets/icons/depth.svg" 
                alt="Typography Depth Icon" 
                width={60} 
                height={60} 
              />
            </div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <p>{description}</p>
        </div>

        {!isMobile && (
          <div
            ref={containerRef}
            className={`${styles.fallingTextContainer} ${isCardHovered ? styles.hovering : ''} ${hasInteracted ? styles.animated : ''}`}
          >
            <div className={styles.topBlur}></div>
            <div className={styles.bottomBlur}></div>

            <div className={`${styles.column} ${styles.col0}`}>
              {generateFontItems(0)}
              {generateFontItems(12)}
              {generateFontItems(24)}
            </div>
            <div className={`${styles.column} ${styles.col1}`}>
              {generateFontItems(6)}
              {generateFontItems(18)}
              {generateFontItems(30)}
            </div>
            <div className={`${styles.column} ${styles.col2}`}>
              {generateFontItems(3)}
              {generateFontItems(15)}
              {generateFontItems(27)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
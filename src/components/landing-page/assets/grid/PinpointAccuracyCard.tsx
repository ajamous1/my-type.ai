'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import Image from 'next/image';
import styles from '@/styles/BentoGrid.module.css';

const fonts = ['Helvetica', 'Futura', 'Avant Garde', 'Garamond', 'Inter', 'Times New Roman'];

interface PinpointAccuracyCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function PinpointAccuracyCard({ title, description, size = 'large' }: PinpointAccuracyCardProps) {
  const isDark = useDarkMode();
  const iconSrc = isDark ? '/assets/icons/target-dark.svg' : '/assets/icons/target.svg';
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });
  const [isHovered, setIsHovered] = useState(false);
  const [isUserControlled, setIsUserControlled] = useState(false);
  const animationRef = useRef<number | null>(null);
  const scanningRef = useRef({
    angle: 0,
    centerX: 120,
    centerY: 120,
    radiusX: 80,
    radiusY: 60
  });

  // Reset selected index after some time
  useEffect(() => {
    if (selectedIndex !== null) {
      const timer = setTimeout(() => {
        setSelectedIndex(null);
      }, 467); // 100% faster than 933ms (2x speed)
      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  // Update mask position
  const updateMaskPosition = useCallback((x: number, y: number) => {
    // Apply mask on the right column using coordinates translated from container space
    const containerEl = containerRef.current;
    const rightCol = containerEl?.parentElement as HTMLElement | null;
    if (containerEl && rightCol) {
      const containerRect = containerEl.getBoundingClientRect();
      const rightColRect = rightCol.getBoundingClientRect();
      const offsetX = containerRect.left - rightColRect.left;
      const offsetY = containerRect.top - rightColRect.top;

      rightCol.style.setProperty('--mask-x', `${offsetX + x}px`);
      rightCol.style.setProperty('--mask-y', `${offsetY + y}px`);
    }
  }, []);

  // Update crosshair position (align with mask center)
  const updateCrosshairPosition = useCallback((x: number, y: number) => {
    if (crosshairRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = containerRef.current.closest(`.${styles.cardContentRow}`)?.getBoundingClientRect();
      
      if (cardRect) {
        // Position crosshair relative to the card content row to match mask position
        const offsetX = containerRect.left - cardRect.left;
        const offsetY = containerRect.top - cardRect.top;
        
        crosshairRef.current.style.left = `${offsetX + x}px`;
        crosshairRef.current.style.top = `${offsetY + y}px`;
      }
    }
  }, []);

  // Scanning animation (zigzag pattern)
  const scanAnimation = useCallback(() => {
    if (!isHovered || isUserControlled) return;

    const scan = scanningRef.current;
    scan.angle += 0.02; // Slower, smoother animation
    
    // Create a figure-8 or zigzag pattern
    const x = scan.centerX + Math.sin(scan.angle) * scan.radiusX;
    const y = scan.centerY + Math.sin(scan.angle * 2) * scan.radiusY;
    
    setMousePos({ x, y });
    updateMaskPosition(x, y);
    updateCrosshairPosition(x, y);
    
    animationRef.current = requestAnimationFrame(scanAnimation);
  }, [isHovered, isUserControlled, updateMaskPosition, updateCrosshairPosition]);

  // Start/stop scanning animation
  useEffect(() => {
    if (isHovered && !isUserControlled) {
      scanAnimation();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isHovered, isUserControlled, scanAnimation]);

  // Initialize position
  useEffect(() => {
    const defaultPos = { x: 120, y: 120 };
    setMousePos(defaultPos);
    updateMaskPosition(defaultPos.x, defaultPos.y);
    updateCrosshairPosition(defaultPos.x, defaultPos.y);
  }, [updateMaskPosition, updateCrosshairPosition]);

  const handleCardMouseEnter = () => {
    setIsHovered(true);
    setIsUserControlled(false);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setIsUserControlled(false);
    
    // Smooth return to center
    const startPos = { ...mousePos };
    const endPos = { x: 120, y: 120 };
    const duration = 500;
    const startTime = performance.now();
    
    const animateReturn = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const x = startPos.x + (endPos.x - startPos.x) * easeOut;
      const y = startPos.y + (endPos.y - startPos.y) * easeOut;
      
      setMousePos({ x, y });
      updateMaskPosition(x, y);
      updateCrosshairPosition(x, y);
      
      if (progress < 1) {
        requestAnimationFrame(animateReturn);
      }
    };
    
    requestAnimationFrame(animateReturn);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    
    setIsUserControlled(true);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));
    
    setMousePos({ x, y });
    updateMaskPosition(x, y);
    updateCrosshairPosition(x, y);
  };

  const handleMouseStop = () => {
    // After a brief delay, switch back to scanning if still hovered
    setTimeout(() => {
      if (isHovered) {
        setIsUserControlled(false);
      }
    }, 1000);
  };

  return (
    <div 
      className={`${styles.bentoCard} ${styles[size]}`}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      <div className={styles.cardContentRow} style={{ position: 'relative' }}>
        <div className={styles.leftColumn}>
          <div className={styles.cardHeader}>
            <div className={styles.thumbnail}>
              <Image 
                src={iconSrc} 
                alt="Target Icon" 
                width={28} 
                height={28} 
              />
            </div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.pinpointRightColumn}>
          <div 
            ref={containerRef}
            className={styles.pinpointContainer}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseStop}
          >
            <div className={styles.fontGridStatic}>
            {Array.from({ length: 18 }).map((_, i) => {
                const isSelected = selectedIndex === i;
                const fontName = fonts[i % fonts.length];
                const displayName = fontName === 'Times New Roman' ? 'Times' : fontName;

                return (
                  <div key={i} className={styles.fontItemWrapper}>
                    <span
                      className={`${styles.fallingText} ${isSelected ? styles.selectedFont : ''}`}
                      style={{ fontFamily: fontName }}
                      onClick={() => setSelectedIndex(i)}
                    >
                      Aa
                      {isSelected && (
                        <div className={`${styles.fontLabel} ${styles.fadeOut}`}>{displayName}</div>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Crosshair positioned absolutely within the card */}
        <div
          ref={crosshairRef}
          className={styles.crosshair}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 10,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
}
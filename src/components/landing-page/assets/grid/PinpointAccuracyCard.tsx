'use client';

import { useRef, useState, useEffect } from 'react';
import styles from '@/styles/BentoGrid.module.css';

const fonts = ['Helvetica', 'Futura', 'Avant Garde', 'Garamond', 'Inter', 'Times New Roman'];

interface PinpointAccuracyCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function PinpointAccuracyCard({ title, description, size = 'large' }: PinpointAccuracyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });
  const [mode, setMode] = useState<'idle' | 'auto' | 'user'>('idle');
  const defaultPos = { x: 120, y: 120 };

  useEffect(() => {
    let frame: number;
    let rowIndex = 0;
    let sweepProgress = 0;
    let sweepDirection = 1;
    let isPaused = false;
    let pauseStartTime = 0;
    const PAUSE_DURATION = 300;
    const NUM_ROWS = 8;

    const animate = (t: number) => {
      if (mode !== 'auto') return;

      const container = containerRef.current;
      if (!container) return;

      const bounds = container.getBoundingClientRect();
      const MARGIN = 40;
      const minX = MARGIN;
      const minY = MARGIN;
      const maxX = bounds.width - MARGIN;
      const maxY = bounds.height - MARGIN;
      const moveSpeed = 0.004;

      if (isPaused) {
        if (t - pauseStartTime >= PAUSE_DURATION) {
          isPaused = false;
          rowIndex += sweepDirection;
          if (rowIndex >= NUM_ROWS - 1) {
            rowIndex = NUM_ROWS - 1;
            sweepDirection = -1;
          } else if (rowIndex <= 0) {
            rowIndex = 0;
            sweepDirection = 1;
          }
        }
      } else {
        sweepProgress += moveSpeed;
        if (sweepProgress >= 1) {
          sweepProgress = 0;
          isPaused = true;
          pauseStartTime = t;
        }
      }

      const rowHeight = (maxY - minY) / (NUM_ROWS - 1);
      const y = minY + rowIndex * rowHeight;
      const x = rowIndex % 2 === 0
        ? minX + sweepProgress * (maxX - minX)
        : maxX - sweepProgress * (maxX - minX);

      const easedX = mousePos.x + (x - mousePos.x) * 0.08;
      const easedY = mousePos.y + (y - mousePos.y) * 0.08;

      setMousePos({ x: easedX, y: easedY });
      
      // Set the mask position
      container.style.setProperty('--mask-x', `${easedX}px`);
      container.style.setProperty('--mask-y', `${easedY}px`);
      
      // Set the crosshair position to match the mask position
      if (crosshairRef.current) {
        crosshairRef.current.style.left = `${easedX}px`;
        crosshairRef.current.style.top = `${easedY}px`;
      }

      frame = requestAnimationFrame(animate);
    };

    if (mode === 'auto') {
      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [mode, mousePos]);

  const handleFontGridEnter = () => {
    setMode('user');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'user') return;

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const MARGIN = 40;
    const x = Math.min(bounds.width - MARGIN, Math.max(MARGIN, e.clientX - bounds.left));
    const y = Math.min(bounds.height - MARGIN, Math.max(MARGIN, e.clientY - bounds.top));

    const easedX = mousePos.x + (x - mousePos.x) * 0.2;
    const easedY = mousePos.y + (y - mousePos.y) * 0.2;

    setMousePos({ x: easedX, y: easedY });
    
    // Set the mask position
    container.style.setProperty('--mask-x', `${easedX}px`);
    container.style.setProperty('--mask-y', `${easedY}px`);
    
    // Set the crosshair position to match the mask position
    if (crosshairRef.current) {
      crosshairRef.current.style.left = `${easedX}px`;
      crosshairRef.current.style.top = `${easedY}px`;
    }
  };

  const handleMouseLeave = () => {
    const x0 = mousePos.x;
    const y0 = mousePos.y;
    const x1 = defaultPos.x;
    const y1 = defaultPos.y;
    const duration = 500;
    const start = performance.now();

    setMode('idle');

    const animateBack = (t: number) => {
      const container = containerRef.current;
      if (!container) return;

      const progress = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 2);
      const x = x0 + (x1 - x0) * ease;
      const y = y0 + (y1 - y0) * ease;

      setMousePos({ x, y });
      
      // Set the mask position
      container.style.setProperty('--mask-x', `${x}px`);
      container.style.setProperty('--mask-y', `${y}px`);
      
      // Set the crosshair position to match the mask position
      if (crosshairRef.current) {
        crosshairRef.current.style.left = `${x}px`;
        crosshairRef.current.style.top = `${y}px`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateBack);
      } else {
        setTimeout(() => {
          if (mode === 'idle') setMode('auto');
        }, 800);
      }
    };

    requestAnimationFrame(animateBack);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.setProperty('--mask-x', `${defaultPos.x}px`);
      container.style.setProperty('--mask-y', `${defaultPos.y}px`);
      
      // Set initial crosshair position
      if (crosshairRef.current) {
        crosshairRef.current.style.left = `${defaultPos.x}px`;
        crosshairRef.current.style.top = `${defaultPos.y}px`;
      }
      
      setTimeout(() => setMode('auto'), 500);
    }
  }, []);

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`${styles.bentoCard} ${styles[size]}`}
        onMouseEnter={() => setMode('auto')}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className={styles.cardContentRow}>
          <div className={styles.leftColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.thumbnail}></div>
              <h3 className={styles.title}>{title}</h3>
            </div>
            <p>{description}</p>
          </div>

          <div ref={containerRef} className={styles.pinpointContainer} style={{ position: 'relative' }}>
            <div
              className={styles.fontGridStatic}
              onMouseEnter={handleFontGridEnter}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.fallingText}
                  style={{ fontFamily: fonts[i % fonts.length] }}
                >
                  Aa
                </span>
              ))}
            </div>
            
            {/* Crosshair positioned inside the container with the same coordinates as the mask */}
            <div 
              ref={crosshairRef} 
              className={styles.crosshair}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 5,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
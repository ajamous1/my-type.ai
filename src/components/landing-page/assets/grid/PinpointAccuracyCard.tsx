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
  
  // Continuous back-and-forth scanning pattern with delay at boundaries
  useEffect(() => {
    let frame: number;
    let startTime = performance.now();
    let direction = 1; // 1 for forward, -1 for backward
    let currentY = defaultPos.y;
    let isPaused = false;
    let pauseStartTime = 0;
    const PAUSE_DURATION = 700; // 0.7 seconds delay at boundaries
    
    const animate = (t: number) => {
      if (mode !== 'auto') return;
  
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
  
      const MARGIN = 40;
      const minX = MARGIN;
      const minY = MARGIN;
      const maxX = bounds.width - MARGIN;
      const maxY = bounds.height - MARGIN;
      
      const moveSpeed = 10; // pixels per second
      
      // Handle pausing at boundaries
      if (isPaused) {
        if (t - pauseStartTime >= PAUSE_DURATION) {
          isPaused = false;
        }
      } else {
        // Update Y position with continuous movement
        currentY += moveSpeed * 0.016 * direction; // 0.016 is approx one frame at 60fps
        
        // Check for boundary and pause if needed
        if (currentY >= maxY) {
          currentY = maxY;
          direction = -1;
          isPaused = true;
          pauseStartTime = t;
        } else if (currentY <= minY) {
          currentY = minY;
          direction = 1;
          isPaused = true;
          pauseStartTime = t;
        }
      }
      
      const y = currentY;
      
      // X position follows sinusoidal pattern based on Y position
      const progress = (y - minY) / (maxY - minY);
      const rangeX = maxX - minX;
      const x = minX + (rangeX / 2) * (1 + Math.sin(progress * 2 * Math.PI));
  
      // Apply position to reveal mask
      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);
  
      // Position crosshair separately on top
      if (crosshairRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        crosshairRef.current.style.left = `${x + containerRect.left}px`;
        crosshairRef.current.style.top = `${y + containerRect.top}px`;
      }
  
      frame = requestAnimationFrame(animate);
    };
  
    if (mode === 'auto') frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  // Mouse takes over when inside font grid
  const handleFontGridEnter = (e: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x0 = mousePos.x;
    const y0 = mousePos.y;
    const x1 = e.clientX - bounds.left;
    const y1 = e.clientY - bounds.top;

    const duration = 800;
    const start = performance.now();

    const animateToCursor = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const x = x0 + (x1 - x0) * ease;
      const y = y0 + (y1 - y0) * ease;

      // Update reveal mask position
      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);

      // Update crosshair position separately
      if (crosshairRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        crosshairRef.current.style.left = `${x + containerRect.left}px`;
        crosshairRef.current.style.top = `${y + containerRect.top}px`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateToCursor);
      } else {
        setMode('user');
      }
    };

    requestAnimationFrame(animateToCursor);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'user') return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const MARGIN = 80;
    const x = Math.min(bounds.width - MARGIN, Math.max(MARGIN, e.clientX - bounds.left));
    const y = Math.min(bounds.height - MARGIN, Math.max(MARGIN, e.clientY - bounds.top));

    // Update reveal mask position
    setMousePos({ x, y });
    containerRef.current?.style.setProperty('--mask-x', `${x}px`);
    containerRef.current?.style.setProperty('--mask-y', `${y}px`);

    // Update crosshair position separately
    if (crosshairRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      crosshairRef.current.style.left = `${x + containerRect.left}px`;
      crosshairRef.current.style.top = `${y + containerRect.top}px`;
    }
  };

  const handleMouseLeave = () => {
    setMode('idle');

    const x0 = mousePos.x;
    const y0 = mousePos.y;
    const x1 = defaultPos.x;
    const y1 = defaultPos.y;
    const duration = 1000;
    const start = performance.now();

    const animateBack = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 2);

      const x = x0 + (x1 - x0) * ease;
      const y = y0 + (y1 - y0) * ease;

      // Update reveal mask position
      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);

      // Update crosshair position separately
      if (crosshairRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        crosshairRef.current.style.left = `${x + containerRect.left}px`;
        crosshairRef.current.style.top = `${y + containerRect.top}px`;
      }

      if (progress < 1) requestAnimationFrame(animateBack);
    };

    requestAnimationFrame(animateBack);
  };

  // Effect to handle resizing and scrolling
  useEffect(() => {
    const updateCrosshairPosition = () => {
      if (crosshairRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        crosshairRef.current.style.left = `${mousePos.x + containerRect.left}px`;
        crosshairRef.current.style.top = `${mousePos.y + containerRect.top}px`;
      }
    };

    window.addEventListener('resize', updateCrosshairPosition);
    window.addEventListener('scroll', updateCrosshairPosition);

    return () => {
      window.removeEventListener('resize', updateCrosshairPosition);
      window.removeEventListener('scroll', updateCrosshairPosition);
    };
  }, [mousePos]);

  useEffect(() => {
    // Initial position
    if (crosshairRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      crosshairRef.current.style.left = `${defaultPos.x + containerRect.left}px`;
      crosshairRef.current.style.top = `${defaultPos.y + containerRect.top}px`;
    }
  }, []);

  return (
    <>
      <div
        className={`${styles.bentoCard} ${styles.large}`}
        onMouseEnter={() => setMode('auto')}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className={styles.cardContentRow}>
          <div className={styles.leftColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.thumbnail}></div>
              <h3 className={styles.title}>Pinpoint Accuracy</h3>
            </div>
            <p>Precise font matching through advanced algorithms</p>
          </div>

          <div ref={containerRef} className={styles.pinpointContainer}>
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
          </div>
        </div>
      </div>
      {/* Crosshair element separate from the mask reveal effect */}
      <div
        ref={crosshairRef}
        className={styles.crosshair}
      />
    </>
  );
}
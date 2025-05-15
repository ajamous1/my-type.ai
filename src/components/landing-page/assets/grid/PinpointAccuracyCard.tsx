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
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });
  const [mode, setMode] = useState<'idle' | 'auto' | 'user'>('idle');
  const defaultPos = { x: 120, y: 120 };
// Sniper-style lateral diagonal scan
useEffect(() => {
    let frame: number;
    let startTime = performance.now();
  
    const animate = (t: number) => {
      if (mode !== 'auto') return;
  
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
  
      const MARGIN = 80;
      const minX = MARGIN;
      const minY = MARGIN;
      const maxX = bounds.width - MARGIN;
      const maxY = bounds.height - MARGIN;
  
      const elapsed = (t - startTime) / 1000;
  
      const totalHeight = maxY - minY;
      const loopDuration = 6; // seconds
      const progress = (elapsed % loopDuration) / loopDuration;
  
      // Y rises linearly
      const y = minY + progress * totalHeight;
  
      // X sweeps left-to-right then right-to-left smoothly (sinusoidal)
      const rangeX = maxX - minX;
      const x = minX + (rangeX / 2) * (1 + Math.sin(progress * 2 * Math.PI));
  
      // Apply position
      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);
  
      const crosshair = containerRef.current?.querySelector(`.${styles.crosshair}`) as HTMLElement;
      if (crosshair) {
        crosshair.style.left = `${x}px`;
        crosshair.style.top = `${y}px`;
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

      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);

      const crosshair = containerRef.current?.querySelector(`.${styles.crosshair}`) as HTMLElement;
      if (crosshair) {
        crosshair.style.left = `${x}px`;
        crosshair.style.top = `${y}px`;
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

    setMousePos({ x, y });
    containerRef.current?.style.setProperty('--mask-x', `${x}px`);
    containerRef.current?.style.setProperty('--mask-y', `${y}px`);

    const crosshair = containerRef.current?.querySelector(`.${styles.crosshair}`) as HTMLElement;
    if (crosshair) {
      crosshair.style.left = `${x}px`;
      crosshair.style.top = `${y}px`;
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

      setMousePos({ x, y });
      containerRef.current?.style.setProperty('--mask-x', `${x}px`);
      containerRef.current?.style.setProperty('--mask-y', `${y}px`);

      const crosshair = containerRef.current?.querySelector(`.${styles.crosshair}`) as HTMLElement;
      if (crosshair) {
        crosshair.style.left = `${x}px`;
        crosshair.style.top = `${y}px`;
      }

      if (progress < 1) requestAnimationFrame(animateBack);
    };

    requestAnimationFrame(animateBack);
  };

  return (
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
          <div
            className={styles.crosshair}
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
        </div>
      </div>
    </div>
  );
}

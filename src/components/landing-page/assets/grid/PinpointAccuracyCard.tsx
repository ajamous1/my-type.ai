// components/PinpointAccuracyCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/BentoGrid.module.css';

const fonts = [
  'Helvetica', 'Futura', 'Avant Garde',
  'Garamond', 'Inter', 'Times New Roman'
];

interface PinpointAccuracyCardProps {
  title?: string;
  description?: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function PinpointAccuracyCard({
  title = 'Pinpoint Accuracy',
  description = 'Precise font matching through advanced algorithms',
  size = 'large',
}: PinpointAccuracyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const generateFontItems = (offset = 0) =>
    Array.from({ length: 6 }).map((_, i) => (
      <span
        key={offset + i}
        className={styles.fallingText}
        style={{ fontFamily: fonts[(offset + i) % fonts.length] }}
      >
        Aa
      </span>
    ));

  return (
    <div className={`${styles.bentoCard} ${styles[size]}`}>      
      <div className={styles.cardContentRow}>
        <div className={styles.leftColumn}>
          <div className={styles.cardHeader}>
            <div className={styles.thumbnail}></div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <p>{description}</p>
        </div>

        <div
          ref={containerRef}
          className={styles.pinpointContainer}
          style={{
            '--mask-x': `${mousePos.x}px`,
            '--mask-y': `${mousePos.y}px`,
          } as React.CSSProperties}
        >
          <div className={styles.fontGridStatic}>          
            {generateFontItems(0)}
            {generateFontItems(6)}
            {generateFontItems(12)}
          </div>

          <div
            className={styles.crosshair}
            style={{ left: mousePos.x, top: mousePos.y }}
          />
        </div>
      </div>
    </div>
  );
}

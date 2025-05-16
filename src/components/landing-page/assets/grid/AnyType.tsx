'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/BentoGrid.module.css';

interface AnywhereAnyTypeCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function AnywhereAnyTypeCard({ title, description, size = 'full' }: AnywhereAnyTypeCardProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const columns = 8;
    const rows = 4;
    const total = columns * rows;
    const elements: HTMLSpanElement[] = [];

    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.textContent = 'a';
      span.className = styles.scalingA;
      grid.appendChild(span);
      elements.push(span);
    }

    elements.forEach((el, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;
      el.style.animationDelay = `${(row + col) * 0.08}s`;
    });
  }, []);

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
        <div ref={gridRef} className={styles.airbnbLetterGrid}></div>
      </div>
    </div>
  );
}

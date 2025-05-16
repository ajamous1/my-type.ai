'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/BentoGrid.module.css';

interface AnywhereAnyTypeCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function AnywhereAnyTypeCard({
  title,
  description,
  size = 'full',
}: AnywhereAnyTypeCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const hoverTimes = useRef<number[]>(Array(15).fill(0));
  const animationRef = useRef<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const leave = () => setMousePos({ x: -9999, y: -9999 });

    const el = containerRef.current;
    el?.addEventListener('mousemove', updateMouse);
    el?.addEventListener('mouseleave', leave);

    return () => {
      el?.removeEventListener('mousemove', updateMouse);
      el?.removeEventListener('mouseleave', leave);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      letterRefs.current.forEach((ref, i) => {
        if (!ref || !containerRef.current) return;

        const letterBox = ref.getBoundingClientRect();
        const containerBox = containerRef.current.getBoundingClientRect();
        const centerX = letterBox.left + letterBox.width / 2 - containerBox.left;
        const centerY = letterBox.top + letterBox.height / 2 - containerBox.top;
        const dx = mousePos.x - centerX;
        const dy = mousePos.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const threshold = 160;
        const isClose = dist < threshold;

        hoverTimes.current[i] = isClose
          ? Math.min(hoverTimes.current[i] + 1, 60)
          : Math.max(hoverTimes.current[i] - 2, 0);

        const progress = hoverTimes.current[i] / 60;
        const scale = 0.5 + progress * 1.2;
        const weight = 400 + progress * 500;

        ref.style.transform = `scale(${scale})`;
        ref.style.fontVariationSettings = `"wght" ${weight}`;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <div className={`${styles.bentoCard} ${styles[size]}`} ref={containerRef}>
      <div className={styles.cardHeader}>
        <div className={styles.thumbnail}></div>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.cardContentRow}>
        <div className={styles.leftColumn}>
          <p>{description}</p>
        </div>

        <div className={styles.airbnbLetterGrid}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className={styles.cellWrapper}>
              <span
                ref={el => {
                  if (el) letterRefs.current[i] = el;
                }}
                className={styles.scalingA}
              >
                a
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  const hoverTimes = useRef<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [gridCount, setGridCount] = useState(15); // default to desktop layout
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Set grid count based on screen size
    const updateGridCount = () => {
      const width = window.innerWidth;
      const isTabletSize = width <= 1023;
      setIsTablet(isTabletSize);
      if (isTabletSize) {
        setGridCount(9); // 3x3 on tablets
        hoverTimes.current = Array(9).fill(0);
      } else {
        setGridCount(15); // 5x3 on desktop
        hoverTimes.current = Array(15).fill(0);
      }
    };

    updateGridCount();
    window.addEventListener('resize', updateGridCount);
    return () => window.removeEventListener('resize', updateGridCount);
  }, []);

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
          ? Math.min(hoverTimes.current[i] + 0.3, 60)
          : Math.max(hoverTimes.current[i] - 0.3, 0);

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
  }, [mousePos, gridCount]);

  return (
    <div className={`${styles.bentoCard} ${styles[size]}`} ref={containerRef}>
      <div className={styles.cardHeader}>
        <div className={styles.thumbnail}>
            <Image
                src="/assets/icons/globe.svg"
                alt="Globe Icon"
                width={28}
                height={28}
                className={styles.thumbnailImage}
            />
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.cardContentRow}>
        <div className={styles.leftColumn}>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.gridAligner}>
            <div className={`${styles.airbnbLetterGrid} ${isTablet ? styles.tabletGrid : ''}`}>
              {Array.from({ length: gridCount }).map((_, i) => {
                // Skip rendering elements beyond the current grid size
                if ((isTablet && i >= 9) || (!isTablet && i >= 15)) {
                  return null;
                }
                
                return (
                  <div key={i} className={styles.cellWrapper}>
                    <span
                      ref={(el) => {
                        if (el) letterRefs.current[i] = el;
                      }}
                      className={styles.scalingA}
                    >
                      a
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

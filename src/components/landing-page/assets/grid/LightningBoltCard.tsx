'use client';

import styles from '@/styles/BentoGrid.module.css';
import { useDarkMode } from '@/hooks/useDarkMode';
import Image from 'next/image';

interface LightningBoltCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function LightningBoltCard({ title, description, size = 'default' }: LightningBoltCardProps) {
  const isDark = useDarkMode();
  const iconSrc = isDark ? '/assets/icons/lightningbolt-dark.svg' : '/assets/icons/lightningbolt.svg';

  return (
    <div className={`${styles.bentoCard} ${styles[size]}`}>
      <div className={styles.clippedCard}>
        <div className={styles.strokeZapWrapper}>
          <svg
            viewBox="0 0 64 64"
            className={styles.strokeZapSVG}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="zap-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC143C" />
                <stop offset="100%" stopColor="#DC143C" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gray static outline */}
            <path
              d="M32 2 L12 36 H30 L18 62 L52 26 H34 L44 2 Z"
              stroke="#999"
              strokeWidth="3"
              fill="none"
              className={styles.grayBolt}
            />

            {/* Red animated zap */}
            <path
              d="M32 2 L12 36 H30 L18 62 L52 26 H34 L44 2 Z"
              stroke="url(#zap-gradient)"
              strokeWidth="3"
              fill="none"
              className={styles.redZap}
            />
          </svg>
        </div>

        <div className={styles.cardContentRow} style={{ position: 'relative' }}>
          <div className={styles.leftColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.thumbnail}>
                <Image 
                  src={iconSrc} 
                  alt="Lightning Bolt Icon" 
                  width={28} 
                  height={28} 
                />
              </div>
              <h3 className={styles.title}>{title}</h3>
            </div>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
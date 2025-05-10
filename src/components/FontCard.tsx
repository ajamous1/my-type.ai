'use client';

import { useState } from 'react';
import styles from '@/styles/FontCard.module.css';

type FontProps = {
  fontName: string;
  highlighted?: boolean;
};

const fontDescriptions: Record<string, string> = {
  Helvetica: 'A classic Swiss sans-serif known for its clarity and neutrality.',
  Futura: 'A geometric sans-serif typeface designed in the 1920s.',
  'Avant Garde': 'Inspired by the logo of the Avant Garde magazine.',
  Garamond: 'An old-style serif font used in books and publishing.',
  Inter: 'A modern sans-serif designed for digital interfaces.',
  'Times New Roman': 'A traditional serif font used in newspapers and academia.',
};

export default function FontCard({ fontName, highlighted = false }: FontProps) {
  const [flipped, setFlipped] = useState(false);

  const normalizedFont = fontName.toLowerCase().replace(/\s+/g, '');
  const filename = fontName === 'Times New Roman'
    ? 'mytypecardtimes.svg'
    : `mytypecard${normalizedFont}.svg`;

  return (
    <div
      className={`${styles.fontCardWrapper} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped(prev => !prev)}
    >
      <div className={styles.fontCardInner}>
        {/* Front: SVG */}
        <div className={styles.fontCardFront}>
          <img
            src={`/assets/cards/${filename}`}
            alt={fontName}
            className={styles.svgImage}
          />
        </div>

        {/* Back: Font Info */}
        <div className={styles.fontCardBack}>
          <h3>{fontName}</h3>
          <p>{fontDescriptions[fontName] || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
}

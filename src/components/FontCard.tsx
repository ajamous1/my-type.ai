'use client';

import styles from '@/styles/FontCard.module.css';

type FontProps = {
  fontName: string;
  highlighted?: boolean;
};

function FontCard({ fontName, highlighted = false }: FontProps) {
  // Convert font name to lowercase filename
  const normalizedFont = fontName.toLowerCase().replace(/\s+/g, '');
  const filename = fontName === 'Times New Roman'
    ? 'mytypecardtimes.svg'
    : `mytypecard${normalizedFont}.svg`;

  return (
    <div className={`${styles.fontCard} ${highlighted ? styles.highlighted : ''}`}>
      <img
        src={`/assets/cards/${filename}`}
        alt={fontName}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '0.5rem',
        }}
      />
    </div>
  );
}

type ContainerProps = {
  fonts?: FontProps[];
};

export function FontCardsContainer({ fonts = [] }: ContainerProps) {
  const defaultFonts: FontProps[] = [
    { fontName: 'Helvetica' },
    { fontName: 'Futura' },
    { fontName: 'Avant Garde' },
    { fontName: 'Garamond' },
    { fontName: 'Inter' },
    { fontName: 'Times New Roman' },
  ];

  const displayFonts = fonts.length > 0 ? fonts : defaultFonts;

  return (
    <div className={styles.fontCardsContainer} style={{ justifyContent: 'space-evenly' }}>
      {displayFonts.map((font, index) => (
        <FontCard
          key={index}
          fontName={font.fontName}
          highlighted={font.highlighted}
        />
      ))}
    </div>
  );
}

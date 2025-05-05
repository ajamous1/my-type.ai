'use client';

import styles from '@/styles/FontCard.module.css';

type FontProps = {
  fontName: string;
  highlighted?: boolean;
};

function FontCard({ fontName, highlighted = false }: FontProps) {
  const getFontStyle = (name: string) => {
    return { fontFamily: name.includes(' ') ? `"${name}"` : name };
  };

  return (
    <div className={`${styles.fontCard} ${highlighted ? styles.highlighted : ''}`}>
      <span className={styles.fontLetters} style={getFontStyle(fontName)}>Aa</span>
      <div className={styles.fontName}>{fontName}</div>
    </div>
  );
}

type ContainerProps = {
  fonts?: FontProps[];
};

export function FontCardsContainer({ fonts = [] }: ContainerProps) {
  const defaultFonts: FontProps[] = [
    { fontName: 'Helvetica' },
    { fontName: 'Courier New' },
    { fontName: 'Times' },
    { fontName: 'Inter' },
    { fontName: 'Verdana' },
    { fontName: 'Georgia' }
  ];

  const displayFonts = fonts.length > 0 ? fonts : defaultFonts;

  return (
    <div className={styles.fontCardsContainer} style={{ justifyContent: 'space-evenly' }}>
      {displayFonts.map((font, index) => (
        <FontCard key={index} fontName={font.fontName} highlighted={font.highlighted} />
      ))}
    </div>
  );
}

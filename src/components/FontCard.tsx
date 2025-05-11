import { useState } from 'react';
import styles from '@/styles/FontCard.module.css'; // Import the CSS module



export interface FontCardProps {
  fontName: string;
  image?: string;
}

const FontCard = ({ fontName, image }: FontCardProps) => {
  const [flipped, setFlipped] = useState(false);
  
  // Generate a fontDescription based on the fontName
  const getFontDescription = (name: string): string => {
    switch (name) {
      case 'Helvetica':
        return 'A classic Swiss sans-serif known for its clarity and neutrality.';
      case 'Futura':
        return 'A geometric sans-serif typeface designed in the 1920s.';
      case 'Avant Garde':
        return 'Inspired by the logo of the Avant Garde magazine.';
      case 'Garamond':
        return 'An old-style serif font used in books and publishing.';
      case 'Inter':
        return 'A modern sans-serif designed for digital interfaces.';
      case 'Times New Roman':
        return 'A traditional serif font used in newspapers and academia.';
      default:
        return 'A beautiful typeface with distinctive characteristics.';
    }
  };
  
  // Generate SVG path based on the fontName
  const getSvgPath = (name: string): string => {
    // Normalize font name for file naming: remove spaces, lowercase
    const normalizedName = name.replace(/\s+/g, '').toLowerCase();
    return `/assets/cards/mytypecard${normalizedName}.svg`;
  };
  
  return (
    <div 
      className={styles.fontCardWrapper} 
      onClick={() => setFlipped(prev => !prev)}
    >
      <div 
        className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}
      >
        {/* Front of card */}
        <div className={styles.cardFront}>
          {/* Always use the SVG with our naming convention */}
          <img 
            src={getSvgPath(fontName)} 
            alt={fontName}
            className={styles.fontImage}
          />
        </div>
        
        {/* Back of card */}
        <div className={styles.cardBack}>
          <h3>{fontName}</h3>
          <p>{getFontDescription(fontName)}</p>
        </div>
      </div>
    </div>
  );
};

export default FontCard;
import React from 'react';
import styles from './FontAnimationCard.module.css';

interface FontAnimationPreviewProps {}

const FontAnimationPreview: React.FC<FontAnimationPreviewProps> = () => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.fontCard}>
        <div className={styles.cardHeader}>
          <div className={styles.thumbnail}>
            <span className={styles.thumbnailText}>T</span>
          </div>
          <h3 className={styles.title}>Typographic Depth</h3>
        </div>
        <p className={styles.description}>Explore the visual hierarchy and impact of different typefaces</p>
        
        <div className={styles.fontAnimationContainer}>
          <div className={styles.fontList}>
            {/* Font items */}
            <div className={styles.fontItem} style={{ fontFamily: 'Helvetica' }}>Helvetica</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Futura' }}>Futura</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Avant Garde' }}>Avant Garde</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Garamond' }}>Garamond</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Inter' }}>Inter</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Times New Roman' }}>Times New Roman</div>
            
            {/* Repeat for seamless looping */}
            <div className={styles.fontItem} style={{ fontFamily: 'Helvetica' }}>Helvetica</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Futura' }}>Futura</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Avant Garde' }}>Avant Garde</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Garamond' }}>Garamond</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Inter' }}>Inter</div>
            <div className={styles.fontItem} style={{ fontFamily: 'Times New Roman' }}>Times New Roman</div>
          </div>
          
          {/* Blur overlays */}
          <div className={`${styles.blurOverlay} ${styles.topBlur}`}></div>
          <div className={`${styles.blurOverlay} ${styles.bottomBlur}`}></div>
          
          {/* Hover highlight (simulated in static preview) */}
          <div 
            className={styles.hoverHighlight}
            style={{
              left: '50%',
              top: '50%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FontAnimationPreview;
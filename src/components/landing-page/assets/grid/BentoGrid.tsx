'use client';

import { useState, useEffect, ReactElement } from 'react';
import styles from '@/styles/BentoGrid.module.css';
import FontAnimationCard from './FontAnimationCard';
import LightningBoltCard from './LightningBoltCard';
import PinpointAccuracyCard from './PinpointAccuracyCard';
import AnywhereAnyTypeCard from './AnyType';
import DesignerTunedCard from './DesignerTuned';

interface CardData {
  title: string;
  description: string;
  id: number;
}

const fontCards: CardData[] = [
  { title: 'Typographic Depth', description: 'Explore the visual hierarchy and impact of different typefaces', id: 1 },
  { title: 'Blazing Fast', description: 'Instant font identification with optimal performance', id: 2 },
  { title: 'Designer-Tuned', description: 'Crafted with precision for typographic excellence', id: 3 },
  { title: 'Pinpoint Accuracy', description: 'Precise font matching through advanced algorithms', id: 4 },
  { title: 'Anywhere, Any Type', description: 'Identify fonts from any background, of any shape, any scale, any size.', id: 5 }
];

export default function BentoGrid(): ReactElement {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewportSize('mobile');
      } else if (width < 1024) {
        setViewportSize('tablet');
      } else {
        setViewportSize('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderMobileGrid = (): ReactElement => {
    return (
      <div className={styles.mobileGrid}>
        {fontCards.map((card) => {
          // On mobile, all cards are full width
          return (
            <div key={card.id} className={styles.fullWidthRow}>
              {card.id === 1 && (
                <FontAnimationCard 
                  title={card.title} 
                  description={card.description} 
                  size="default" 
                />
              )}
              {card.id === 2 && (
                <LightningBoltCard 
                  title={card.title} 
                  description={card.description} 
                  size="default" 
                />
              )}
              {card.id === 3 && (
                <DesignerTunedCard
                  title={card.title}
                  description={card.description}
                  size="default"
                />
              )}
              {card.id === 4 && (
                <PinpointAccuracyCard 
                  title={card.title} 
                  description={card.description} 
                  size="default" 
                />
              )}
              {card.id === 5 && (
                <AnywhereAnyTypeCard 
                  title={card.title} 
                  description={card.description} 
                  size="default" 
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTabletGrid = (): ReactElement => {
    return (
      <div className={styles.tabletGrid}>
        {/* First row - full width */}
        <div className={styles.fullWidthRow}>
          <FontAnimationCard 
            title={fontCards[0].title} 
            description={fontCards[0].description} 
            size="large" 
          />
        </div>
        
        {/* Second row - two equal columns */}
        <div className={styles.twoCol}>
          <LightningBoltCard 
            title={fontCards[1].title} 
            description={fontCards[1].description} 
            size="small" 
          />
          <DesignerTunedCard
            title={fontCards[2].title}
            description={fontCards[2].description}
            size="small"
          />
        </div>
        
        {/* Third row - full width */}
        <div className={styles.fullWidthRow}>
          <PinpointAccuracyCard 
            title={fontCards[3].title} 
            description={fontCards[3].description} 
            size="large" 
          />
        </div>
        
        {/* Fourth row - full width */}
        <div className={styles.fullWidthRow}>
          <AnywhereAnyTypeCard 
            title={fontCards[4].title} 
            description={fontCards[4].description} 
            size="full" 
          />
        </div>
      </div>
    );
  };

  const renderDesktopGrid = (): ReactElement => {
    return (
      <div className={styles.desktopGrid}>
        {/* Top row: large + small */}
        <div className={styles.topRow}>
          <FontAnimationCard 
            title={fontCards[0].title} 
            description={fontCards[0].description} 
            size="large" 
          />
          <LightningBoltCard 
            title={fontCards[1].title} 
            description={fontCards[1].description} 
            size="small" 
          />
        </div>

        {/* Bottom row: small + large */}
        <div className={styles.bottomRow}>
          <DesignerTunedCard
            title={fontCards[2].title}
            description={fontCards[2].description}
            size="small"
          />
          <PinpointAccuracyCard 
            title={fontCards[3].title} 
            description={fontCards[3].description} 
            size="large" 
          />
        </div>

        {/* Full width row */}
        <div className={styles.fullWidthRow}>
          <AnywhereAnyTypeCard 
            title={fontCards[4].title} 
            description={fontCards[4].description} 
            size="full" 
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.bentoSection}>
      {viewportSize === 'mobile' && renderMobileGrid()}
      {viewportSize === 'tablet' && renderTabletGrid()}
      {viewportSize === 'desktop' && renderDesktopGrid()}
    </div>
  );
}
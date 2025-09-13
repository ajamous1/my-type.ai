'use client';

import { useState, useEffect, ReactElement } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import styles from '@/styles/BentoGrid.module.css';
import Image from 'next/image';
import FontAnimationCard from './FontAnimationCard';
import LightningBoltCard from './LightningBoltCard';
import PinpointAccuracyCard from './PinpointAccuracyCard';
import AnywhereAnyTypeCard from './AnyType';
import DesignerTunedCard from './DesignerTuned';
import Image from 'next/image';

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

const BentoCard = ({ title, description, icon, children, isMobile = false }: {
  title: string;
  description: string;
  icon: ReactElement;
  children?: React.ReactNode;
  isMobile?: boolean;
}): ReactElement => {
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        {!isMobile ? (
          // Desktop/tablet layout - icon side by side with title/description
          <>
            <div className={styles.thumbnail}>{icon}</div>
            <div className={styles.titleContentWrapper}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.description}>{description}</p>
            </div>
          </>
        ) : (
          // Mobile layout - icon inline with title, description below
          <>
            <div>
              <div className={styles.thumbnail}>{icon}</div>
              <h2 className={styles.title}>{title}</h2>
            </div>
            <p className={styles.description}>{description}</p>
          </>
        )}
      </div>
      {children && <div className={styles.cardContent}>{children}</div>}
    </div>
  );
};

export default function BentoGrid(): ReactElement {
  const isDark = useDarkMode();
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

  const renderMobileGrid = (): ReactElement => (
    <div className={styles.mobileGrid}>
      {fontCards.map((card, index) => {
        // Create the appropriate icon for each card
        let icon;
        switch (index) {
          case 0: // Typographic Depth
            icon = <Image src={isDark ? '/assets/icons/depth-dark.svg' : '/assets/icons/depth.svg'} alt="Typography Depth Icon" width={28} height={28} />;
            break;
          case 1: // Blazing Fast
            icon = <Image src={isDark ? '/assets/icons/lightningbolt-dark.svg' : '/assets/icons/lightningbolt.svg'} alt="Lightning Bolt Icon" width={28} height={28} />;
            break;
          case 2: // Designer-Tuned
            icon = <Image src={isDark ? '/assets/icons/pen-dark.svg' : '/assets/icons/pen.svg'} alt="Pen Icon" width={28} height={28} />;
            break;
          case 3: // Pinpoint Accuracy
            icon = <Image src={isDark ? '/assets/icons/target-dark.svg' : '/assets/icons/target.svg'} alt="Target Icon" width={28} height={28} />;
            break;
          case 4: // Anywhere, Any Type
            icon = <Image src={isDark ? '/assets/icons/globe-dark.svg' : '/assets/icons/globe.svg'} alt="Globe Icon" width={28} height={28} />;
            break;
          default:
            icon = <span />;
        }
        
        return (
          <div key={card.id} className={styles.fullWidthRow}>
            <BentoCard title={card.title} description={card.description} icon={icon} isMobile={true} />
          </div>
        );
      })}
    </div>
  );

  const renderTabletGrid = (): ReactElement => (
    <div className={styles.tabletGrid}>
      <div className={styles.fullWidthRow}>
        <FontAnimationCard title={fontCards[0].title} description={fontCards[0].description} size="large" />
      </div>
      <div className={styles.twoCol}>
        <LightningBoltCard title={fontCards[1].title} description={fontCards[1].description} size="small" />
        <DesignerTunedCard title={fontCards[2].title} description={fontCards[2].description} size="small" />
      </div>
      <div className={styles.fullWidthRow}>
        <PinpointAccuracyCard title={fontCards[3].title} description={fontCards[3].description} size="large" />
      </div>
      <div className={styles.fullWidthRow}>
        <AnywhereAnyTypeCard title={fontCards[4].title} description={fontCards[4].description} size="full" />
      </div>
    </div>
  );

  const renderDesktopGrid = (): ReactElement => (
    <div className={styles.desktopGrid}>
      <div className={styles.topRow}>
        <FontAnimationCard title={fontCards[0].title} description={fontCards[0].description} size="large" />
        <LightningBoltCard title={fontCards[1].title} description={fontCards[1].description} size="small" />
      </div>
      <div className={styles.bottomRow}>
        <DesignerTunedCard title={fontCards[2].title} description={fontCards[2].description} size="small" />
        <PinpointAccuracyCard title={fontCards[3].title} description={fontCards[3].description} size="large" />
      </div>
      <div className={styles.fullWidthRow}>
        <AnywhereAnyTypeCard title={fontCards[4].title} description={fontCards[4].description} size="full" />
      </div>
    </div>
  );

  return (
    <div className={styles.bentoSection}>
      {viewportSize === 'mobile' && renderMobileGrid()}
      {viewportSize === 'tablet' && renderTabletGrid()}
      {viewportSize === 'desktop' && renderDesktopGrid()}
    </div>
  );
}

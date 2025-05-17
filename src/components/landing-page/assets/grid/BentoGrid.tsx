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

interface BentoCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

const fontCards: CardData[] = [
  { title: 'Typographic Depth', description: 'Explore the visual hierarchy and impact of different typefaces', id: 1 },
  { title: 'Blazing Fast', description: 'Instant font identification with optimal performance', id: 2 },
  { title: 'Designer-Tuned', description: 'Crafted with precision for typographic excellence', id: 3 },
  { title: 'Pinpoint Accuracy', description: 'Precise font matching through advanced algorithms', id: 4 },
  { title: 'Anywhere, Any Type', description: 'Identify fonts from any background, of any shape, any scale, any size.', id: 5 }
];

function BentoCard({ title, description, size = 'default' }: BentoCardProps): ReactElement {
  return (
    <div className={`${styles.bentoCard} ${styles[size]}`}>
      <div className={styles.cardHeader}>
        <div className={styles.thumbnail}></div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
}

export default function BentoGrid(): ReactElement {
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  useEffect(() => {
    const handleResize = (): void => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderBentoGrid = (): ReactElement => {
    if (windowWidth < 640) {
      return (
        <div className={styles.mobileGrid}>
          <FontAnimationCard title={fontCards[0].title} description={fontCards[0].description} size="large" />
          {fontCards.slice(1).map(card => (
            <BentoCard key={card.id} title={card.title} description={card.description} size="default" />
          ))}
        </div>
      );
    } else {
      return (
        <div className={styles.desktopGrid}>
          {/* Top row: large + small */}
          <div className={styles.topRow}>
            <FontAnimationCard title={fontCards[0].title} description={fontCards[0].description} size="large" />
            <LightningBoltCard title={fontCards[1].title} description={fontCards[1].description} size="small" />
          </div>

          <div className={styles.bottomRow}>
          <DesignerTunedCard
    title="Designer-Tuned"
    description="Crafted with precision for typographic excellence"
    size="small"
  />
            <PinpointAccuracyCard title={fontCards[3].title} description={fontCards[3].description} size="large" />
          </div>


          <div className={styles.fullWidthRow}>
          <AnywhereAnyTypeCard title={fontCards[4].title} description={fontCards[4].description} size="full" />

          </div>
        </div>
      );
    }
  };

  return <div className={styles.bentoSection}>{renderBentoGrid()}</div>;
}

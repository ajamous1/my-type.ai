'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/BentoGrid.module.css';
import Image from 'next/image';
import {
  CARD_ROTATE_ANGLES,
  CARD_TOP_OFFSETS,
  CARD_LEFT_OFFSETS,
} from '../../../../app/constants/constants';
import {
  Roboto, Lato, Montserrat, Open_Sans, Poppins, Playfair_Display, Merriweather, Raleway, Ubuntu, Oswald, Inter, Noto_Serif, Inconsolata, PT_Serif,
  Abril_Fatface, Bangers, Indie_Flower, Courier_Prime
} from 'next/font/google';

const roboto          = Roboto({ subsets: ['latin'], weight: ['400','700'] });
const lato            = Lato({ subsets: ['latin'], weight: ['400','700'] });
const montserrat      = Montserrat({ subsets: ['latin'], weight: ['400','700'] });
const bangers         = Bangers({ subsets:['latin'], weight:['400'] });
const indieFlower     = Indie_Flower({ subsets:['latin'], weight:['400'] });
const courierPrime    = Courier_Prime({ subsets:['latin'], weight:['400'] });
const merriweather    = Merriweather({ subsets: ['latin'], weight: ['400','700'] });
const raleway         = Raleway({ subsets: ['latin'], weight: ['400','700'] });
const ubuntu          = Ubuntu({ subsets: ['latin'], weight: ['400','700'] });
const oswald          = Oswald({ subsets: ['latin'], weight: ['400','700'] });
const inter           = Inter({ subsets: ['latin'], weight: ['400','700'] });
const notoSerif       = Noto_Serif({ subsets: ['latin'], weight: ['400','700'] });
const inconsolata     = Inconsolata({ subsets: ['latin'], weight: ['400','700'] });
const ptSerif         = PT_Serif({ subsets: ['latin'], weight: ['400','700'] });
const abrilFatface    = Abril_Fatface({ subsets:['latin'], weight:['400'] });
const openSans        = Open_Sans({ subsets: ['latin'], weight: ['400','700'] });
const poppins         = Poppins({ subsets: ['latin'], weight: ['400','700'] });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400','700'] });

const fontObjs = [
  roboto, lato, montserrat, bangers, indieFlower,
  courierPrime, merriweather, raleway, abrilFatface, oswald,
  inter, notoSerif, inconsolata, ptSerif,
  ubuntu, openSans, poppins, playfairDisplay, 
];
interface FontAnimationCardProps {
  title?: string;
  description?: string;
  size?: 'default' | 'small' | 'large' | 'full';
}
const STEP = 7;
const FONT_COUNT = fontObjs.length; // 14

export default function FontAnimationCard({
  title = 'Typographic Depth',
  description = 'Explore the visual hierarchy and impact of different typefaces',
  size = 'large',
}: FontAnimationCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fontIndex, setFontIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 425);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      container.querySelectorAll<HTMLElement>(`.${styles.fallingText}`).forEach((el) => {
        const elRect = el.getBoundingClientRect();
        const elCenterX = elRect.left + elRect.width / 2 - rect.left;
        const elCenterY = elRect.top + elRect.height / 2 - rect.top;

        const distance = Math.hypot(elCenterX - mouseX, elCenterY - mouseY);
        const intensity = Math.max(0, 1 - distance / 300);
        el.style.setProperty('--text-intensity', intensity.toString());
        el.style.setProperty('--el-mouse-x', `${mouseX - (elRect.left - rect.left)}px`);
        el.style.setProperty('--el-mouse-y', `${mouseY - (elRect.top - rect.top)}px`);
      });
    };

    const handleLeave = () => {
      setIsCardHovered(false);
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const generateFontItems = (offset = 0) => 
    
    Array.from({ length: 12 }).map((_, i) => {
      let idx = offset + i;
      const font = fontObjs[idx % fontObjs.length];
      console.log(idx);
      return (
        <span
          key={idx}
          className={`${styles.fallingText} ${font.className}`}
          style={{
            transform: `rotate(${CARD_ROTATE_ANGLES[idx % CARD_ROTATE_ANGLES.length]}deg)`,
            top:    CARD_TOP_OFFSETS[idx % CARD_TOP_OFFSETS.length],
            left:   CARD_LEFT_OFFSETS[idx % CARD_LEFT_OFFSETS.length],
            '--text-intensity': '0',
          } as React.CSSProperties}
        >
          Aa
        </span>
      );
    });

  return (
    <div
      className={`${styles.bentoCard} ${styles[size]}`}
      onMouseEnter={() => {
        setIsCardHovered(true);
        setHasInteracted(true);
      }}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div className={styles.cardContentRow}>
        <div className={`${styles.leftColumn} ${isMobile ? styles.fullWidth : ''}`}>
          <div className={styles.cardHeader}>
            <div className={styles.thumbnail}>
              <Image 
                src="/assets/icons/depth.svg" 
                alt="Typography Depth Icon" 
                width={28} 
                height={28} 
              />
            </div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <p className={styles.description}>{description}</p>
        </div>

        {!isMobile && (
          <div
            ref={containerRef}
            className={`${styles.fallingTextContainer} ${isCardHovered ? styles.hovering : ''} ${hasInteracted ? styles.animated : ''}`}
          >
            <div className={styles.topBlur}></div>
            <div className={styles.bottomBlur}></div>

            <div className={`${styles.column} ${styles.col0}`}>
            {generateFontItems(0)}
            {generateFontItems(12)}
            {generateFontItems(24)}
            </div>
            <div className={`${styles.column} ${styles.col1}`}>
              {generateFontItems(2)}
              {generateFontItems(14)}
              {generateFontItems(26)}
            </div>
            <div className={`${styles.column} ${styles.col2}`}>
              {generateFontItems(4)}
              {generateFontItems(16)}
              {generateFontItems(28)}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
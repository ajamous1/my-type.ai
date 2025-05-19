'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/BentoGrid.module.css';

const fonts = ['Helvetica', 'Futura', 'Avant Garde', 'Garamond', 'Inter', 'Times New Roman'];

interface PinpointAccuracyCardProps {
  title: string;
  description: string;
  size?: 'default' | 'small' | 'large' | 'full';
}

export default function PinpointAccuracyCard({ title, description, size = 'large' }: PinpointAccuracyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fontGridRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });
  const [mode, setMode] = useState<'idle' | 'auto' | 'user'>('idle');
  const defaultPos = { x: 120, y: 120 };

  // Used for the scanning animation pattern
  const animationStateRef = useRef({
    lastTimestamp: 0,
    targetPos: { x: 120, y: 120 },
    currentPos: { x: 120, y: 120 },
    currentWaypoint: 0,
    scanSpeed: 0.15, // Controls how fast the crosshair moves between points
    pauseDuration: 300, // Time to pause at each waypoint in ms
    pauseTimer: 0, // Counter for the current pause
  });

  const animationFrameRef = useRef<number | null>(null);

  // Define the scanning pattern waypoints - will be calculated based on grid size
  const scanPathRef = useRef<Array<{x: number, y: number}>>([]);
  
  // Initialize the scanning path based on the grid dimensions
  const initScanPath = () => {
    if (!fontGridRef.current || !containerRef.current) return;
    
    const gridBounds = fontGridRef.current.getBoundingClientRect();
    const containerBounds = containerRef.current.getBoundingClientRect();
    
    const minX = gridBounds.left - containerBounds.left + 20; // Add margin
    const minY = gridBounds.top - containerBounds.top + 20;
    const maxX = minX + gridBounds.width - 40;
    const maxY = minY + gridBounds.height - 40;
    
// Generate a natural Z-pattern that sweeps the grid twice
const marginX = (maxX - minX);
const marginY = (maxY - minY) * 0.1;

const path = [
  // Sweep 1: top-left to bottom-right
  { x: minX + marginX, y: minY + marginY },
  { x: maxX - marginX, y: maxY - marginY },

  // Sweep 2: bottom-left to top-right
  { x: minX + marginX, y: maxY - marginY },
  { x: maxX - marginX, y: minY + marginY },
];
 

    
    scanPathRef.current = path;
    
    // Set initial target to first waypoint
    animationStateRef.current.targetPos = { ...path[0] };
    animationStateRef.current.currentPos = { ...defaultPos };
  };

  // Smooth animation function that moves between waypoints
  const animateScan = (timestamp: number) => {
    if (mode !== 'auto') return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const state = animationStateRef.current;
    const delta = timestamp - state.lastTimestamp;
    state.lastTimestamp = timestamp;
    
    // If we're pausing at a waypoint
    if (state.pauseTimer > 0) {
      state.pauseTimer -= delta;
      
      // Continue pausing
      animationFrameRef.current = requestAnimationFrame(animateScan);
      return;
    }
    
    // Calculate distance to target
    const dx = state.targetPos.x - state.currentPos.x;
    const dy = state.targetPos.y - state.currentPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If we've reached the target (or very close)
    if (distance < 1) {
      // Move to next waypoint
      const nextWaypoint = (state.currentWaypoint + 1) % scanPathRef.current.length;
      state.currentWaypoint = nextWaypoint;
      state.targetPos = scanPathRef.current[nextWaypoint];
      
      // Start pause timer when reaching a waypoint
      state.pauseTimer = state.pauseDuration;
      
      animationFrameRef.current = requestAnimationFrame(animateScan);
      return;
    }
    
    // Move towards target with easing
    const step = Math.min(state.scanSpeed * delta, distance);
    const ratio = step / distance;
    
    state.currentPos.x += dx * ratio;
    state.currentPos.y += dy * ratio;
    
    // Update the UI
    setMousePos({ x: state.currentPos.x, y: state.currentPos.y });
    container.style.setProperty('--mask-x', `${state.currentPos.x}px`);
    container.style.setProperty('--mask-y', `${state.currentPos.y}px`);
    
    if (crosshairRef.current) {
      // Get position relative to cardContentRow for the crosshair
      const cardRow = container.closest(`.${styles.cardContentRow}`);
      const cardRowBounds = cardRow?.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      
      if (cardRowBounds) {
        const containerOffsetX = containerBounds.left - cardRowBounds.left;
        const containerOffsetY = containerBounds.top - cardRowBounds.top;
        
        // Position crosshair relative to the card content row
        crosshairRef.current.style.left = `${containerOffsetX + state.currentPos.x}px`;
        crosshairRef.current.style.top = `${containerOffsetY + state.currentPos.y}px`;
      } else {
        crosshairRef.current.style.left = `${state.currentPos.x}px`;
        crosshairRef.current.style.top = `${state.currentPos.y}px`;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animateScan);
  };

  const startScanAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    // Initialize scan path if not already done
    if (scanPathRef.current.length === 0) {
      initScanPath();
    }
    
    animationStateRef.current.lastTimestamp = performance.now();
    animationFrameRef.current = requestAnimationFrame(animateScan);
  };

  useEffect(() => {
    // Set crosshair at default idle position
    const container = containerRef.current;
    if (container) {
      container.style.setProperty('--mask-x', `${defaultPos.x}px`);
      container.style.setProperty('--mask-y', `${defaultPos.y}px`);
    }
    
    if (crosshairRef.current && container) {
      // Get position relative to cardContentRow for the crosshair
      const cardRow = container.closest(`.${styles.cardContentRow}`);
      const cardRowBounds = cardRow?.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      
      if (cardRowBounds) {
        const containerOffsetX = containerBounds.left - cardRowBounds.left;
        const containerOffsetY = containerBounds.top - cardRowBounds.top;
        
        // Position crosshair relative to the card content row
        crosshairRef.current.style.left = `${containerOffsetX + defaultPos.x}px`;
        crosshairRef.current.style.top = `${containerOffsetY + defaultPos.y}px`;
      } else {
        crosshairRef.current.style.left = `${defaultPos.x}px`;
        crosshairRef.current.style.top = `${defaultPos.y}px`;
      }
    }
    
    // Initialize scan path on component mount
    initScanPath();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (mode === 'auto') {
      startScanAnimation();
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [mode]);

  const handleFontGridEnter = () => setMode('user');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'user') return;

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const MARGIN = 40;
    const x = Math.min(bounds.width - MARGIN, Math.max(MARGIN, e.clientX - bounds.left));
    const y = Math.min(bounds.height - MARGIN, Math.max(MARGIN, e.clientY - bounds.top));

    // Get position relative to cardContentRow for the crosshair
    const cardRow = container.closest(`.${styles.cardContentRow}`);
    const cardRowBounds = cardRow?.getBoundingClientRect() || bounds;
    const containerOffsetX = bounds.left - cardRowBounds.left;
    const containerOffsetY = bounds.top - cardRowBounds.top;

    // Smooth mouse following with easing
    const easedX = mousePos.x + (x - mousePos.x) * 0.2;
    const easedY = mousePos.y + (y - mousePos.y) * 0.2;

    setMousePos({ x: easedX, y: easedY });
    container.style.setProperty('--mask-x', `${easedX}px`);
    container.style.setProperty('--mask-y', `${easedY}px`);

    if (crosshairRef.current) {
      // Position crosshair relative to the card content row
      crosshairRef.current.style.left = `${containerOffsetX + easedX}px`;
      crosshairRef.current.style.top = `${containerOffsetY + easedY}px`;
    }
  };

  const handleMouseLeave = () => {
    const x0 = mousePos.x;
    const y0 = mousePos.y;
    const x1 = defaultPos.x;
    const y1 = defaultPos.y;
    const duration = 500;
    const start = performance.now();

    setMode('idle');

    // Smooth animation back to default position
    const animateBack = (t: number) => {
      const container = containerRef.current;
      if (!container) return;

      const progress = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease-out for smoother finish
      const x = x0 + (x1 - x0) * ease;
      const y = y0 + (y1 - y0) * ease;

      setMousePos({ x, y });
      container.style.setProperty('--mask-x', `${x}px`);
      container.style.setProperty('--mask-y', `${y}px`);

      if (crosshairRef.current) {
        // Get position relative to cardContentRow for the crosshair
        const cardRow = container.closest(`.${styles.cardContentRow}`);
        const cardRowBounds = cardRow?.getBoundingClientRect();
        const containerBounds = container.getBoundingClientRect();
        
        if (cardRowBounds) {
          const containerOffsetX = containerBounds.left - cardRowBounds.left;
          const containerOffsetY = containerBounds.top - cardRowBounds.top;
          
          // Position crosshair relative to the card content row
          crosshairRef.current.style.left = `${containerOffsetX + x}px`;
          crosshairRef.current.style.top = `${containerOffsetY + y}px`;
        } else {
          crosshairRef.current.style.left = `${x}px`;
          crosshairRef.current.style.top = `${y}px`;
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animateBack);
      }
    };

    requestAnimationFrame(animateBack);
  };

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`${styles.bentoCard} ${styles[size]}`}
        onMouseEnter={() => {
          if (mode !== 'user') setMode('auto');
        }}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Position relative wrapper to establish positioning context */}
        <div className={styles.cardContentRow} style={{ position: 'relative' }}>
          <div className={styles.leftColumn}>
            <div className={styles.cardHeader}>
              <div className={styles.thumbnail}>

              <Image 
                src="/assets/icons/target.svg" 
                alt="Target Icon" 
                width={60} 
                height={60} 
              />
              </div>
              <h3 className={styles.title}>{title}</h3>
            </div>
            <p>{description}</p>
          </div>

          <div ref={containerRef} className={styles.pinpointContainer}>
            <div
              ref={fontGridRef}
              className={styles.fontGridStatic}
              onMouseEnter={handleFontGridEnter}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.fallingText}
                  style={{ fontFamily: fonts[i % fonts.length] }}
                >
                  Aa
                </span>
              ))}
            </div>
          </div>
          
          {/* Crosshair moved outside the container that may have clipping */}
          <div
            ref={crosshairRef}
            className={styles.crosshair}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 50, // Higher z-index to ensure it's above everything
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
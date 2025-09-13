'use client';

import React, { useState } from 'react';
import styles from '@/styles/FontCardBack.module.css';
import { FontMeta, FONT_DATA } from '../data/fonts';

export type FontCardBackProps = {
  font: FontMeta;
  showGrid?: boolean;     // default true
  className?: string;
};

// Generate letters and numbers text
const generateLettersAndNumbers = (isUppercase: boolean): string => {
  const letters = Array.from({ length: 26 }, (_, i) => 
    String.fromCharCode((isUppercase ? 65 : 97) + i)
  ).join('');
  const numbers = '0123456789';
  
  return `${letters}\n\n${numbers}`;
};

export default function FontCardBack({ 
  font, 
  showGrid = true, 
  className = ''
}: FontCardBackProps) {
  const [previewMode, setPreviewMode] = useState<'description' | 'letters'>('description');
  const [isUppercase, setIsUppercase] = useState(false);

  const fontFamily = font.cssStack || 'inherit';

  // Get the text to display based on current mode and case
  const getDisplayText = () => {
    if (previewMode === 'description') {
      return isUppercase ? font.description.toUpperCase() : font.description;
    } else {
      return generateLettersAndNumbers(isUppercase);
    }
  };

  const togglePreviewMode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    setPreviewMode(prev => prev === 'description' ? 'letters' : 'description');
    // Removed onSettingChange call to prevent auto-flip
  };
  
  const toggleCase = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    setIsUppercase(prev => !prev);
    // Removed onSettingChange call to prevent auto-flip
  };

  return (
    <div 
      className={`${styles.fontCardBack} ${showGrid ? styles.withGrid : ''} ${className}`}
      data-mode="headline"
    >
      {/* Header Section */}
      <div className={styles.header}>
        <h2 className={styles.fontName} style={{ fontFamily }}>
          {font.name}
        </h2>
        <p className={styles.tagline}>
          {font.tagline}
        </p>
      </div>

      {/* Preview Section - Single block that shows either description or letters */}
      <div className={styles.preview} style={{ fontFamily }}>
        <div className={styles.previewText} data-type={previewMode}>
          {getDisplayText()}
        </div>
      </div>

      {/* Toggle Controls */}
      <div className={styles.toggleGroup} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`${styles.controlButton} ${previewMode === 'description' ? styles.active : ''}`}
          onClick={togglePreviewMode}
          aria-pressed={previewMode === 'description'}
          aria-label="Toggle between description and letters"
        >
          {previewMode === 'description' ? 'Letters' : 'Description'}
        </button>
        
        <button
          type="button"
          className={`${styles.controlButton} ${styles.caseButton} ${isUppercase ? styles.active : ''}`}
          onClick={toggleCase}
          aria-pressed={isUppercase}
          aria-label="Toggle between uppercase and lowercase"
        >
          {isUppercase ? 'Lowercase' : 'Uppercase'}
        </button>
      </div>
    </div>
  );
}

// Export the shared font data for backward compatibility
export const FONT_CARDS = FONT_DATA;

'use client';

import styles from '@/styles/Footer.module.css';
import ThemeSwitcher from './ThemeSwitcher';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© {currentYear} MyType. All rights reserved.</p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
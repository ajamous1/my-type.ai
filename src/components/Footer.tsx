'use client';

import styles from '@/styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© {currentYear} MyType. All rights reserved.</p>
      </div>
    </footer>
  );
}
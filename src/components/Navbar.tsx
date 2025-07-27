'use client';

import { useState } from 'react';
import styles from '@/styles/Navbar.module.css';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <Link href="/" className={styles.navbarLogo}>
            <img src="/assets/logos/mytypelogo.png" alt="MyType Logo" />
            <span className={styles.logoText}>
              <span className={styles.logoTextRegular}>My</span>
              <span className={styles.logoTextBold}>Type</span>
            </span>
          </Link>
        </div>

        <div className={styles.navbarCenter}>
          <ul className={styles.desktopMenu}>
            <li><a href="/docs">Docs</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className={styles.navbarRight}>
          <button onClick={toggleTheme} className={styles.themeToggleButton}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <a href="#contact" className={styles.getExtensionButton} title="Get Extension">Get Extension</a>
          <a href="#waitlist" className={styles.joinWaitlistButton} title="Join Waitlist">Join Waitlist</a>
        </div>

        <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6H21" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H21" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
          <li><a href="/docs">Docs</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="https://chromewebstore.google.com/detail/mytype-find-any-fonts-fro/jklhhfcegndoebijajkmioefnpgpomfl" className={styles.mobileExtension} title="Get Extension">Get Extension</a></li>
          <li><a href="#waitlist" className={styles.mobileWaitlist} title="Join Waitlist">Join Waitlist</a></li>
        </ul>
      </div>
    </nav>
  );
}

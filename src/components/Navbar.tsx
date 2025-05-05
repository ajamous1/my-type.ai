'use client';

import { useState } from 'react';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <img src="/assets/logos/mytypelogo.png" alt="MyType Logo" />
        </div>

        <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <ul className={`${styles.navbarMenu} ${isMenuOpen ? styles.active : ''}`}>
          <li className={styles.navbarItem}>
            <a href="#about" className={styles.navbarLink} onClick={() => setIsMenuOpen(false)}>About</a>
          </li>
          <li className={styles.navbarItem}>
            <a href="#contact" className={styles.navbarLink} onClick={() => setIsMenuOpen(false)}>Contact</a>
          </li>
          <li className={styles.navbarItem}>
            <a href="#contact" className={styles.navbarLink} onClick={() => setIsMenuOpen(false)}>Get Extension</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

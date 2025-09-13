'use client';

import styles from '@/styles/ThemeSwitcher.module.css';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.themeSwitcher}>
      <button onClick={() => setTheme('light')} className={theme === 'light' ? styles.active : ''}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          light_mode
        </span>
      </button>
      <button onClick={() => setTheme('dark')} className={theme === 'dark' ? styles.active : ''}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          dark_mode
        </span>
      </button>
      <button onClick={() => setTheme('system')} className={theme === 'system' ? styles.active : ''}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          computer
        </span>
      </button>
    </div>
  );
}

"use client";

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bottomBarContainer}>
        <button 
          className={styles.scrollTopBtn} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <div className={styles.bottomBar}>
          <div className={styles.bottomBarContent}>
            <p>&copy; {new Date().getFullYear()} Nittonotonbd. All rights reserved.</p>
            {/* <p className={styles.developerText}>| Rakib Hasan Shawon</p> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import styles from './HeroBanner.module.css';

const HeroBanner: React.FC = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.banner}>
        <img src="/cover3.png" alt="Special Offer Banner" className={styles.bannerImage} />
      </div>
    </div>
  );
};

export default HeroBanner;
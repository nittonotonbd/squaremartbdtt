"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Facebook01Icon, 
  InstagramIcon, 
  YoutubeIcon, 
  TiktokIcon 
} from "@hugeicons/core-free-icons";
import styles from './Footer.module.css';

export default function Footer() {
  const footerLinks = [
    { name: 'ABOUT US', href: '/about' },
    { name: 'TERMS AND CONDITION', href: '/terms' },
    { name: 'ORDER AND DELIVERY POLICY', href: '/order-policy' },
    { name: 'RETURN AND REFUND POLICY', href: '/return-policy' },
    { name: 'PRIVACY POLICY', href: '/privacy-policy' },
    { name: 'SHIPPING POLICY', href: '/shipping-policy' },
  ];

  const socialLinks = [
    { icon: Facebook01Icon, href: 'https://facebook.com', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
    { icon: TiktokIcon, href: 'https://tiktok.com', label: 'TikTok' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <nav className={styles.linksContainer}>
          {footerLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={styles.socialIcons}>
          {socialLinks.map((social, index) => (
            <a 
              key={index} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIconLink}
              aria-label={social.label}
            >
              <HugeiconsIcon icon={social.icon} size={20} color="currentColor" />
            </a>
          ))}
        </div>

        <div className={styles.paymentMethods}>
          <Image 
            src="https://download.logo.wine/logo/BKash/BKash-Logo.wine.png" 
            alt="bKash" 
            width={120} 
            height={60} 
            className={styles.bkashLogo}
          />
          <div className={styles.paymentGridWrapper}>
            <Image 
              src="https://gadgetbd.com/wp-content/uploads/2020/03/SSLCommerz-Pay-With-logo-All-Size-01.png" 
              alt="Payment Methods" 
              width={800} 
              height={150} 
              className={styles.paymentGrid}
              unoptimized
            />
          </div>
        </div>
      </div>

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
          </div>
        </div>
      </div>
    </footer>
  );
}

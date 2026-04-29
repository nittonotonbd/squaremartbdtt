"use client";

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import styles from './Header.module.css';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>Call to Order: 01942-838348</span>
          <span>100% Genuine Products</span>
        </div>
      </div>
      <div className={styles.mainHeader}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>SquareMart</h1>
          </Link>
        </div>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="Search for products..." className={styles.searchInput} />
          <button className={styles.searchButton} aria-label="Search">
            <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={2} />
          </button>
        </div>
        <Link href="/cart" className={styles.cartContainer}>
          <div className={styles.cartIcon}>
            <HugeiconsIcon icon={ShoppingCart01Icon} size={28} color="currentColor" strokeWidth={1.5} />
          </div>
          <span className={styles.cartBadge}>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}

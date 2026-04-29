"use client";

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import styles from './Header.module.css';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { cartItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>Call to Order: 01911-940406</span>
          <span>100% Genuine Products</span>
        </div>
      </div>
      <div className={styles.mainHeader}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>SquareMart</h1>
          </Link>
        </div>
        <form 
          className={`${styles.searchContainer} ${isSearchOpen ? styles.showSearch : ''}`}
          onSubmit={handleSearch}
        >
          <input 
            type="text" 
            placeholder="Search for products..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton} aria-label="Search">
            <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={2} />
          </button>
        </form>
        <div className={styles.headerActions}>
          <button 
            className={styles.searchIconButton} 
            onClick={toggleSearch}
            aria-label="Toggle Search"
          >
            <HugeiconsIcon 
              icon={isSearchOpen ? Cancel01Icon : Search01Icon} 
              size={24} 
              color="currentColor" 
              strokeWidth={1.5} 
            />
          </button>
          <Link href="/cart" className={styles.cartContainer}>
            <div className={styles.cartIcon}>
              <HugeiconsIcon icon={ShoppingCart01Icon} size={28} color="currentColor" strokeWidth={1.5} />
            </div>
            <span className={styles.cartBadge}>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

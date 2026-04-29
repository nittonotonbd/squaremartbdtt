"use client";

import React from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
}

import Link from 'next/link';

export default function ProductCard({ id, title, price, originalPrice, imageUrl }: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, title, price, imageUrl });
  };

  return (
    <div className={styles.card}>
      <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageContainer}>
          {discount > 0 && <span className={styles.badge}>-{discount}%</span>}
          <div className={styles.imagePlaceholder} style={{ backgroundImage: `url(${imageUrl})` }}>
            {!imageUrl && "Image"}
          </div>
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>৳{price}</span>
            {originalPrice && <span className={styles.originalPrice}>৳{originalPrice}</span>}
          </div>
        </div>
      </Link>
      <button className={styles.addToCartBtn} onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

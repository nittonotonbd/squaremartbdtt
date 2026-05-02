"use client";

import React from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
}

import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ id, slug, title, price, originalPrice, imageUrl }: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, title, price, imageUrl });
  };

  return (
    <div className={styles.card}>
      <Link href={`/product/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageContainer}>
          {discount > 0 && <span className={styles.badge}>-{discount}%</span>}
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              priority={id <= 4} // Load first 4 images with priority
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No Image
            </div>
          )}
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

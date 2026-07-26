"use client";

import React from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { cleanTitle } from '../data/products';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  productCode?: string;
}

export default function ProductCard({ id, slug, title, price, originalPrice, imageUrl, productCode }: ProductCardProps) {
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, imageUrl });
    router.push('/checkout');
  };

  const formattedPrice = originalPrice && originalPrice > price
    ? `৳ ${price.toLocaleString('en-US')} – ৳ ${originalPrice.toLocaleString('en-US')}`
    : `৳ ${price.toLocaleString('en-US')}`;

  const cleanedTitle = cleanTitle(title, productCode);

  return (
    <div className={styles.card}>
      <Link href={`/product/${slug || id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          {discount > 0 && <span className={styles.badge}>-{discount}%</span>}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className={styles.image}
              priority={id <= 4}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No Image
            </div>
          )}
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>{cleanedTitle}</h3>
          <div className={styles.priceContainer}>
            <span className={styles.price}>{formattedPrice}</span>
          </div>
        </div>
      </Link>
      <div className={styles.buttonContainer}>
        <button className={styles.buyNowBtn} onClick={handleBuyNow}>
          <span>অর্ডার করুন</span>
          <span className={styles.arrow}>➔</span>
        </button>
      </div>
    </div>
  );
}


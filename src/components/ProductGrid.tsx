import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  showSeeMore?: boolean;
}

export default function ProductGrid({ title, products, showSeeMore = false }: ProductGridProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {showSeeMore && (
          <Link href="/products" className={styles.seeMore}>
            See More <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} style={{verticalAlign: 'middle', marginLeft: '4px'}} />
          </Link>
        )}
      </div>
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            id={product.id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        <button className={styles.pageBtn} aria-label="Previous page">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="currentColor" strokeWidth={2} />
        </button>
        <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
        <button className={styles.pageBtn} aria-label="Next page">
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

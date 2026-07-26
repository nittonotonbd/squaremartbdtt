"use client";

import React, { useState } from 'react';
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
  maxPrice?: number;
  originalPrice?: number;
  imageUrl?: string;
  productCode?: string;
  description?: string;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  showSeeMore?: boolean;
  seeMoreUrl?: string;
  disablePagination?: boolean;
  showAll?: boolean;
}

export default function ProductGrid({ 
  title, 
  products, 
  showSeeMore = false,
  seeMoreUrl = '/products',
  disablePagination = false,
  showAll = false
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedProducts = showAll
    ? products
    : (disablePagination
        ? products.slice(0, itemsPerPage)
        : products.slice(startIndex, startIndex + itemsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('product-grid-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="product-grid-section" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {showSeeMore && !disablePagination && !showAll && (
          <Link href={seeMoreUrl} className={styles.seeMore}>
            আরো দেখুন <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
          </Link>
        )}
      </div>
      <div className={styles.grid}>
        {displayedProducts.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            maxPrice={product.maxPrice}
            originalPrice={product.originalPrice}
            imageUrl={product.imageUrl}
            productCode={product.productCode}
            description={product.description}
          />
        ))}
      </div>

      {!showAll && !disablePagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            aria-label="Previous page"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="currentColor" strokeWidth={2} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${activePage === page ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            aria-label="Next page"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} />
          </button>
        </div>
      )}

      {disablePagination && !showAll && (
        <div className={styles.seeMoreBottomContainer}>
          <Link href={seeMoreUrl} className={styles.seeMoreBottomBtn}>
            আরো দেখুন <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
          </Link>
        </div>
      )}
    </section>
  );
}

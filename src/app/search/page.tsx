"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGrid from '../../components/ProductGrid';
import { mockProducts } from '../../data/products';
import styles from './Search.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const filteredProducts = mockProducts.filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <main className={styles.searchMain}>
      <div className={styles.searchHeader}>
        <h1>Search Results for "{query}"</h1>
        <p>{filteredProducts.length} products found</p>
      </div>
      
      {filteredProducts.length > 0 ? (
        <ProductGrid title="" products={filteredProducts} />
      ) : (
        <div className={styles.noResults}>
          <p>No products found matching your search. Try different keywords.</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}

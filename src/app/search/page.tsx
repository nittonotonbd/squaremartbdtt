"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGrid from '../../components/ProductGrid';
import { getProducts, Product } from '../../data/products';
import styles from './Search.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching search products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    
    return products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
    );
  }, [products, query]);

  if (loading) {
    return (
      <main className={styles.searchMain}>
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
          <p>Searching products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.searchMain}>
      <div className={styles.searchHeader}>
        <h1>Search Results for "{query}"</h1>
        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</p>
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


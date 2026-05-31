import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoriesBar from '../../components/CategoriesBar';
import ProductGrid from '../../components/ProductGrid';
import { getProducts } from '../../data/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <CategoriesBar />
      <main style={{ padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <ProductGrid title="All Products" products={products} showSeeMore={false} />

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              <p>No products found.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

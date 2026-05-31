import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoriesBar from '../../../components/CategoriesBar';
import ProductGrid from '../../../components/ProductGrid';
import { getProductsByCategory } from '../../../data/products';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryMap: Record<string, string> = {
  "waterproof-chador": "ওয়াটারপ্রুফ চাদর",
  "normal-chador": "নরমাল চাদর",
  "moshari": "মশারী"
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = categoryMap[resolvedParams.slug];

  if (!categoryName) {
    notFound();
  }

  const products = await getProductsByCategory(categoryName);

  return (
    <>
      <Header />
      <CategoriesBar />
      <main style={{ padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <ProductGrid title={`${categoryName}`} products={products} />

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

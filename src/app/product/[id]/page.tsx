import React from 'react';
import { getProductById, getRelatedProducts } from '../../../data/products';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductDetailsClient from './ProductDetailsClient';
import ProductGrid from '../../../components/ProductGrid';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  const product = await getProductById(productId);


  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(productId, 4);

  return (
    <>
      <Header />
      <ProductDetailsClient product={product} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '40px' }}>
        <ProductGrid title="Related Products" products={relatedProducts} />
      </div>
      <Footer />
    </>
  );
}

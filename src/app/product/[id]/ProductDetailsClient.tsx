"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import styles from './product.module.css';
import { Product } from '../../../data/products';

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'policy'>('description');
  const { addToCart } = useCart();
  const router = useRouter();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const images = product.galleryImages || [product.imageUrl];

  const handleAddToCart = () => {
    // Add item multiple times based on quantity, or you can update the context to take quantity
    // Our context currently adds 1, then we can update quantity. Or we can just add it `quantity` times for simplicity if context doesn't support adding with quantity.
    // Better to just add one and let user update in cart if we don't modify context. 
    // Wait, our cart context addToCart might just add 1. Let's add multiple if needed.
    for(let i=0; i<quantity; i++){
      addToCart({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl });
    }
    alert(`${quantity} items added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className={styles.container}>
      <div className={styles.productSection}>
        {/* Left: Image Gallery */}
        <div className={styles.imageGallery}>
          <div 
            className={styles.mainImage} 
            style={{ backgroundImage: `url(${activeImage})` }}
          ></div>
          <div className={styles.thumbnailContainer}>
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ''}`}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => setActiveImage(img)}
              ></div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={styles.productInfo}>
          <h1 className={styles.title}>{product.title}</h1>
          
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>৳{product.price}</span>
            {product.originalPrice && (
              <>
                <span className={styles.originalPrice}>৳{product.originalPrice}</span>
                <span className={styles.discountBadge}>-{discount}%</span>
              </>
            )}
          </div>

          <div className={styles.statusBlock}>
            Stock: <span className={`${styles.stockStatus} ${product.stockStatus === 'Out Of Stock' ? styles.outOfStock : ''}`}>
              {product.stockStatus}
            </span>
          </div>

          {product.callToOrder && (
            <div className={styles.callToOrder}>
              Call to order: <span>{product.callToOrder}</span>
            </div>
          )}

          <div className={styles.actionBlock}>
            <div className={styles.qtyWrapper}>
              <span className={styles.qtyLabel}>Quantity:</span>
              <div className={styles.qtyControls}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className={styles.buttons}>
              <button 
                className={styles.addToCartBtn} 
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'Out Of Stock'}
                style={{ opacity: product.stockStatus === 'Out Of Stock' ? 0.5 : 1, cursor: product.stockStatus === 'Out Of Stock' ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
              <button 
                className={styles.buyNowBtn} 
                onClick={handleBuyNow}
                disabled={product.stockStatus === 'Out Of Stock'}
                style={{ opacity: product.stockStatus === 'Out Of Stock' ? 0.5 : 1, cursor: product.stockStatus === 'Out Of Stock' ? 'not-allowed' : 'pointer' }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsSection}>
        <div className={styles.tabHeaders}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'policy' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            Return Policy
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === 'description' ? (
            <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available for this product.' }} />
          ) : (
            <div>
              <h3>Delivery Policy</h3>
              <p>Delivery time is 2-4 working days inside Dhaka, and 3-5 working days outside Dhaka.</p>
              <h3>Return Policy</h3>
              <p>You can return the product within 7 days if it is damaged or doesn't match the description. Please keep the original packaging intact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

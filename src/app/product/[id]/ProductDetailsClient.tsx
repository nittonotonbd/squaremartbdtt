"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import styles from './product.module.css';
import { Product } from '../../../data/products';
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";

export default function ProductDetailsClient({ product }: { product: Product }) {
  const isBedCover = product.title.toLowerCase().includes('waterproof bed cover') || product.id === 4 || product.id === 5;

  const sizeOptions = [
    {
      id: 4,
      slug: 'waterproof-bed-cover-6-7-feet',
      title: 'Waterproof Bed Cover (6/7 Feet)',
      price: 1090,
      originalPrice: 1550,
      discount: 30,
      sizeName: 'সাইজ, ৬ফুট x ৭ ফুট',
      imageUrl: 'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.4227430882981412.jpeg',
      stockStatus: 'In Stock' as const,
      isBestSeller: false,
      galleryImages: [
        'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.4227430882981412.jpeg'
      ]
    },
    {
      id: 5,
      slug: 'waterproof-bed-cover-7-8-feet',
      title: 'Waterproof Bed Cover (7/8 Feet)',
      price: 1250,
      originalPrice: 1550,
      discount: 19,
      sizeName: 'সাইজ, ৭ফুট x ৮ ফুট',
      imageUrl: 'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.5863508889960549.jpeg',
      stockStatus: 'In Stock' as const,
      isBestSeller: true,
      galleryImages: [
        'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.5863508889960549.jpeg'
      ]
    }
  ];

  // Initialize selectedProduct
  const initialSelected = isBedCover 
    ? (sizeOptions.find(opt => opt.id === product.id) || sizeOptions[0])
    : null;

  const [selectedProduct, setSelectedProduct] = useState<any>(initialSelected || product);
  const [activeImage, setActiveImage] = useState(selectedProduct.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'policy'>('description');
  const { addToCart } = useCart();
  const router = useRouter();

  const discount = selectedProduct.originalPrice 
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) 
    : 0;

  const images = selectedProduct.galleryImages || [selectedProduct.imageUrl];

  const handleSizeSelect = (opt: typeof sizeOptions[0]) => {
    setSelectedProduct(opt);
    setActiveImage(opt.imageUrl);
  };

  const handleAddToCart = () => {
    addToCart({ id: selectedProduct.id, title: selectedProduct.title, price: selectedProduct.price, imageUrl: selectedProduct.imageUrl }, quantity);
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
          <div className={styles.mainImage}>
            {activeImage && (
              <Image 
                src={activeImage} 
                alt={selectedProduct.title} 
                width={450}
                height={450}
                priority 
                className={styles.mainProductImage}
              />
            )}
          </div>
          <div className={styles.thumbnailContainer}>
            {images.map((img: string, idx: number) => (
              <div 
                key={idx}
                className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <Image 
                  src={img} 
                  alt={`${selectedProduct.title} thumbnail ${idx + 1}`} 
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={styles.productInfo}>
          <h1 className={styles.title}>{selectedProduct.title}</h1>
          
          <div className={styles.priceBlock}>
            <span className={styles.currentPrice}>৳{selectedProduct.price}</span>
            {selectedProduct.originalPrice && (
              <>
                <span className={styles.originalPrice}>৳{selectedProduct.originalPrice}</span>
                <span className={styles.discountBadge}>-{discount}%</span>
              </>
            )}
          </div>

          <div className={styles.statusBlock}>
            Stock: <span className={`${styles.stockStatus} ${selectedProduct.stockStatus === 'Out Of Stock' ? styles.outOfStock : ''}`}>
              {selectedProduct.stockStatus}
            </span>
          </div>

          {selectedProduct.callToOrder && (
            <div className={styles.callToOrder}>
              Call to order: <span>{selectedProduct.callToOrder}</span>
            </div>
          )}

          {/* Size Selection Section */}
          {isBedCover && (
            <div className={styles.sizeSelectionBlock}>
              <h3 className={styles.sizeSelectHeading}>প্রোডাক্ট এর সাইজ নির্বাচন করুন</h3>
              <div className={styles.sizeOptionsGrid}>
                {sizeOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.sizeOptionCard} ${selectedProduct.id === opt.id ? styles.activeSizeCard : ''}`}
                    onClick={() => handleSizeSelect(opt)}
                  >
                    <div className={styles.sizeRadioWrapper}>
                      <span className={styles.sizeRadioCircle}>
                        {selectedProduct.id === opt.id && <span className={styles.sizeRadioInnerCircle}></span>}
                      </span>
                      <div className={styles.sizeCardDetails}>
                        <div className={styles.sizeLabel}>{opt.sizeName}</div>
                        <div className={styles.sizePriceRow}>
                          <span className={styles.sizeMrp}>MRP: {opt.originalPrice}৳</span>
                          <span className={styles.sizeDiscountBadge}>{opt.discount}% ছাড়</span>
                        </div>
                        <div className={styles.sizeFinalPrice}>{opt.price}৳</div>
                      </div>
                    </div>
                    {opt.isBestSeller && (
                      <span className={styles.bestSellerBadge}>বেস্ট সেলার</span>
                    )}
                  </div>
                ))}
              </div>
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
                className={styles.buyNowBtn} 
                onClick={handleBuyNow}
                disabled={selectedProduct.stockStatus === 'Out Of Stock'}
                style={{ opacity: selectedProduct.stockStatus === 'Out Of Stock' ? 0.5 : 1, cursor: selectedProduct.stockStatus === 'Out Of Stock' ? 'not-allowed' : 'pointer' }}
              >
                অর্ডার করুন
              </button>
              <button 
                className={styles.addToCartBtn} 
                onClick={handleAddToCart}
                disabled={selectedProduct.stockStatus === 'Out Of Stock'}
                style={{ opacity: selectedProduct.stockStatus === 'Out Of Stock' ? 0.5 : 1, cursor: selectedProduct.stockStatus === 'Out Of Stock' ? 'not-allowed' : 'pointer' }}
                title="Add to Cart"
              >
                <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="white" />
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

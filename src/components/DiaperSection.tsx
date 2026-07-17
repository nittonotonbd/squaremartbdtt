"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import styles from './DiaperSection.module.css';

interface DiaperItem {
  id: string | number;
  title: string;
  price: number;
  imageUrl: string;
}

const mockDiaperProducts: DiaperItem[] = [
  {
    id: "diaper-5pcs",
    title: "৫ পিস রি-ইউজেবল ডায়াপার",
    price: 950,
    imageUrl: "/images/products/diaper1.png"
  },
  {
    id: "diaper-4pcs",
    title: "৪ পিস রি-ইউজেবল ডায়াপার",
    price: 850,
    imageUrl: "/images/products/diaper2.png"
  },
  {
    id: "diaper-3pcs",
    title: "৩ পিস রি-ইউজেবল ডায়াপার",
    price: 550,
    imageUrl: "/images/products/diaper3.png"
  },
  {
    id: "diaper-2pcs",
    title: "২ পিস রি-ইউজেবল ডায়াপার",
    price: 450,
    imageUrl: "/images/products/diaper4.png"
  }
];

export default function DiaperSection() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [diaperProducts, setDiaperProducts] = useState<DiaperItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiapers() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'ডায়াপার')
          .order('price', { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: item.image_url
          }));
          setDiaperProducts(mappedData);
        } else {
          setDiaperProducts(mockDiaperProducts);
        }
      } catch (err) {
        console.error("Error fetching diapers from DB:", err);
        setDiaperProducts(mockDiaperProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchDiapers();
  }, []);

  const handleOrderNow = (diaper: DiaperItem) => {
    addToCart({
      id: diaper.id,
      title: diaper.title,
      price: diaper.price,
      imageUrl: diaper.imageUrl
    });
    router.push('/checkout');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>রি-ইউজেবল ডায়াপার</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>লোডিং হচ্ছে...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {diaperProducts.map((diaper) => (
              <div key={diaper.id} className={styles.card}>
                <Link href={`/product/${diaper.id}`} className={styles.cardLink}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={diaper.imageUrl}
                      alt={diaper.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={styles.image}
                      priority
                    />
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.productTitle}>{diaper.title}</h3>
                    <span className={styles.price}>৳ {diaper.price}</span>
                  </div>
                </Link>
                <button
                  className={styles.orderBtn}
                  onClick={() => handleOrderNow(diaper)}
                >
                  অর্ডার করুন <span className={styles.arrow}>➔</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './not-found.module.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.contentCard}>
          <div className={styles.iconWrapper}>
            🔍
          </div>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>পেজটি খুঁজে পাওয়া যায়নি</h2>
          <p className={styles.description}>
            দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা হয়তো পরিবর্তন করা হয়েছে অথবা মুছে ফেলা হয়েছে। দয়া করে সঠিক লিংকটি আবার চেক করুন অথবা হোমপেজে ফিরে যান।
          </p>
          <div className={styles.btnGroup}>
            <button className={styles.backBtn} onClick={handleGoBack}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              <span>পেছনে যান</span>
            </button>
            <Link href="/" className={styles.homeBtn}>
              <span>হোমপেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

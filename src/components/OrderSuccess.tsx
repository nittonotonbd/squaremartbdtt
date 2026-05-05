"use client";

import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import styles from './OrderSuccess.module.css';

interface OrderSuccessProps {
  orderId: string | number;
  customerName: string;
  totalAmount: number;
}

export default function OrderSuccess({ orderId, customerName, totalAmount }: OrderSuccessProps) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.iconWrapper}>
        <svg className={styles.checkmark} viewBox="0 0 52 52">
          <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
          <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <h1 className={styles.title}>অর্ডার সফল হয়েছে!</h1>
      <p className={styles.message}>
        ধন্যবাদ {customerName}, আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
      </p>

      <div className={styles.orderCard}>
        <div className={styles.orderItem}>
          <span className={styles.label}>Order ID</span>
          <span className={styles.value}>#ORD-{orderId}</span>
        </div>
        <div className={styles.orderItem}>
          <span className={styles.label}>Total Amount</span>
          <span className={styles.value}>{totalAmount} টাকা</span>
        </div>
        <div className={styles.orderItem}>
          <span className={styles.label}>Status</span>
          <span className={styles.value} style={{ color: '#1e8e3e' }}>Pending Confirmation</span>
        </div>
        <div className={styles.orderItem}>
          <span className={styles.label}>Customer</span>
          <span className={styles.value}>{customerName}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/" className={styles.primaryBtn}>
          <HugeiconsIcon icon={Home01Icon} size={20} />
          হোম পেজে ফিরে যান
        </Link>
        <Link href="/" className={styles.secondaryBtn}>
          <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
          আরও কেনাকাটা করুন
        </Link>
      </div>
    </div>
  );
}

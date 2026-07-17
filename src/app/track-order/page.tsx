"use client";

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Calendar03Icon,
  UserIcon,
  Location01Icon,
  PackageIcon,
  CallIcon,
  CreditCardIcon
} from "@hugeicons/core-free-icons";
import styles from './track-order.module.css';
import Image from 'next/image';

interface OrderItem {
  id: number;
  product_title: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  notes: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearched(false);

    const cleanInput = phone.trim();
    if (!cleanInput) {
      setErrorMsg('দয়া করে আপনার মোবাইল নাম্বারটি দিন।');
      return;
    }

    // Basic format validation
    const digitsOnly = cleanInput.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('সঠিক মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    setLoading(true);

    try {
      // Create variations to search
      // e.g. input: 01911940406
      const rawDigits = digitsOnly.startsWith('88') ? digitsOnly.slice(2) : digitsOnly; // e.g. 01911940406
      const standard01 = rawDigits.startsWith('0') ? rawDigits : '0' + rawDigits; // 01911940406
      const rawNoPrefix = standard01.startsWith('0') ? standard01.slice(1) : standard01; // 1911940406
      const phone88 = '88' + standard01; // 8801911940406
      const phonePlus88 = '+88' + standard01; // +8801911940406

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`customer_phone.eq.${cleanInput},customer_phone.eq.${standard01},customer_phone.eq.${rawNoPrefix},customer_phone.eq.${phone88},customer_phone.eq.${phonePlus88}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data as Order[]);
      setSearched(true);
    } catch (err) {
      console.error('Error tracking order:', err);
      setErrorMsg('সার্ভারে সমস্যা হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLower = status.toLowerCase().trim();
    switch (statusLower) {
      case 'new order':
      case 'new':
        return { text: 'অর্ডার পাওয়া গেছে', class: styles.statusNew };
      case 'pending confirmation':
      case 'pending':
        return { text: 'কনফার্মেশনের অপেক্ষায়', class: styles.statusPending };
      case 'processing':
        return { text: 'প্রসেসিং হচ্ছে', class: styles.statusProcessing };
      case 'shipped':
        return { text: 'শিপিং করা হয়েছে', class: styles.statusShipped };
      case 'delivered':
        return { text: 'ডেলিভারি সম্পন্ন', class: styles.statusDelivered };
      case 'cancelled':
      case 'canceled':
        return { text: 'বাতিল করা হয়েছে', class: styles.statusCancelled };
      default:
        return { text: status, class: styles.statusDefault };
    }
  };

  const getPaymentLabel = (payment: string) => {
    const paymentLower = payment.toLowerCase().trim();
    switch (paymentLower) {
      case 'unpaid':
        return { text: 'পরিশোধ করা হয়নি', class: styles.payUnpaid };
      case 'paid':
        return { text: 'পরিশোধিত', class: styles.payPaid };
      default:
        return { text: payment, class: styles.payDefault };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <Header />
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.cardHeader}>
            <h1>অর্ডার ট্র্যাক করুন</h1>
            <p>আপনার মোবাইল নাম্বার দিয়ে অর্ডারের বর্তমান অবস্থা চেক করুন</p>
          </div>

          <form onSubmit={handleTrack} className={styles.trackForm}>
            <div className={styles.inputWrapper}>
              <HugeiconsIcon icon={CallIcon} size={20} className={styles.inputIcon} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="আপনার মোবাইল নাম্বার দিন (যেমন: 019XXXXXXXX)"
                className={styles.inputField}
              />
            </div>
            {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <HugeiconsIcon icon={Search01Icon} size={20} />
                  ট্র্যাক করুন
                </>
              )}
            </button>
          </form>

          {searched && orders && orders.length === 0 && (
            <div className={styles.noOrderAlert}>
              <p>দুঃখিত, এই মোবাইল নাম্বারে কোনো অর্ডার পাওয়া যায়নি। দয়া করে সঠিক মোবাইল নাম্বার দিন।</p>
            </div>
          )}

          {searched && orders && orders.length > 0 && (
            <div className={styles.resultsContainer}>
              <h2 className={styles.resultsTitle}>অর্ডার এর বিবরণ ({orders.length}টি পাওয়া গেছে)</h2>
              {orders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                const paymentInfo = getPaymentLabel(order.payment_status);

                return (
                  <div key={order.id} className={styles.orderCard}>
                    {/* Top Row: ID, Date, Status */}
                    <div className={styles.orderCardHeader}>
                      <div>
                        <span className={styles.orderId}>#ORD-{order.id}</span>
                        <span className={styles.orderDate}>
                          <HugeiconsIcon icon={Calendar03Icon} size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <div className={styles.badgeContainer}>
                        <span className={`${styles.badge} ${statusInfo.class}`}>{statusInfo.text}</span>
                      </div>
                    </div>

                    {/* Delivery & Customer Info */}
                    <div className={styles.orderGrid}>
                      <div className={styles.infoSection}>
                        <h3>
                          <HugeiconsIcon icon={UserIcon} size={16} className={styles.infoIcon} />
                          গ্রাহক তথ্য
                        </h3>
                        <p><strong>নাম:</strong> {order.customer_name}</p>
                        <p><strong>মোবাইল:</strong> {order.customer_phone}</p>
                      </div>

                      <div className={styles.infoSection}>
                        <h3>
                          <HugeiconsIcon icon={Location01Icon} size={16} className={styles.infoIcon} />
                          ডেলিভারি ঠিকানা
                        </h3>
                        <p className={styles.addressText}>{order.address}</p>
                        {order.notes && <p className={styles.notesText}><strong>নোট:</strong> {order.notes}</p>}
                      </div>
                    </div>

                    {/* Product Items */}
                    <div className={styles.itemsSection}>
                      <h3>
                        <HugeiconsIcon icon={PackageIcon} size={16} className={styles.infoIcon} />
                        অর্ডারকৃত পণ্যসমূহ
                      </h3>
                      <div className={styles.itemsList}>
                        {order.order_items && order.order_items.map((item) => (
                          <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemImageWrapper}>
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.product_title}
                                  width={50}
                                  height={50}
                                  className={styles.itemImage}
                                />
                              ) : (
                                <div className={styles.itemPlaceholder}>No Image</div>
                              )}
                            </div>
                            <div className={styles.itemDetails}>
                              <span className={styles.itemTitle}>{item.product_title}</span>
                              <span className={styles.itemQtyPrice}>৳ {item.price} x {item.quantity}</span>
                            </div>
                            <div className={styles.itemTotal}>
                              ৳ {item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className={styles.summarySection}>
                      <div className={styles.paymentInfo}>
                        <HugeiconsIcon icon={CreditCardIcon} size={16} className={styles.infoIcon} />
                        <span>পেমেন্ট স্ট্যাটাস: </span>
                        <span className={`${styles.payStatusText} ${paymentInfo.class}`}>{paymentInfo.text}</span>
                      </div>
                      <div className={styles.pricingSummary}>
                        <div className={styles.priceRow}>
                          <span>উপ-মোট (Subtotal):</span>
                          <span>৳ {order.subtotal || (order.total - (order.shipping_cost || 0))}</span>
                        </div>
                        <div className={styles.priceRow}>
                          <span>ডেলিভারি চার্জ:</span>
                          <span>৳ {order.shipping_cost || 0}</span>
                        </div>
                        <div className={`${styles.priceRow} ${styles.totalRow}`}>
                          <span>সর্বমোট (Total):</span>
                          <span>৳ {order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

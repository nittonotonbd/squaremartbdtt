"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import styles from './checkout.module.css';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const subtotal = getCartTotal();
  const [shippingCost, setShippingCost] = useState(120); // Default to Outside Dhaka
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("আপনার কার্ট খালি!");
      return;
    }
    // Simulate order placement
    alert("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
    clearCart();
    router.push('/');
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.layout}>
          
          {/* Left Column: Form */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              অর্ডারটি কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার, লিখে <strong>অর্ডার কনফার্ম করুন</strong> বাটনে ক্লিক করুন
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>আপনার নাম *</label>
                <input type="text" placeholder="আপনার নাম" required />
              </div>
              
              <div className={styles.formGroup}>
                <label>আপনার মোবাইল নম্বর *</label>
                <input type="tel" placeholder="আপনার মোবাইল নম্বর" required />
              </div>
              
              <div className={styles.formGroup}>
                <label>আপনার সম্পূর্ণ ঠিকানা</label>
                <input type="text" placeholder="আপনার সম্পূর্ণ ঠিকানা" />
              </div>
              
              <div className={styles.formGroup}>
                <label>আপনার মন্তব্য</label>
                <input type="text" placeholder="কালার, সাইজ, অর্ডার অথবা ডেলিভারি সম্পর্কে যে কোন কথা যদি থাকে।" />
              </div>
              
              <div className={styles.formGroup}>
                <label>কুরিয়ার চার্জ</label>
                <div className={styles.radioGroup}>
                  <label className={`${styles.radioOption} ${shippingCost === 120 ? styles.activeRadio : ''}`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="120" 
                      checked={shippingCost === 120} 
                      onChange={() => setShippingCost(120)} 
                    />
                    ঢাকার বাহিরে ১২০ টাকা
                  </label>
                  <label className={`${styles.radioOption} ${shippingCost === 80 ? styles.activeRadio : ''}`}>
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="80" 
                      checked={shippingCost === 80} 
                      onChange={() => setShippingCost(80)} 
                    />
                    ঢাকার ভিতর ৮০ টাকা
                  </label>
                </div>
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                অর্ডার কনফার্ম করুন
              </button>
            </form>
          </div>
          
          {/* Right Column: Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryTable}>
              <div className={styles.tableHeader}>
                <div className={styles.colProduct}>Product</div>
                <div className={styles.colPrice}>Price</div>
                <div className={styles.colQty}>Quantity</div>
                <div className={styles.colTotal}>Total</div>
              </div>
              
              <div className={styles.tableBody}>
                {cartItems.map(item => (
                  <div key={item.id} className={styles.tableRow}>
                    <div className={styles.colProduct}>
                      <div className={styles.itemImage} style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                      <span>{item.title}</span>
                    </div>
                    <div className={styles.colPrice}>{item.price} টাকা</div>
                    <div className={styles.colQty}>
                      <div className={styles.qtyControls}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className={styles.colTotal}>
                      {item.price * item.quantity} টাকা
                      <button type="button" onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                        <HugeiconsIcon icon={Delete01Icon} size={16} color="#aaa" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.totals}>
              <div className={styles.totalsRow}>
                <span>Sub-Total</span>
                <span>{subtotal} টাকা</span>
              </div>
              <div className={styles.totalsRow}>
                <span>Delivery Charges</span>
                <span>{shippingCost} টাকা</span>
              </div>
              <div className={`${styles.totalsRow} ${styles.finalTotal}`}>
                <span>Total Amount</span>
                <span>{total} টাকা</span>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}

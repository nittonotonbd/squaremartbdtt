"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import styles from './checkout.module.css';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { supabase } from '../../lib/supabase';
import { fbqEvent } from '../../lib/metaPixel';


const getBaseTitle = (title: string): string => {
  return title
    .replace(/\s*\(6\/7\s*Feet\)/i, '')
    .replace(/\s*\(7\/8\s*Feet\)/i, '')
    .replace(/\s*\(৬\/৭\s*ফুট\)/i, '')
    .replace(/\s*\(৭\/৮\s*ফুট\)/i, '')
    .trim();
};

const getBaseId = (id: any): string => {
  if (typeof id === 'string' && id.includes('-')) {
    return id.split('-')[0];
  }
  return String(id);
};

const isOptionActive = (itemId: any, optId: any, itemPrice: number, optPrice: number): boolean => {
  if (itemId === optId) return true;
  const cleanItemId = getBaseId(itemId);
  const cleanOptId = getBaseId(optId);
  if (cleanItemId === cleanOptId) {
    return itemPrice === optPrice;
  }
  return false;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, changeCartItemProduct } = useCart();
  const subtotal = getCartTotal();
  const [shippingCost, setShippingCost] = useState(0); // Free Shipping
  const total = subtotal + shippingCost;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitiatedCheckout, setHasInitiatedCheckout] = useState(false);

  // Track InitiateCheckout on page mount once cart items are loaded
  useEffect(() => {
    if (cartItems.length > 0 && !hasInitiatedCheckout) {
      fbqEvent('InitiateCheckout', {
        value: total,
        currency: 'BDT',
        content_type: 'product',
        content_ids: cartItems.map(item => String(item.id)),
        num_items: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      });
      setHasInitiatedCheckout(true);
    }
  }, [cartItems, total, hasInitiatedCheckout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("আপনার কার্ট খালি!");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      customer_name: formData.get('name') as string,
      customer_phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
      shipping_cost: shippingCost,
      subtotal: subtotal,
      total: total,
      status: 'New order',
      payment_status: 'Unpaid'
    };

    setIsSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_title: item.title,
        quantity: item.quantity,
        price: item.price,
        image_url: item.imageUrl
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Add Notification
      const { error: notifyError } = await supabase.from('notifications').insert({
        title: 'New Order Received',
        message: `A new order (#ORD-${order.id}) has been placed by ${orderData.customer_name}.`,
        type: 'success',
        is_read: false
      });

      if (notifyError) {
        console.error('Notification Error:', notifyError);
      }

      // Facebook Pixel Purchase Event
      fbqEvent('Purchase', {
        value: total,
        currency: 'BDT',
        content_type: 'product',
        content_ids: cartItems.map(item => String(item.id)),
        contents: cartItems.map(item => ({
          id: String(item.id),
          quantity: item.quantity,
          price: item.price
        })),
        order_id: String(order.id)
      });

      alert("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");

      clearCart();
      router.push('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert("অর্ডার করার সময় সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
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
                <input type="text" name="name" placeholder="আপনার নাম" required />

              </div>
              
              <div className={styles.formGroup}>
                <label>আপনার মোবাইল নম্বর *</label>
                <input type="tel" name="phone" placeholder="আপনার মোবাইল নম্বর" required />

              </div>
              
              <div className={styles.formGroup}>
                <label>আপনার সম্পূর্ণ ঠিকানা</label>
                <input type="text" name="address" placeholder="আপনার সম্পূর্ণ ঠিকানা" />

              </div>
              
              <div className={styles.formGroup}>
                <label>কালার কোড</label>
                <input type="text" name="notes" placeholder="চাদরের উপরের কোড টা দেন" />
              </div>
              
              <div className={styles.formGroup}>
                <label>ডেলিভারি চার্জ</label>
                <div className={styles.radioGroup}>
                  <div className={`${styles.radioOption} ${styles.activeRadio}`}>
                    <span className={styles.customRadio}></span>
                    <span className={styles.radioText}>ডেলিভারি চার্জ ফ্রি</span>
                  </div>
                </div>
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
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
                {cartItems.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>কার্টে কোন প্রোডাক্ট নেই</div>
                ) : cartItems.map(item => {
                  const isBedCover = item.title.toLowerCase().includes('waterproof') ||
                    item.title.toLowerCase().includes('bed cover') ||
                    item.title.toLowerCase().includes('bedsheet') ||
                    item.title.includes('চাদর') ||
                    item.id === 4 ||
                    item.id === 5 ||
                    String(item.id).includes('6x7') ||
                    String(item.id).includes('7x8');

                  const itemSizeOptions = isBedCover ? [
                    {
                      id: `${getBaseId(item.id)}-6x7`,
                      title: `${getBaseTitle(item.title)} (6/7 Feet)`,
                      price: 1150,
                      sizeName: 'সাইজ, ৬ফুট x ৭ ফুট',
                      imageUrl: item.imageUrl
                    },
                    {
                      id: `${getBaseId(item.id)}-7x8`,
                      title: `${getBaseTitle(item.title)} (7/8 Feet)`,
                      price: 1350,
                      sizeName: 'সাইজ, ৭ফুট x ৮ ফুট',
                      imageUrl: item.imageUrl
                    }
                  ] : [];

                  return (
                    <div key={item.id} className={styles.tableRow}>
                      <div className={styles.rowMainInfo}>
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

                      {isBedCover && (
                        <div className={styles.cartSizeSelectionBlock}>
                          <span className={styles.cartSizeSelectLabel}>সাইজ নির্ধারণ করুন:</span>
                          <div className={styles.cartSizeOptionsGrid}>
                            {itemSizeOptions.map((opt) => {
                              const isActive = isOptionActive(item.id, opt.id, item.price, opt.price);
                              return (
                                <div
                                  key={opt.id}
                                  className={`${styles.cartSizeOptionCard} ${isActive ? styles.cartActiveSizeCard : ''}`}
                                  onClick={() => {
                                    if (!isActive) {
                                      changeCartItemProduct(item.id, {
                                        id: opt.id,
                                        title: opt.title,
                                        price: opt.price,
                                        imageUrl: opt.imageUrl
                                      });
                                    }
                                  }}
                                >
                                  <span className={styles.cartSizeRadioCircle}>
                                    {isActive && <span className={styles.cartSizeRadioInnerCircle}></span>}
                                  </span>
                                  <span className={styles.cartSizeName}>{opt.sizeName}</span>
                                  <span className={styles.cartSizePrice}>{opt.price} টাকা</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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

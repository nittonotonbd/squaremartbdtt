"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import styles from './cart.module.css';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { supabase } from '../../lib/supabase';
import OrderSuccess from '../../components/OrderSuccess';



export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, changeCartItemProduct } = useCart();
  const subtotal = getCartTotal();
  const [shippingCost, setShippingCost] = useState(0); // Free Delivery
  const total = subtotal + shippingCost;

  const sizeOptions = [
    {
      id: 4,
      title: 'Waterproof Bed Cover (6/7 Feet)',
      price: 1090,
      sizeName: 'সাইজ, ৬ফুট x ৭ ফুট',
      imageUrl: 'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.4227430882981412.jpeg'
    },
    {
      id: 5,
      title: 'Waterproof Bed Cover (7/8 Feet)',
      price: 1250,
      sizeName: 'সাইজ, ৭ফুট x ৮ ফুট',
      imageUrl: 'https://ugtzrchkumfbixffhfzz.supabase.co/storage/v1/object/public/products/0.5863508889960549.jpeg'
    }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: any; name: string; total: number } | null>(null);


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
      status: 'Pending',
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



      clearCart();
      setOrderResult({
        id: order.id,
        name: orderData.customer_name,
        total: orderData.total
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {orderResult ? (
          <OrderSuccess 
            orderId={orderResult.id} 
            customerName={orderResult.name} 
            totalAmount={orderResult.total} 
          />
        ) : (
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
                  <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>কার্টে কোন প্রোডাক্ট নেই</div>
                ) : cartItems.map(item => {
                  const isBedCover = item.title.toLowerCase().includes('waterproof bed cover') || item.id === 4 || item.id === 5;
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
                          <span className={styles.cartSizeSelectLabel}>সাইজ পরিবর্তন করুন:</span>
                          <div className={styles.cartSizeOptionsGrid}>
                            {sizeOptions.map((opt) => (
                              <div
                                key={opt.id}
                                className={`${styles.cartSizeOptionCard} ${item.id === opt.id ? styles.cartActiveSizeCard : ''}`}
                                onClick={() => {
                                  if (item.id !== opt.id) {
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
                                  {item.id === opt.id && <span className={styles.cartSizeRadioInnerCircle}></span>}
                                </span>
                                <span className={styles.cartSizeName}>{opt.sizeName}</span>
                                <span className={styles.cartSizePrice}>{opt.price} টাকা</span>
                              </div>
                            ))}
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
        )}
      </main>

      <Footer />
    </>
  );
}

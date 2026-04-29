'use client';

import React from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  CloudUploadIcon,
  Cancel01Icon,
  Tick02Icon,
  ImageAdd01Icon
} from '@hugeicons/core-free-icons';
import styles from '../../Admin.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AddProductPage: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <button 
            onClick={handleBack} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Back to Products
          </button>
          <h1 className={styles.pageTitle}>Add New Product</h1>
          <p className={styles.pageSubtitle}>Create a new product listing for your store.</p>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formLeft}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>General Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Title</label>
              <input type="text" className={styles.input} placeholder="e.g. Premium Wireless Headphones" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea className={styles.textarea} placeholder="Describe your product in detail..."></textarea>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Pricing & Stock</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Regular Price (৳)</label>
                <input type="number" className={styles.input} placeholder="0.00" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sale Price (৳)</label>
                <input type="number" className={styles.input} placeholder="0.00" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Stock Quantity</label>
                <input type="number" className={styles.input} placeholder="0" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>SKU (Optional)</label>
                <input type="text" className={styles.input} placeholder="e.g. SKU-12345" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formRight}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Product Image</h2>
            <div className={styles.uploadArea}>
              <HugeiconsIcon icon={CloudUploadIcon} size={40} />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload or drag & drop</p>
                <p style={{ fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x800px)</p>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Category</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Category</label>
              <select className={styles.select} style={{ width: '100%' }}>
                <option>Select Category</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
                <option>Accessories</option>
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Status</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Visibility</label>
              <select className={styles.select} style={{ width: '100%' }}>
                <option>Published</option>
                <option>Draft</option>
                <option>Hidden</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnGroup}>
        <button className={styles.secondaryBtn} onClick={handleBack}>
          <HugeiconsIcon icon={Cancel01Icon} size={18} style={{ marginRight: '8px' }} />
          Cancel
        </button>
        <button className={styles.primaryBtn}>
          <HugeiconsIcon icon={Tick02Icon} size={18} />
          Save Product
        </button>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;

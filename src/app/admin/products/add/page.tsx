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
import { supabase } from '../../../../lib/supabase';


const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    stock_status: 'In Stock',
    call_to_order: '01942-838348'
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.image_url) {
      alert('Please fill in required fields (Title, Price, Image URL)');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          image_url: formData.image_url,
          stock_status: formData.stock_status,
          call_to_order: formData.call_to_order
        });

      if (error) throw error;

      alert('Product saved successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
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
              <label className={styles.formLabel}>Product Title *</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Premium Wireless Headphones" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Pricing & Stock</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sale Price (৳) *</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Regular Price (৳)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  placeholder="0.00" 
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                />

              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Stock Status</label>
                <select 
                  className={styles.select} 
                  style={{ width: '100%' }}
                  value={formData.stock_status}
                  onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out Of Stock">Out Of Stock</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Call to Order</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="01xxx-xxxxxx" 
                  value={formData.call_to_order}
                  onChange={(e) => setFormData({ ...formData, call_to_order: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>


        <div className={styles.formRight}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Product Image URL *</h2>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="https://example.com/image.png" 
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            {formData.image_url && (
              <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', height: '150px', border: '1px solid var(--border-color)' }}>
                <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
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
        <button className={styles.primaryBtn} onClick={handleSave} disabled={loading}>
          <HugeiconsIcon icon={Tick02Icon} size={18} />
          <span>{loading ? 'Saving...' : 'Save Product'}</span>
        </button>

      </div>
    </AdminLayout>
  );
};

export default AddProductPage;

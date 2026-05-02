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
import Image from 'next/image';


const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    gallery_images: ['', '', '', ''],
    category: '',
    stock_status: 'In Stock',
    call_to_order: '01887245556'
  });
  const [uploadingIndex, setUploadingIndex] = React.useState<number | null>(null);

  const handleFileUpload = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const newGallery = [...formData.gallery_images];
      newGallery[index] = publicUrl;
      
      setFormData({ 
        ...formData, 
        gallery_images: newGallery,
        // If it's the first slot or image_url is empty, set it
        image_url: index === 0 ? publicUrl : (formData.image_url || publicUrl)
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to upload image: ${errorMessage}`);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price || (!formData.image_url && !formData.gallery_images[0]) || !formData.category) {
      alert('Please fill in required fields (Title, Price, at least one image, Category)');
      return;
    }

    setLoading(true);
    try {
      const activeGallery = formData.gallery_images.filter(img => img !== '');
      const slug = generateSlug(formData.title);
      
      const { error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          slug: slug, // Added slug
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          image_url: formData.image_url || activeGallery[0],
          gallery_images: activeGallery,
          category: formData.category,
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Back to Products
          </button>
          <h1 className={styles.pageTitle}>Add New Product</h1>
          <p className={styles.pageSubtitle}>Create a new product listing for your store.</p>
        </div>
        <div className={`${styles.headerActions} ${styles.hideOnMobile}`}>
          <button className={styles.secondaryBtn} onClick={handleBack}>
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
            <span>Cancel</span>
          </button>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading || uploadingIndex !== null}>
            <HugeiconsIcon icon={Tick02Icon} size={18} />
            <span>{loading ? 'Saving...' : uploadingIndex !== null ? 'Uploading...' : 'Save Product'}</span>
          </button>
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
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Product Gallery (Up to 4 images) *</h2>
            
            <div className={styles.galleryGrid}>
              {formData.gallery_images.map((img, index) => (
                <div 
                  key={index}
                  className={styles.smallUploadArea}
                  style={{ position: 'relative', overflow: 'hidden' }}
                  onClick={() => !uploadingIndex && document.getElementById(`fileInput-${index}`)?.click()}
                >
                  <input 
                    type="file" 
                    id={`fileInput-${index}`} 
                    hidden 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleFileUpload(file, index);
                    }}
                  />
                  
                  {uploadingIndex === index ? (
                    <div style={{ textAlign: 'center' }}>
                      <div className={styles.loader} style={{ width: '20px', height: '20px', marginBottom: '8px' }}></div>
                      <p style={{ fontSize: '10px' }}>Uploading...</p>
                    </div>
                  ) : img ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Image 
                        src={img} 
                        alt={`Gallery ${index}`} 
                        width={150}
                        height={120}
                        className={styles.galleryImagePreview}
                      />
                      <button 
                        className={styles.removeImageBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGallery = [...formData.gallery_images];
                          newGallery[index] = '';
                          setFormData({ ...formData, gallery_images: newGallery });
                        }}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} color="#ef4444" />
                      </button>
                      {index === 0 && (
                        <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'var(--primary-color)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          Main
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <HugeiconsIcon icon={ImageAdd01Icon} size={24} color="var(--text-light)" />
                      <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-gray)' }}>{index === 0 ? 'Main Image' : `Image ${index + 1}`}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
              Tip: The first image will be used as the primary product image.
            </p>
          </div>


          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Category</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Category *</label>
              <select 
                className={styles.select} 
                style={{ width: '100%' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Offer Product">Offer Product</option>
                <option value="Baby & Toys">Baby & Toys</option>
                <option value="Laptop Stands">Laptop Stands</option>
                <option value="Islamic Items">Islamic Items</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Daily Life Products">Daily Life Products</option>
                <option value="Kitchen Gloves">Kitchen Gloves</option>
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

      <div className={`${styles.btnGroup} ${styles.hideOnDesktop}`}>
        <button className={styles.secondaryBtn} onClick={handleBack}>
          <HugeiconsIcon icon={Cancel01Icon} size={18} style={{ marginRight: '8px' }} />
          Cancel
        </button>
        <button className={styles.primaryBtn} onClick={handleSave} disabled={loading || uploadingIndex !== null}>
          <HugeiconsIcon icon={Tick02Icon} size={18} />
          <span>{loading ? 'Saving...' : uploadingIndex !== null ? 'Uploading...' : 'Save Product'}</span>
        </button>

      </div>
    </AdminLayout>
  );
};

export default AddProductPage;

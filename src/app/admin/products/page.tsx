'use client';

import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  HugeiconsIcon 
} from '@hugeicons/react';
import { 
  Add01Icon, 
  PencilEdit01Icon, 
  Delete02Icon, 
  Search01Icon,
  FilterIcon,
  MoreHorizontalIcon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';
import { mockProducts } from '../../../data/products';
import Link from 'next/link';
import Image from 'next/image';

const AdminProductsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products Management</h1>
          <p className={styles.pageSubtitle}>Manage your inventory, prices, and product details.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/products/add" className={styles.primaryBtn}>
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <HugeiconsIcon icon={Search01Icon} size={18} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search products by name, SKU..." 
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <select className={styles.select}>
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Living</option>
          </select>
          <select className={styles.select}>
            <option>Stock Status</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productInfoCell}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className={styles.productThumb}
                      />
                      <span className={styles.productName}>{product.title}</span>
                    </div>
                  </td>
                  <td>Electronics</td>
                  <td>৳{product.price}</td>
                  <td>124</td>
                  <td>
                    <span className={`${styles.status} ${product.stockStatus === 'In Stock' ? styles.statusSuccess : styles.statusPending}`}>
                      {product.stockStatus}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit">
                        <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete">
                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
            Showing 1 to {mockProducts.length} of {mockProducts.length} entries
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={styles.select} disabled>Previous</button>
            <button className={styles.select} style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderColor: 'var(--primary-color)' }}>1</button>
            <button className={styles.select}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;

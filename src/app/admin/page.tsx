'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ShoppingBag01Icon, 
  UserGroupIcon, 
  Dollar01Icon,
  ViewIcon,
  ArrowRight01Icon,
  Search01Icon,
  ChartLineData01Icon
} from '@hugeicons/core-free-icons';
import styles from './Admin.module.css';
import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation';

const mockRecentOrders = [
  { id: '#ORD-7342', customer: 'Alex Johnson', product: 'Premium Wireless Headphones', amount: '$299.00', status: 'Delivered' },
  { id: '#ORD-7341', customer: 'Sarah Miller', product: 'Smart Watch Series 5', amount: '$199.00', status: 'Processing' },
  { id: '#ORD-7340', customer: 'James Wilson', product: 'Leather Laptop Bag', amount: '$149.00', status: 'Delivered' },
  { id: '#ORD-7339', customer: 'Emily Brown', product: 'Mechanical Keyboard', amount: '$129.00', status: 'Processing' },
  { id: '#ORD-7338', customer: 'Michael Chen', product: 'USB-C Docking Station', amount: '$89.00', status: 'Delivered' },
];

const AdminDashboard: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Sync search with URL
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredOrders = mockRecentOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryBtn}>
            <HugeiconsIcon icon={ChartLineData01Icon} size={20} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Total Revenue" 
          value="$128,430" 
          icon={Dollar01Icon} 
          trend="+12.5%" 
          trendUp={true} 
          color="#ff5a00" 
        />
        <StatCard 
          label="Total Orders" 
          value="1,420" 
          icon={ShoppingBag01Icon} 
          trend="+8.2%" 
          trendUp={true} 
          color="#3b82f6" 
        />
        <StatCard 
          label="Total Users" 
          value="8,920" 
          icon={UserGroupIcon} 
          trend="+5.1%" 
          trendUp={true} 
          color="#10b981" 
        />
        <StatCard 
          label="Product Views" 
          value="45,210" 
          icon={ViewIcon} 
          trend="-2.4%" 
          trendUp={false} 
          color="#8b5cf6" 
        />
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.section} style={{ flex: 2 }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <Link href="/admin/orders" className={styles.viewAllLink} style={{ color: 'var(--primary-color)', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>
          
          <div className={styles.filterBar} style={{ padding: '0', background: 'transparent', border: 'none', marginBottom: '16px' }}>
            <div className={styles.searchContainer} style={{ width: '100%' }}>
              <HugeiconsIcon icon={Search01Icon} size={18} color="var(--text-light)" />
              <input 
                type="text" 
                placeholder="Search recent orders..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`${styles.status} ${order.status === 'Delivered' ? styles.statusSuccess : styles.statusPending}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                      No orders found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} style={{ flex: 1 }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sales Analytics</h2>
          </div>
          
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${height}%`, 
                    backgroundColor: i === 3 ? 'var(--primary-color)' : 'rgba(255, 90, 0, 0.1)', 
                    borderRadius: '4px',
                    transition: 'all 0.3s'
                  }} 
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { name: 'Electronics', value: 45, color: '#ff5a00' },
              { name: 'Fashion', value: 30, color: '#3b82f6' },
              { name: 'Home & Living', value: 15, color: '#10b981' },
              { name: 'Accessories', value: 10, color: '#8b5cf6' }
            ].map((cat) => (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--text-gray)' }}>{cat.value}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-light)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.value}%`, height: '100%', backgroundColor: cat.color, borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

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
import { supabase } from '../../lib/supabase';


interface RecentOrder {
  id: string;
  customer_name: string;
  product: string;
  amount: string;
  status: string;
}


const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    views: 45210 // Placeholder
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders and Statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // 2. Fetch Products Count
      const { count: productCount, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productError) throw productError;

      // Calculate stats
      const revenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.total : 0), 0);
      
      setStats({
        revenue,
        orders: orders.length,
        products: productCount || 0,
        views: 45210
      });

      // Format recent orders
      const formattedRecent: RecentOrder[] = orders.slice(0, 5).map(o => ({
        id: `#ORD-${o.id}`,
        customer_name: o.customer_name,
        product: 'N/A', // We'd need to fetch order_items to get first product
        amount: `৳${o.total.toLocaleString()}`,
        status: o.status
      }));

      // Fetch first product for each recent order
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, product_title')
        .in('order_id', orders.slice(0, 5).map(o => o.id));

      if (!itemsError && items) {
        formattedRecent.forEach(ro => {
          const item = items.find(i => `#ORD-${i.order_id}` === ro.id);
          if (item) ro.product = item.product_title;
        });
      }

      setRecentOrders(formattedRecent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sync search with URL
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredOrders = recentOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          value={`৳${stats.revenue.toLocaleString()}`} 
          icon={Dollar01Icon} 
          trend="" 
          trendUp={true} 
          color="#ff5a00" 
        />
        <StatCard 
          label="Total Orders" 
          value={stats.orders.toString()} 
          icon={ShoppingBag01Icon} 
          trend="" 
          trendUp={true} 
          color="#3b82f6" 
        />
        <StatCard 
          label="Total Products" 
          value={stats.products.toString()} 
          icon={ShoppingBag01Icon} 
          trend="" 
          trendUp={true} 
          color="#10b981" 
        />
        <StatCard 
          label="Product Views" 
          value={stats.views.toLocaleString()} 
          icon={ViewIcon} 
          trend="" 
          trendUp={true} 
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
                    <tr 
                      key={order.id} 
                      onClick={() => router.push(`/admin/orders?id=${order.id.replace('#ORD-', '')}`)}
                      style={{ cursor: 'pointer' }}
                      className={styles.hoverRow}
                    >
                      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{order.id}</td>
                      <td>{order.customer_name}</td>
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

'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
import SalesAnalytics from '../../components/admin/SalesAnalytics';

import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { StatCardSkeleton, TableRowSkeleton } from '../../components/admin/Skeleton';


interface RecentOrder {
  id: string;
  customer_name: string;
  product: string;
  amount: string;
  status: string;
}


const AdminDashboardContent: React.FC = () => {
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
          <button 
            className={styles.primaryBtn}
            onClick={() => router.push('/admin/reports')}
          >
            <HugeiconsIcon icon={ChartLineData01Icon} size={20} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={5} />
                  ))
                ) : filteredOrders.length > 0 ? (
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

          <div className={styles.mobileOrderList}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.orderCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: '80px', height: '16px', background: 'var(--bg-light)', borderRadius: '4px' }}></div>
                    <div style={{ width: '60px', height: '16px', background: 'var(--bg-light)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ height: '32px', background: 'var(--bg-light)', borderRadius: '4px' }}></div>
                    <div style={{ height: '32px', background: 'var(--bg-light)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className={styles.orderCard}
                  onClick={() => router.push(`/admin/orders?id=${order.id.replace('#ORD-', '')}`)}
                >
                  <div className={styles.orderCardHeader}>
                    <span className={styles.orderCardId}>{order.id}</span>
                    <span className={`${styles.status} ${order.status === 'Delivered' ? styles.statusSuccess : styles.statusPending}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderCardBody}>
                    <div className={styles.orderCardItem}>
                      <h4>Customer</h4>
                      <p>{order.customer_name}</p>
                    </div>
                    <div className={styles.orderCardItem}>
                      <h4>Amount</h4>
                      <p>{order.amount}</p>
                    </div>
                  </div>
                  <div className={styles.orderCardItem} style={{ marginTop: '4px' }}>
                    <h4>Product</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '13px' }}>{order.product}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                No orders found.
              </div>
            )}
          </div>
        </section>

        <SalesAnalytics />
      </div>
    </AdminLayout>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-gray)' }}>
          <div className={styles.loader} style={{ margin: '0 auto 20px', width: '32px', height: '32px' }}></div>
          <p>Loading Dashboard...</p>
        </div>
      </AdminLayout>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
};

export default AdminDashboard;

'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatCard from '../../../components/admin/StatCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ChartLineData01Icon,
  Download01Icon,
  Calendar01Icon,
  Dollar01Icon,
  ShoppingBag01Icon,
  UserGroupIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';
import { supabase } from '../../../lib/supabase';
import { StatCardSkeleton } from '../../../components/admin/Skeleton';
import SalesAnalytics from '../../../components/admin/SalesAnalytics';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 3.2, // Mock
    customerGrowth: 12.5 // Mock
  });

  const [topProducts, setTopProducts] = useState([
    { name: 'Smartphone X1', sales: 124, revenue: 154800, growth: 12 },
    { name: 'Wireless Earbuds', sales: 89, revenue: 44500, growth: -5 },
    { name: 'Smart Watch Pro', sales: 67, revenue: 134000, growth: 18 },
    { name: 'Laptop Air 13', sales: 45, revenue: 405000, growth: 8 },
    { name: 'Power Bank 20k', sales: 156, revenue: 31200, growth: 22 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('total, status');

        if (error) throw error;

        const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.total : 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats(prev => ({
          ...prev,
          totalRevenue,
          totalOrders,
          avgOrderValue
        }));
      } catch (error) {
        console.error('Error fetching reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    // Prepare data for CSV
    const rows = [
      ['Report', 'Business Analytics - SquareMart'],
      ['Date', new Date().toLocaleDateString()],
      [''],
      ['Summary Metrics'],
      ['Metric', 'Value'],
      ['Total Revenue', `৳${stats.totalRevenue}`],
      ['Total Orders', stats.totalOrders],
      ['Average Order Value', `৳${Math.round(stats.avgOrderValue)}`],
      ['Conversion Rate', `${stats.conversionRate}%`],
      ['Customer Growth', `${stats.customerGrowth}%`],
      [''],
      ['Top Selling Products'],
      ['Product Name', 'Sales Volume', 'Total Revenue', 'Monthly Growth'],
      ...topProducts.map(p => [p.name, `${p.sales} units`, `৳${p.revenue}`, `${p.growth}%`])
    ];

    // Convert to CSV string
    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    // Create download link and trigger click
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SquareMart_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Business Reports</h1>
          <p className={styles.pageSubtitle}>Detailed insights into your store's performance and growth.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.select} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <HugeiconsIcon icon={Calendar01Icon} size={18} />
            <span>Last 30 Days</span>
          </div>
          <button 
            className={styles.primaryBtn} 
            style={{ background: 'var(--bg-white)', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}
            onClick={handleExportCSV}
          >
            <HugeiconsIcon icon={Download01Icon} size={20} />
            <span>Export CSV</span>
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
              value={`৳${stats.totalRevenue.toLocaleString()}`} 
              icon={Dollar01Icon} 
              trend="+12.5%" 
              trendUp={true} 
              color="#ff5a00" 
            />
            <StatCard 
              label="Average Order Value" 
              value={`৳${Math.round(stats.avgOrderValue).toLocaleString()}`} 
              icon={ShoppingBag01Icon} 
              trend="+4.2%" 
              trendUp={true} 
              color="#3b82f6" 
            />
            <StatCard 
              label="Conversion Rate" 
              value={`${stats.conversionRate}%`} 
              icon={ChartLineData01Icon} 
              trend="-0.5%" 
              trendUp={false} 
              color="#10b981" 
            />
            <StatCard 
              label="Customer Growth" 
              value={`${stats.customerGrowth}%`} 
              icon={UserGroupIcon} 
              trend="+18.2%" 
              trendUp={true} 
              color="#8b5cf6" 
            />
          </>
        )}
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.section} style={{ flex: 2 }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Revenue Growth</h2>
            <div className={styles.headerActions}>
               <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }}></div> Current Period
               </span>
               <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 90, 0, 0.1)' }}></div> Previous Period
               </span>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%', position: 'relative', marginTop: '20px' }}>
            {/* Mock Chart Visualization */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 10px' }}>
              {[35, 45, 30, 60, 55, 80, 70, 90, 85, 100, 95, 110].map((h, i) => (
                <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: `${(h / 120) * 100}%`, 
                      background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(255, 90, 0, 0.1) 100%)', 
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 1s ease-out',
                    }} 
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '8px' }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Grid Lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '100%', borderBottom: '1px dashed var(--border-color)', height: 0 }} />
              ))}
            </div>
          </div>
        </section>

        <div style={{ flex: 1 }}>
          <SalesAnalytics />
          
          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255, 90, 0, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 90, 0, 0.1)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <HugeiconsIcon icon={InformationCircleIcon} size={20} color="var(--primary-color)" />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>Optimization Tip</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.5' }}>
                  Your conversion rate is 5% higher on weekends. Consider running special promotions from Friday to Sunday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section} style={{ marginTop: '24px' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top Selling Products</h2>
          <button 
            className={styles.viewAllLink} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={handleExportCSV}
          >
            Download Report
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Sales Volume</th>
                <th>Total Revenue</th>
                <th>Monthly Growth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '600' }}>{product.name}</td>
                  <td>{product.sales} units</td>
                  <td>৳{product.revenue.toLocaleString()}</td>
                  <td>
                    <span style={{ color: product.growth > 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      {product.growth > 0 ? <HugeiconsIcon icon={ArrowUp01Icon} size={14} /> : <HugeiconsIcon icon={ArrowDown01Icon} size={14} />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles.statusSuccess}`}>Trending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;

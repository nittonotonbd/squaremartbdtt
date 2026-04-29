'use client';

import React, { useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSearchParams } from 'next/navigation';
import { 
  Search01Icon, 
  FilterIcon, 
  ViewIcon,
  Download01Icon,
  MoreHorizontalIcon,
  ShoppingBag01Icon,
  Tick02Icon,
  Clock01Icon,
  Cancel01Icon,
  QrCode01Icon,
  Edit01Icon,
  PrinterIcon,
  Mail01Icon,
  Delete02Icon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';
import StatCard from '../../../components/admin/StatCard';
import { Dollar01Icon, ShoppingBagIcon } from '@hugeicons/core-free-icons';

const mockOrders = [
  { id: '#ORD-7342', customer: 'Alex Johnson', date: '2024-04-29', amount: '৳2,450', status: 'Delivered', payment: 'Paid' },
  { id: '#ORD-7341', customer: 'Sarah Miller', date: '2024-04-29', amount: '৳1,200', status: 'Processing', payment: 'Paid' },
  { id: '#ORD-7340', customer: 'James Wilson', date: '2024-04-28', amount: '৳850', status: 'Shipped', payment: 'Paid' },
  { id: '#ORD-7339', customer: 'Emily Brown', date: '2024-04-28', amount: '৳3,100', status: 'Pending', payment: 'Unpaid' },
  { id: '#ORD-7338', customer: 'Michael Chen', date: '2024-04-27', amount: '৳1,500', status: 'Delivered', payment: 'Paid' },
  { id: '#ORD-7337', customer: 'Sophia Garcia', date: '2024-04-27', amount: '৳950', status: 'Cancelled', payment: 'Refunded' },
  { id: '#ORD-7336', customer: 'David Lee', date: '2024-04-26', amount: '৳2,100', status: 'Delivered', payment: 'Paid' },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Delivered': return styles.statusSuccess;
    case 'Pending': return styles.statusPending;
    case 'Processing': return styles.statusProcessing;
    case 'Cancelled': return styles.statusCancelled;
    case 'Shipped': return styles.statusShipped;
    default: return '';
  }
};

const AdminOrdersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [orders, setOrders] = React.useState(mockOrders);
  const [filterStatus, setFilterStatus] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>(searchParams.get('q') || '');
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = React.useState<string>('');
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  // Sync search with URL
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setUpdatingStatus('');
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder || !updatingStatus) return;
    
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id ? { ...order, status: updatingStatus } : order
    );
    
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status: updatingStatus });
    alert(`Order ${selectedOrder.id} status updated to ${updatingStatus}`);
  };

  const handleCancelOrder = (id: string) => {
    if (confirm(`Are you sure you want to cancel order ${id}?`)) {
      const updatedOrders = orders.map(order => 
        order.id === id ? { ...order, status: 'Cancelled' } : order
      );
      setOrders(updatedOrders);
      alert(`Order ${id} has been cancelled.`);
    }
  };

  const handlePrintInvoice = (order: any) => {
    const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
    if (!invoiceWindow) return;

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ff5a00; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; color: #ff5a00; }
            .invoice-info { text-align: right; }
            .details { display: flex; justify-content: space-between; margin-top: 40px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { text-align: left; background: #f9f9f9; padding: 12px; border-bottom: 1px solid #eee; }
            .table td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 40px; text-align: right; }
            .totals div { margin-bottom: 10px; font-size: 14px; }
            .grand-total { font-size: 20px; font-weight: 800; color: #ff5a00; border-top: 1px solid #eee; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SquareMart</div>
            <div class="invoice-info">
              <h2 style="margin: 0;">INVOICE</h2>
              <p>Order ID: ${order.id}</p>
              <p>Date: ${order.date}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <h4 style="color: #666; margin-bottom: 10px;">BILL TO:</h4>
              <p><strong>${order.customer}</strong></p>
              <p>123 Green Road, Dhanmondi</p>
              <p>Dhaka, Bangladesh</p>
              <p>Phone: +880 1712-345678</p>
            </div>
            <div style="text-align: right;">
              <h4 style="color: #666; margin-bottom: 10px;">PAYMENT:</h4>
              <p>Method: Online Payment</p>
              <p>Status: ${order.payment}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Premium Wireless Headphones</td>
                <td>1</td>
                <td>${order.amount}</td>
                <td>${order.amount}</td>
              </tr>
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ${order.amount}</div>
            <div>Shipping: ৳60</div>
            <div class="grand-total">Grand Total: ${order.amount}</div>
          </div>
          <div style="margin-top: 60px; text-align: center; color: #999; font-size: 12px;">
            Thank you for shopping with SquareMart!
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const handleExportCSV = () => {
    // CSV Headers
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Payment Status', 'Order Status'];
    
    // Format rows
    const rows = filteredOrders.map(order => [
      order.id,
      order.customer,
      order.date,
      order.amount.replace('৳', ''), // Remove currency symbol for Excel
      order.payment,
      order.status
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `squaremart-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeOrderDetail}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.sectionTitle}>Order Details: {selectedOrder.id}</h2>
              <button className={styles.iconBtn} onClick={closeOrderDetail}>
                <HugeiconsIcon icon={Cancel01Icon} size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div className={styles.detailsGrid} style={{ flex: 1, marginBottom: 0 }}>
                  <div className={styles.detailItem}>
                    <h4>Customer Info</h4>
                    <p>{selectedOrder.customer}</p>
                    <p style={{ fontWeight: '400', fontSize: '14px', color: 'var(--text-gray)' }}>alex.johnson@example.com</p>
                    <p style={{ fontWeight: '400', fontSize: '14px', color: 'var(--text-gray)' }}>+880 1712-345678</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Shipping Address</h4>
                    <p style={{ fontWeight: '400', fontSize: '14px' }}>
                      123 Green Road, Dhanmondi<br />
                      Dhaka, Bangladesh
                    </p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Payment Status</h4>
                    <p>{selectedOrder.payment}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Order Status</h4>
                    <span className={`${styles.status} ${getStatusClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className={styles.qrCodeContainer}>
                  <div className={styles.qrPlaceholder}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedOrder.id)}`} 
                      alt="QR Code"
                      style={{ width: '100%', height: '100%', padding: '4px' }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-light)' }}>SCAN ORDER</span>
                </div>
              </div>

              <div className={styles.orderItemsTable}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px' }}>ORDER ITEMS</h4>
                <div className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <div className={styles.productThumb} style={{ width: '50px', height: '50px' }}></div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>Premium Wireless Headphones</span>
                      <span className={styles.itemMeta}>Color: Black | SKU: HE-001</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>৳2,450</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Qty: 1</div>
                  </div>
                </div>
              </div>

              <div className={styles.summarySection}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{selectedOrder.amount}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping Fee</span>
                  <span>৳60</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Discount</span>
                  <span style={{ color: '#ef4444' }}>-৳0</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Grand Total</span>
                  <span>{selectedOrder.amount}</span>
                </div>
              </div>

              <div className={styles.minimalSection}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Update Order Status</h4>
                <div className={styles.statusToggleGroup}>
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      className={`${styles.statusToggleButton} ${(updatingStatus || selectedOrder.status) === status ? styles.statusToggleButtonActive : ''}`}
                      onClick={() => setUpdatingStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {updatingStatus && updatingStatus !== selectedOrder.status && (
                  <button 
                    className={styles.primaryBtn} 
                    style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
                    onClick={handleStatusUpdate}
                  >
                    Confirm Status Change
                  </button>
                )}
              </div>

              <div className={styles.btnGroup} style={{ marginTop: '32px', borderTop: '1px solid var(--bg-light)', paddingTop: '20px' }}>
                <button className={styles.secondaryBtn} onClick={closeOrderDetail} style={{ width: '100%', justifyContent: 'center' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders Management</h1>
          <p className={styles.pageSubtitle}>
            {filterStatus === 'All' 
              ? "Track and manage your customer orders and shipments." 
              : `Showing ${filterStatus} orders.`}
          </p>
        </div>
        <div className={styles.headerActions}>
          {filterStatus !== 'All' && (
            <button className={styles.secondaryBtn} onClick={() => setFilterStatus('All')}>
              Show All Orders
            </button>
          )}
          <button className={styles.secondaryBtn} onClick={handleExportCSV}>
            <HugeiconsIcon icon={Download01Icon} size={20} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard 
          label="Pending Orders" 
          value="1" 
          icon={Clock01Icon} 
          trend="+2" 
          trendUp={true} 
          color="#f59e0b" 
          onClick={() => setFilterStatus('Pending')}
        />
        <StatCard 
          label="Completed Orders" 
          value="1,120" 
          icon={Tick02Icon} 
          trend="+45" 
          trendUp={true} 
          color="#10b981" 
          onClick={() => setFilterStatus('Delivered')}
        />
        <StatCard 
          label="Total Revenue" 
          value="৳42,890" 
          icon={Dollar01Icon} 
          trend="+12%" 
          trendUp={true} 
          color="#ff5a00" 
        />
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <HugeiconsIcon icon={Search01Icon} size={18} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select 
            className={styles.select} 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select className={styles.select}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td 
                      style={{ fontWeight: '600', color: 'var(--primary-color)', cursor: 'pointer' }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      {order.id}
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{order.payment}</span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns} style={{ position: 'relative' }}>
                        <button 
                          className={styles.actionBtn} 
                          title="View Details"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <HugeiconsIcon icon={ViewIcon} size={18} />
                        </button>
                        <button 
                          className={styles.actionBtn} 
                          title="More Actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === order.id ? null : order.id);
                          }}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                        </button>

                        {activeMenu === order.id && (
                          <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                            <button 
                              className={styles.actionDropdownItem}
                              onClick={() => {
                                setSelectedOrder(order);
                                setActiveMenu(null);
                              }}
                            >
                              <HugeiconsIcon icon={Edit01Icon} size={16} />
                              <span>Edit Order</span>
                            </button>
                            <button 
                              className={styles.actionDropdownItem}
                              onClick={() => {
                                handlePrintInvoice(order);
                                setActiveMenu(null);
                              }}
                            >
                              <HugeiconsIcon icon={PrinterIcon} size={16} />
                              <span>Print Invoice</span>
                            </button>
                            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                            <button 
                              className={`${styles.actionDropdownItem} ${styles.actionDropdownItemDanger}`}
                              onClick={() => {
                                handleCancelOrder(order.id);
                                setActiveMenu(null);
                              }}
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={16} />
                              <span>Cancel Order</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    No {filterStatus} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
            Showing {filteredOrders.length} of {orders.length} orders
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

export default AdminOrdersPage;

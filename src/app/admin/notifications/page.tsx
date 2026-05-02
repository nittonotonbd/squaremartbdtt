'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Notification01Icon, 
  Delete02Icon, 
  Tick02Icon, 
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  AlertCircleIcon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Skeleton from '../../../components/admin/Skeleton';


interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#10b981" />;
      case 'warning': return <HugeiconsIcon icon={Alert01Icon} size={20} color="#f59e0b" />;
      case 'error': return <HugeiconsIcon icon={AlertCircleIcon} size={20} color="#ef4444" />;
      default: return <HugeiconsIcon icon={InformationCircleIcon} size={20} color="#3b82f6" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {

    if (n.title.includes('New Order')) {
      const match = n.message.match(/#ORD-(\d+)/);
      if (match && match[1]) {
        router.push(`/admin/orders?id=${match[1]}`);
      }
    }
    if (!n.is_read) markAsRead(n.id);
  };

  return (

    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <p className={styles.pageSubtitle}>Stay updated with latest store activities and alerts.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={fetchNotifications}>
            Refresh
          </button>
        </div>
      </div>

      <div className={styles.section}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.formSection} style={{ margin: 0, padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Skeleton width={24} height={24} circle />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="30%" height={18} style={{ marginBottom: '8px' }} />
                    <Skeleton width="60%" height={14} style={{ marginBottom: '8px' }} />
                    <Skeleton width="20%" height={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={styles.formSection} 
                onClick={() => handleNotificationClick(n)}
                style={{ 
                  margin: 0, 
                  padding: '16px 20px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  opacity: n.is_read ? 0.7 : 1,
                  borderLeft: n.is_read ? '1px solid var(--border-color)' : '4px solid var(--primary-color)'
                }}
              >

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '4px' }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-dark)' }}>{n.title}</h4>
                    <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-gray)' }}>{n.message}</p>
                    <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={styles.actionBtns}>
                  {!n.is_read && (
                    <button 
                      className={styles.actionBtn} 
                      title="Mark as read"
                      onClick={() => markAsRead(n.id)}
                    >
                      <HugeiconsIcon icon={Tick02Icon} size={18} />
                    </button>
                  )}
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                    title="Delete"
                    onClick={() => deleteNotification(n.id)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.formSection} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-gray)' }}>
            <HugeiconsIcon icon={Notification01Icon} size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;

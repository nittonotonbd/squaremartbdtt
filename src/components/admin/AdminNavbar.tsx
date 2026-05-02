'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Search01Icon, 
  Notification01Icon, 
  Settings01Icon,
  Menu01Icon

} from '@hugeicons/core-free-icons';
import styles from '../../app/admin/Admin.module.css';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';



interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminUser, setAdminUser] = useState({
    name: 'Admin',
    role: 'Staff',
    avatar: 'A'
  });


  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('q', searchValue);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (!error) setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to fetch from profiles table first
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setAdminUser({
            name: profile.full_name || user.email?.split('@')[0] || 'Admin',
            role: profile.role || 'Super Admin',
            avatar: (profile.full_name?.[0] || user.email?.[0] || 'A').toUpperCase()
          });
        } else {
          // Fallback to auth metadata or email
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
          setAdminUser({
            name: name,
            role: user.user_metadata?.role || 'Super Admin',
            avatar: name[0].toUpperCase()
          });
        }
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchAdminProfile();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);


  return (
    <header className={styles.navbar}>
      <button className={styles.hamburger} onClick={onMenuClick}>
        <HugeiconsIcon icon={Menu01Icon} size={24} />
      </button>
      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <HugeiconsIcon icon={Search01Icon} size={18} color="var(--text-light)" />
        <input 
          type="text" 
          placeholder="Search for orders, products..." 
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>

      <div className={styles.navbarActions}>
        <Link href="/admin/notifications" className={styles.iconBtn}>
          <HugeiconsIcon icon={Notification01Icon} size={20} />
          {unreadCount > 0 && (
            <span className={styles.badge} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', minWidth: '16px', height: '16px', padding: '0 4px' }}>
              {unreadCount}
            </span>
          )}

        </Link>


        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{adminUser.avatar}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{adminUser.name}</span>
            <span className={styles.userRole}>{adminUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

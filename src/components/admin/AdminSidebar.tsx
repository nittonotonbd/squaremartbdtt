'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DashboardSquare01Icon, 
  PackageIcon, 
  ShoppingBasket01Icon, 
  UserGroupIcon, 
  Settings02Icon,
  Store01Icon,
  Notification01Icon,
  Logout01Icon


} from '@hugeicons/core-free-icons';
import styles from '../../app/admin/Admin.module.css';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';


const navItems = [
  { name: 'Dashboard', icon: DashboardSquare01Icon, href: '/admin' },
  { name: 'Products', icon: PackageIcon, href: '/admin/products' },
  { name: 'Orders', icon: ShoppingBasket01Icon, href: '/admin/orders' },
  { name: 'Notifications', icon: Notification01Icon, href: '/admin/notifications' },
  { name: 'Users', icon: UserGroupIcon, href: '/admin/users' },
  { name: 'Settings', icon: Settings02Icon, href: '/admin/settings' },

];

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };


  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarMobileOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.avatar}>
          <HugeiconsIcon icon={Store01Icon} size={24} color="white" />
        </div>
        <span className={styles.logoText}>SquareMart</span>
      </div>
      
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <HugeiconsIcon icon={icon} size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
        <Link href="/" className={styles.navItem}>
          <HugeiconsIcon icon={Store01Icon} size={20} />
          <span>View Site</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className={styles.navItem} 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px' }}
        >
          <HugeiconsIcon icon={Logout01Icon} size={20} />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
};

export default AdminSidebar;

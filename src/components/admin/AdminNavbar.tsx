'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Search01Icon, 
  Notification03Icon, 
  Settings01Icon,
  Message01Icon,
  Menu01Icon
} from '@hugeicons/core-free-icons';
import styles from '../../app/admin/Admin.module.css';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

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
        <button className={styles.iconBtn}>
          <HugeiconsIcon icon={Message01Icon} size={20} />
          <span className={styles.badge}></span>
        </button>
        <button className={styles.iconBtn}>
          <HugeiconsIcon icon={Notification03Icon} size={20} />
          <span className={styles.badge}></span>
        </button>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>S</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Shawon</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

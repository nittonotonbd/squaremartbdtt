'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import styles from '../../app/admin/Admin.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.adminContainer}>
      <div 
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.showOverlay : ''}`}
        onClick={closeSidebar}
      />
      <AdminSidebar isOpen={isSidebarOpen} />
      <main className={styles.mainContent}>
        <AdminNavbar onMenuClick={toggleSidebar} />
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Search01Icon, 
  UserGroupIcon, 
  UserAdd01Icon,
  FilterIcon,
  MoreHorizontalIcon,
  Mail01Icon,
  Delete02Icon,
  Edit01Icon,
  UserCheck01Icon,
  UserBlock01Icon,
  Download01Icon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';
import StatCard from '../../../components/admin/StatCard';
import { supabase } from '../../../lib/supabase';
import { StatCardSkeleton, TableRowSkeleton } from '../../../components/admin/Skeleton';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  avatar_url: string | null;
}

const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error.message);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesSearch = (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'Super Admin' || u.role === 'Admin').length;
  const newUsersThisMonth = users.filter(u => {
    const date = new Date(u.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Joined Date'];
    const rows = filteredUsers.map(user => [
      user.full_name || 'N/A',
      user.email || 'N/A',
      user.role || 'Customer',
      new Date(user.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `squaremart-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Users Management</h1>
          <p className={styles.pageSubtitle}>Manage your store customers and administrative staff.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={handleExportCSV}>
            <HugeiconsIcon icon={Download01Icon} size={20} />
            <span>Export CSV</span>
          </button>
          <button className={styles.primaryBtn}>
            <HugeiconsIcon icon={UserAdd01Icon} size={20} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard 
              label="Total Users" 
              value={totalUsers.toString()} 
              icon={UserGroupIcon} 
              color="#3b82f6" 
            />
            <StatCard 
              label="Admin Staff" 
              value={adminUsers.toString()} 
              icon={UserCheck01Icon} 
              color="#10b981" 
            />
            <StatCard 
              label="New This Month" 
              value={newUsersThisMonth.toString()} 
              icon={UserAdd01Icon} 
              color="#ff5a00" 
            />
          </>
        )}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <HugeiconsIcon icon={Search01Icon} size={18} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select 
            className={styles.select} 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className={styles.userAvatar} style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                          {user.full_name?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <span style={{ fontWeight: '600' }}>{user.full_name || 'Unnamed User'}</span>
                      </div>
                    </td>
                    <td>{user.email || 'No email'}</td>
                    <td>
                      <span className={`${styles.status} ${user.role === 'Super Admin' || user.role === 'Admin' ? styles.statusProcessing : styles.statusSuccess}`}>
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.status} ${styles.statusSuccess}`}>Active</span>
                    </td>
                    <td>
                      <div className={styles.actionBtns} style={{ position: 'relative' }}>
                        <button 
                          className={styles.actionBtn} 
                          title="Edit User"
                        >
                          <HugeiconsIcon icon={Edit01Icon} size={18} />
                        </button>
                        <button 
                          className={styles.actionBtn} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === user.id ? null : user.id);
                          }}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                        </button>

                        {activeMenu === user.id && (
                          <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.actionDropdownItem}>
                              <HugeiconsIcon icon={Mail01Icon} size={16} />
                              <span>Send Email</span>
                            </button>
                            <button className={styles.actionDropdownItem}>
                              <HugeiconsIcon icon={UserBlock01Icon} size={16} />
                              <span>Suspend User</span>
                            </button>
                            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                            <button className={`${styles.actionDropdownItem} ${styles.actionDropdownItemDanger}`}>
                              <HugeiconsIcon icon={Delete02Icon} size={16} />
                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagementPage;

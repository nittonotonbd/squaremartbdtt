'use client';

import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings02Icon,
  Store01Icon,
  Shield01Icon,
  Notification01Icon,
  GlobalIcon,
  Tick02Icon,
  Mail01Icon,
  CallIcon,
  Location01Icon,
  CreditCardIcon,
  Key01Icon,
  UserIcon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import styles from '../Admin.module.css';

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    storeName: 'Nittonotonbd',
    storeEmail: 'contact@nittonotonbd.com',
    storePhone: '+880 1942-838348',
    storeAddress: 'Dhanmondi, Dhaka, Bangladesh',
    currency: 'BDT',
    maintenanceMode: false,
    orderNotifications: true,
    stockNotifications: true,
    newsletter: true,
    marketingEmails: false
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real app, we'd use a toast notification here
      alert('Settings updated successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Store01Icon },
    { id: 'security', name: 'Security', icon: Shield01Icon },
    { id: 'notifications', name: 'Notifications', icon: Notification01Icon },
    { id: 'international', name: 'International', icon: GlobalIcon },
  ];

  return (
    <AdminLayout>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Configure your store preferences and system parameters.</p>
        </div>
        <button className={styles.primaryBtn} onClick={handleSave} disabled={loading}>
          {loading ? (
            <div className={styles.loader} style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></div>
          ) : (
            <HugeiconsIcon icon={Tick02Icon} size={18} />
          )}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className={styles.settingsLayout}>
        {/* Settings Sidebar */}
        <div className={styles.settingsSidebar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.settingsTab} ${isActive ? styles.settingsTabActive : ''}`}
              >
                <HugeiconsIcon 
                  icon={tab.icon} 
                  size={20} 
                />
                <span style={{ flex: 1 }}>{tab.name}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} style={{ opacity: isActive ? 1 : 0 }} />
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className={styles.settingsContent}>
          {activeTab === 'general' && (
            <>
              <div className={styles.settingsCard}>
                <div className={styles.settingsCardHeader}>
                  <h3 className={styles.settingsCardTitle}>Store Profile</h3>
                  <p className={styles.settingsCardSubtitle}>Public information about your business.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store Name</label>
                    <div className={styles.inputWrapper}>
                      <HugeiconsIcon icon={Store01Icon} size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store Email</label>
                    <div className={styles.inputWrapper}>
                      <HugeiconsIcon icon={Mail01Icon} size={18} className={styles.inputIcon} />
                      <input
                        type="email"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={settings.storeEmail}
                        onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Phone</label>
                    <div className={styles.inputWrapper}>
                      <HugeiconsIcon icon={CallIcon} size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={settings.storePhone}
                        onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store Location</label>
                    <div className={styles.inputWrapper}>
                      <HugeiconsIcon icon={Location01Icon} size={18} className={styles.inputIcon} />
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputWithIcon}`}
                        value={settings.storeAddress}
                        onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.settingsCard}>
                <div className={styles.settingsCardHeader}>
                  <h3 className={styles.settingsCardTitle}>Global Settings</h3>
                  <p className={styles.settingsCardSubtitle}>Control site-wide behavior and appearance.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Default Currency</label>
                    <div className={styles.inputWrapper}>
                      <HugeiconsIcon icon={CreditCardIcon} size={18} className={styles.inputIcon} />
                      <select
                        className={`${styles.select} ${styles.inputWithIcon}`}
                        style={{ width: '100%' }}
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      >
                        <option value="BDT">Bangladeshi Taka (৳)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.settingItem}>
                    <div className={styles.settingItemInfo}>
                      <span className={styles.settingItemLabel}>Maintenance Mode</span>
                      <span className={styles.settingItemDesc}>Take your store offline for updates.</span>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <h3 className={styles.settingsCardTitle}>Authentication Security</h3>
                <p className={styles.settingsCardSubtitle}>Manage your administrative access and passwords.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.inputWrapper}>
                    <HugeiconsIcon icon={Key01Icon} size={18} className={styles.inputIcon} />
                    <input type="password" className={`${styles.input} ${styles.inputWithIcon}`} placeholder="••••••••" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <div className={styles.inputWrapper}>
                    <HugeiconsIcon icon={Key01Icon} size={18} className={styles.inputIcon} />
                    <input type="password" className={`${styles.input} ${styles.inputWithIcon}`} placeholder="••••••••" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirm New Password</label>
                  <div className={styles.inputWrapper}>
                    <HugeiconsIcon icon={Shield01Icon} size={18} className={styles.inputIcon} />
                    <input type="password" className={`${styles.input} ${styles.inputWithIcon}`} placeholder="••••••••" />
                  </div>
                </div>
                <button className={styles.secondaryBtn} style={{ width: 'fit-content', padding: '12px 24px' }}>
                  Update Password
                </button>
              </div>

              <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff8f6', borderRadius: '12px', border: '1px solid #ffe4dc' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <HugeiconsIcon icon={Shield01Icon} size={20} color="#ff5a00" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#852d00' }}>Two-Factor Authentication</h4>
                    <p style={{ fontSize: '13px', color: '#a34e24', marginTop: '4px' }}>
                      Add an extra layer of security to your account by enabling 2FA. (Coming Soon)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.settingsCard}>
              <div className={styles.settingsCardHeader}>
                <h3 className={styles.settingsCardTitle}>System Notifications</h3>
                <p className={styles.settingsCardSubtitle}>Choose how you want to be notified about store events.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { id: 'orderNotifications', label: 'Order Notifications', desc: 'Receive instant alerts when a new order is placed.' },
                  { id: 'stockNotifications', label: 'Low Stock Alerts', desc: 'Be notified when product quantity drops below threshold.' },
                  { id: 'newsletter', label: 'Platform Updates', desc: 'Stay informed about new features and improvements.' },
                  { id: 'marketingEmails', label: 'Marketing Insights', desc: 'Receive periodic analytics and performance reports.' }
                ].map((item) => (
                  <div key={item.id} className={styles.settingItem}>
                    <div className={styles.settingItemInfo}>
                      <span className={styles.settingItemLabel}>{item.label}</span>
                      <span className={styles.settingItemDesc}>{item.desc}</span>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={(settings as any)[item.id]}
                        onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'international' && (
            <div className={styles.settingsCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: 'rgba(255, 90, 0, 0.05)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <HugeiconsIcon icon={GlobalIcon} size={40} color="var(--primary-color)" />
              </div>
              <h3 className={styles.settingsCardTitle}>International Settings</h3>
              <p className={styles.settingsCardSubtitle} style={{ maxWidth: '400px', margin: '8px auto 0' }}>
                Manage multiple languages, localized tax rates, and regional shipping zones. This feature is currently in development.
              </p>
              <button className={styles.secondaryBtn} style={{ marginTop: '32px' }} disabled>
                Request Access
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

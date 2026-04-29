'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import styles from '../../app/admin/Admin.module.css';

interface StatCardProps {
  label: string;
  value: string;
  icon: any; // Using any for the icon object from core-free-icons
  trend: string;
  trendUp: boolean;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendUp, color, onClick }) => {
  return (
    <div 
      className={styles.statCard} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div 
        className={styles.statIconContainer} 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <HugeiconsIcon icon={icon} size={24} />
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
        <div className={`${styles.statTrend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
          {trendUp ? (
            <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
          ) : (
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
          )}
          <span>{trend} vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

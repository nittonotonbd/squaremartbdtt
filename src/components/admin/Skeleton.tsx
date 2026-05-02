import React from 'react';
import styles from '../../app/admin/Admin.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius, 
  circle, 
  className = '', 
  style 
}) => {
  const combinedStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: circle ? '50%' : (borderRadius || '8px'),
    ...style
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={combinedStyle}
    />
  );
};

export default Skeleton;

export const StatCardSkeleton: React.FC = () => (
  <div className={styles.statCard}>
    <Skeleton width={48} height={48} borderRadius={12} />
    <div className={styles.statInfo}>
      <Skeleton width="60%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton width="80%" height={28} />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i}>
        <Skeleton width="90%" height={20} />
      </td>
    ))}
  </tr>
);

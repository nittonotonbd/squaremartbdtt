import React from 'react';
import styles from './CategoriesBar.module.css';

const categories = [
  "Offer Product",
  "Baby & Toys",
  "Laptop Stands",
  "Islamic Items",
  "Home & Kitchen",
  "Home Appliances",
  "Daily Life Products",
  "Kitchen Gloves"
];

export default function CategoriesBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.categoryList}>
        {categories.map((category, index) => (
          <li key={index} className={styles.categoryItem}>
            <a href={`#`} className={styles.categoryLink}>{category}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

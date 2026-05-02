import React from 'react';
import styles from './CategoriesBar.module.css';

const categories = [
  { name: "Offer Product", slug: "offer-product" },
  { name: "Baby & Toys", slug: "baby-toys" },
  { name: "Laptop Stands", slug: "laptop-stands" },
  { name: "Islamic Items", slug: "islamic-items" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Home Appliances", slug: "home-appliances" },
  { name: "Daily Life Products", slug: "daily-life-products" },
  { name: "Kitchen Gloves", slug: "kitchen-gloves" }
];

export default function CategoriesBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.categoryList}>
        {categories.map((category, index) => (
          <li key={index} className={styles.categoryItem}>
            <a href={`/category/${category.slug}`} className={styles.categoryLink}>{category.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

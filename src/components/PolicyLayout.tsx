"use client";

import React from 'react';
import Header from './Header';
import CategoriesBar from './CategoriesBar';
import Footer from './Footer';
import styles from './PolicyLayout.module.css';

interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, children }: PolicyLayoutProps) {
  return (
    <>
      <Header />
      <CategoriesBar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

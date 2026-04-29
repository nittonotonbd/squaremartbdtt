import Header from '../components/Header';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { mockProducts } from '../data/products';

export default function Home() {
  return (
    <>
      <Header />
      <CategoriesBar />
      <main>
        <HeroBanner />
        <ProductGrid title="All Products" products={mockProducts} />
      </main>
      <Footer />
    </>
  );
}

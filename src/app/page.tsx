import Header from '../components/Header';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { getProducts } from '../data/products';

export default async function Home() {
  const products = await getProducts();
  
  return (
    <>
      <Header />
      <CategoriesBar />
      <main>
        <HeroBanner />
        <ProductGrid title="All Products" products={products} />
      </main>
      <Footer />
    </>
  );
}


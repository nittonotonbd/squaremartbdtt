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
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}>
          Nittonotonbd - Best Online Shopping in Bangladesh for Electronics & Lifestyle
        </h1>
        <HeroBanner />
        <ProductGrid title="All Products" products={products.slice(0, 8)} showSeeMore={true} />
      </main>
      <Footer />
    </>
  );
}


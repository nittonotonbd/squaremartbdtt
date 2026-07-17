import Header from '../components/Header';
import CategoriesBar from '../components/CategoriesBar';
import HeroBanner from '../components/HeroBanner';
import DiaperSection from '../components/DiaperSection';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { getProducts } from '../data/products';

const mockDiaperProducts = [
  { id: 'diaper-5pcs', slug: 'diaper-5pcs', title: '৫ পিস রি-ইউজেবল ডায়াপার', price: 950, imageUrl: '/images/products/diaper1.png', stockStatus: 'In Stock' as const },
  { id: 'diaper-4pcs', slug: 'diaper-4pcs', title: '৪ পিস রি-ইউজেবল ডায়াপার', price: 850, imageUrl: '/images/products/diaper2.png', stockStatus: 'In Stock' as const },
  { id: 'diaper-3pcs', slug: 'diaper-3pcs', title: '৩ পিস রি-ইউজেবল ডায়াপার', price: 550, imageUrl: '/images/products/diaper3.png', stockStatus: 'In Stock' as const },
  { id: 'diaper-2pcs', slug: 'diaper-2pcs', title: '২ পিস রি-ইউজেবল ডায়াপার', price: 450, imageUrl: '/images/products/diaper4.png', stockStatus: 'In Stock' as const },
];

export default async function Home() {
  const products = await getProducts();

  const diaperProductsFromDB = products.filter(p => p.category === 'ডায়াপার')
    .sort((a, b) => b.price - a.price);

  // Supabase-এ ডায়াপার না থাকলে mock data ব্যবহার করো
  const diaperProducts = diaperProductsFromDB.length > 0 ? diaperProductsFromDB : mockDiaperProducts;

  return (
    <>
      <Header />
      <CategoriesBar />
      <main>
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' }}>
          Nittonotonbd - Best Online Shopping in Bangladesh for Electronics &amp; Lifestyle
        </h1>
        <HeroBanner />
        <ProductGrid title="All Products" products={products} showSeeMore={true} />
        <DiaperSection products={diaperProducts} />
      </main>
      <Footer />
    </>
  );
}

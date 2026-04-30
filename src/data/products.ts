import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  galleryImages?: string[];
  description?: string;
  stockStatus: 'In Stock' | 'Out Of Stock';
  callToOrder?: string;
}

export const mockProducts: Product[] = [
  { 
    id: 1, 
    title: 'Waterproof Bed Cover (6/7 Feet)', 
    price: 1250, 
    originalPrice: 1500, 
    imageUrl: '/images/products/waterproof_bed_cover.png',
    galleryImages: [
      '/images/products/waterproof_bed_cover.png',
    ],
    description: '<p>100% waterproof bed cover that protects your mattress from spills and stains. Breathable, quiet, and fits beds up to 7 feet.</p><ul><li>High-quality materials</li><li>Machine washable</li><li>Hypoallergenic</li></ul>',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  { 
    id: 2, 
    title: 'Portable Mini Turbo Fan', 
    price: 650, 
    originalPrice: 900, 
    imageUrl: '/images/products/mini_turbo_fan.png',
    galleryImages: [
      '/images/products/mini_turbo_fan.png',
    ],
    description: '<p>Stay cool anywhere with this portable mini turbo fan. Features 3 speed settings and a long-lasting rechargeable battery.</p>',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  { 
    id: 3, 
    title: 'Plug in Quran', 
    price: 450, 
    imageUrl: '/images/products/plug_in_quran.png',
    galleryImages: [
      '/images/products/plug_in_quran.png'
    ],
    description: '<p>Listen to beautiful Quran recitations simply by plugging this device into any standard outlet.</p>',
    stockStatus: 'Out Of Stock',
    callToOrder: '01942-838348'
  },
  { id: 4, title: 'Metal Leaf Rake', price: 850, originalPrice: 1000, imageUrl: '/images/products/metal_leaf_rake.png', stockStatus: 'In Stock' },
  { id: 5, title: 'Wire Dish washable Gloves - 3 Pair', price: 300, imageUrl: '/images/products/dishwashing_gloves.png', stockStatus: 'In Stock' },
  { id: 6, title: 'Wireless Air Mouse', price: 950, originalPrice: 1200, imageUrl: '/images/products/wireless_air_mouse.png', stockStatus: 'In Stock' },
  { id: 7, title: 'Panda Baby Winter Suit', price: 1100, originalPrice: 1400, imageUrl: '/images/products/panda_winter_suit.png', stockStatus: 'In Stock' },
  { id: 8, title: 'Multiplication Board Game', price: 550, imageUrl: '/images/products/multiplication_board_game.png', stockStatus: 'Out Of Stock' },
  { id: 9, title: 'Laptop Sleeve Bag', price: 750, originalPrice: 1050, imageUrl: '/images/products/laptop_sleeve_bag.png', stockStatus: 'In Stock' },
  { id: 10, title: 'Universal Shower Bracket', price: 250, imageUrl: '/images/products/shower_bracket.png', stockStatus: 'In Stock' }
];

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return mockProducts; // Fallback
  }

  return data.map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.original_price,
    imageUrl: p.image_url,
    galleryImages: p.gallery_images,
    description: p.description,
    stockStatus: p.stock_status,
    callToOrder: p.call_to_order
  }));
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return mockProducts.find(p => p.id === id);
  }

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    originalPrice: data.original_price,
    imageUrl: data.image_url,
    galleryImages: data.gallery_images,
    description: data.description,
    stockStatus: data.stock_status,
    callToOrder: data.call_to_order
  };
}

export function getRelatedProducts(currentId: number, limit: number = 4): Product[] {
  // This could also be async but for now let's keep it simple or use mock
  return mockProducts.filter(p => p.id !== currentId).slice(0, limit);
}


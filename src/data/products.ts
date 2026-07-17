import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  galleryImages?: string[];
  description?: string;
  category?: string;
  stockStatus: 'In Stock' | 'Out Of Stock';
  callToOrder?: string;
  productCode?: string;
}

export const mockProducts: Product[] = [
  { 
    id: 1, 
    slug: 'waterproof-bed-cover',
    title: 'Waterproof Bed Cover (6/7 Feet)', 
    price: 1250, 
    originalPrice: 1500, 
    imageUrl: '/images/products/waterproof_bed_cover.png',
    galleryImages: [
      '/images/products/waterproof_bed_cover.png',
    ],
    description: '<p>100% waterproof bed cover that protects your mattress from spills and stains. Breathable, quiet, and fits beds up to 7 feet.</p><ul><li>High-quality materials</li><li>Machine washable</li><li>Hypoallergenic</li></ul>',
    category: 'ওয়াটারপ্রুফ চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  { 
    id: 2, 
    slug: 'portable-mini-turbo-fan',
    title: 'Portable Mini Turbo Fan', 
    price: 650, 
    originalPrice: 900, 
    imageUrl: '/images/products/mini_turbo_fan.png',
    galleryImages: [
      '/images/products/mini_turbo_fan.png',
    ],
    description: '<p>Stay cool anywhere with this portable mini turbo fan. Features 3 speed settings and a long-lasting rechargeable battery.</p>',
    category: 'নরমাল চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  { 
    id: 3, 
    slug: 'plug-in-quran',
    title: 'Plug in Quran', 
    price: 450, 
    imageUrl: '/images/products/plug_in_quran.png',
    galleryImages: [
      '/images/products/plug_in_quran.png'
    ],
    description: '<p>Listen to beautiful Quran recitations simply by plugging this device into any standard outlet.</p>',
    category: 'মশারী',
    stockStatus: 'Out Of Stock',
    callToOrder: '01942-838348'
  },
  {
    id: 101,
    slug: 'diaper-5pcs',
    title: '৫ পিস রি-ইউজেবল ডায়াপার',
    price: 950,
    imageUrl: '/images/products/diaper1.png',
    category: 'নরমাল চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  {
    id: 102,
    slug: 'diaper-4pcs',
    title: '৪ পিস রি-ইউজেবল ডায়াপার',
    price: 850,
    imageUrl: '/images/products/diaper2.png',
    category: 'নরমাল চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  {
    id: 103,
    slug: 'diaper-3pcs',
    title: '৩ পিস রি-ইউজেবল ডায়াপার',
    price: 550,
    imageUrl: '/images/products/diaper3.png',
    category: 'নরমাল চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
  {
    id: 104,
    slug: 'diaper-2pcs',
    title: '২ পিস রি-ইউজেবল ডায়াপার',
    price: 450,
    imageUrl: '/images/products/diaper4.png',
    category: 'নরমাল চাদর',
    stockStatus: 'In Stock',
    callToOrder: '01942-838348'
  },
];

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const extractProductCode = (description?: string, title?: string): string => {
  try {
    if (description && (description.trim().startsWith('{') || description.trim().startsWith('['))) {
      const parsed = JSON.parse(description);
      if (parsed && typeof parsed === 'object' && parsed.product_code) {
        return parsed.product_code;
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback to title matching
  if (title) {
    const match = title.match(/\b(Y-\d+|W\d+|Y\d+|W-\d+)\b/i);
    if (match) {
      return match[1].toUpperCase();
    }
  }

  return '';
};

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
    slug: p.slug || generateSlug(p.title) || p.id.toString(),
    title: p.title,
    price: p.price,
    originalPrice: p.original_price,
    imageUrl: p.image_url,
    galleryImages: p.gallery_images,
    description: p.description,
    category: p.category,
    stockStatus: p.stock_status,
    callToOrder: p.call_to_order,
    productCode: extractProductCode(p.description, p.title)
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // First attempt: fetch by exact slug
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!error && data) {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      price: data.price,
      originalPrice: data.original_price,
      imageUrl: data.image_url,
      galleryImages: data.gallery_images,
      description: data.description,
      category: data.category,
      stockStatus: data.stock_status,
      callToOrder: data.call_to_order,
      productCode: extractProductCode(data.description, data.title)
    };
  }

  // Second attempt: fetch by ID if slug is numeric
  if (!isNaN(parseInt(slug))) {
    const product = await getProductById(parseInt(slug));
    if (product) return product;
  }

  // Third attempt: fetch all and find by generated slug (for old products without slugs)
  const products = await getProducts();
  const found = products.find(p => p.slug === slug);
  if (found) return found;

  console.error('Product not found for slug:', slug);
  return mockProducts.find(p => p.slug === slug);
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by id:', error);
    return mockProducts.find(p => p.id === id);
  }

  return {
    id: data.id,
    slug: data.slug || generateSlug(data.title) || data.id.toString(),
    title: data.title,
    price: data.price,
    originalPrice: data.original_price,
    imageUrl: data.image_url,
    galleryImages: data.gallery_images,
    description: data.description,
    category: data.category,
    stockStatus: data.stock_status,
    callToOrder: data.call_to_order,
    productCode: extractProductCode(data.description, data.title)
  };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return mockProducts.filter(p => p.category === category);
  }

  if (!data || data.length === 0) {
    return mockProducts.filter(p => p.category === category);
  }

  return data.map(p => ({
    id: p.id,
    slug: p.slug || generateSlug(p.title) || p.id.toString(),
    title: p.title,
    price: p.price,
    originalPrice: p.original_price,
    imageUrl: p.image_url,
    galleryImages: p.gallery_images,
    description: p.description,
    category: p.category,
    stockStatus: p.stock_status,
    callToOrder: p.call_to_order,
    productCode: extractProductCode(p.description, p.title)
  }));
}

export async function getRelatedProducts(currentId: number, limit: number = 4): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.filter(p => p.id !== currentId).slice(0, limit);
  } catch (err) {
    console.error('Error in getRelatedProducts:', err);
    return mockProducts.filter(p => p.id !== currentId).slice(0, limit);
  }
}

export const getBaseTitle = (title: string): string => {
  return title
    .replace(/\s*\(6\/7\s*Feet\)/i, '')
    .replace(/\s*\(7\/8\s*Feet\)/i, '')
    .replace(/\s*\(৬\/৭\s*ফুট\)/i, '')
    .replace(/\s*\(৭\/৮\s*ফুট\)/i, '')
    .trim();
};

export const cleanTitle = (title: string, code?: string): string => {
  let cleaned = title;
  if (code) {
    const escapedCode = code.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\s*\\b${escapedCode}\\b\\s*`, 'i');
    cleaned = cleaned.replace(regex, ' ');
  }
  return cleaned
    .replace(/\s*\(6\/7\s*Feet\)/i, '')
    .replace(/\s*\(7\/8\s*Feet\)/i, '')
    .replace(/\s*\(৬\/৭\s*ফুট\)/i, '')
    .replace(/\s*\(৭\/৮\s*ফুট\)/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const groupProductsByBaseTitle = (products: Product[]): Product[] => {
  const seen = new Set<string>();
  const uniqueProducts: Product[] = [];

  for (const p of products) {
    const baseTitle = getBaseTitle(p.title);
    if (!seen.has(baseTitle)) {
      seen.add(baseTitle);
      
      // Find all products sharing this base title to get the lowest price
      const variations = products.filter(item => getBaseTitle(item.title) === baseTitle);
      let lowestPrice = p.price;
      let lowestOriginalPrice = p.originalPrice;
      
      if (variations.length > 1) {
        lowestPrice = Math.min(...variations.map(v => v.price));
        // Find the variant with the lowest price to get its matching original price
        const cheapestVariant = variations.find(v => v.price === lowestPrice);
        if (cheapestVariant) {
          lowestOriginalPrice = cheapestVariant.originalPrice;
        }
      }

      uniqueProducts.push({
        ...p,
        title: baseTitle,
        price: lowestPrice,
        originalPrice: lowestOriginalPrice
      });
    }
  }

  return uniqueProducts;
};



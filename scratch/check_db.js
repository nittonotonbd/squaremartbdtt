const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ugtzrchkumfbixffhfzz.supabase.co';
const supabaseAnonKey = 'sb_publishable_BeWSJifXw8EjqMc-HIAVrA_7zjjp2ic';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data: products, error } = await supabase.from('products').select('*').limit(1);
  if (!error && products.length > 0) {
    console.log('Product columns:', Object.keys(products[0]));
  } else {
    console.log('Products error or empty:', error?.message);
  }
}

checkProducts();

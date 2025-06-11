import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkInvalidImages() {
  console.log('Checking for products with invalid image URLs...')
  
  try {
    // Get all products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url')
    
    if (error) {
      console.error('Error fetching products:', error)
      return
    }
    
    // Filter products with invalid image URLs (starting with /images/)
    const invalidProducts = products.filter(product => 
      product.image_url && product.image_url.startsWith('/images/')
    )
    
    console.log(`Found ${invalidProducts.length} products with invalid image URLs:`)
    invalidProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.image_url}`)
    })
    
    return invalidProducts
  } catch (error) {
    console.error('Error:', error)
  }
}

checkInvalidImages() 
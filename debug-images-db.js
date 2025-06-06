require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugImages() {
  console.log('🔍 Vérification des URLs d\'images dans la base de données...\n');

  try {
    // Récupérer tous les produits avec leurs URLs d'images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url')
      .order('id');

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }

    console.log(`📊 Total produits: ${products.length}\n`);

    // Analyser les URLs d'images
    const imageAnalysis = {
      problematic: [],
      missing: [],
      localImages: [],
      httpsImages: [],
      total: products.length
    };

    products.forEach(product => {
      const imageUrl = product.image_url;
      
      if (!imageUrl || imageUrl.trim() === '') {
        imageAnalysis.missing.push(product);
      } else if (imageUrl.includes('cereus-peruvianus') || imageUrl.includes('echinocactus-horizonthalonius')) {
        imageAnalysis.problematic.push(product);
      } else if (imageUrl.startsWith('/images/')) {
        imageAnalysis.localImages.push(product);
      } else if (imageUrl.startsWith('https://')) {
        imageAnalysis.httpsImages.push(product);
      }
    });

    // Afficher les résultats
    console.log('📈 ANALYSE DES IMAGES:');
    console.log(`   • Images locales (/images/): ${imageAnalysis.localImages.length}`);
    console.log(`   • Images HTTPS: ${imageAnalysis.httpsImages.length}`);
    console.log(`   • Images manquantes: ${imageAnalysis.missing.length}`);
    console.log(`   • Images problématiques: ${imageAnalysis.problematic.length}\n`);

    // Afficher les images problématiques (qui causent les erreurs 404)
    if (imageAnalysis.problematic.length > 0) {
      console.log('🚨 IMAGES PROBLÉMATIQUES (causent les erreurs 404):');
      imageAnalysis.problematic.forEach(product => {
        console.log(`   ❌ ID ${product.id}: ${product.name}`);
        console.log(`      URL: ${product.image_url}\n`);
      });
    }

    // Afficher quelques images locales pour vérification
    if (imageAnalysis.localImages.length > 0) {
      console.log('📁 EXEMPLES D\'IMAGES LOCALES:');
      imageAnalysis.localImages.slice(0, 5).forEach(product => {
        console.log(`   ✅ ID ${product.id}: ${product.name}`);
        console.log(`      URL: ${product.image_url}\n`);
      });
    }

    // Recommandations
    console.log('💡 RECOMMANDATIONS:');
    if (imageAnalysis.problematic.length > 0) {
      console.log('   1. Corriger les URLs problématiques dans la base de données');
      console.log('   2. Ou supprimer ces enregistrements s\'ils sont obsolètes');
    }
    console.log('   3. Vérifier que les fichiers existent dans /public/images/');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

debugImages(); 
// Script pour corriger les URLs d'images dans Supabase
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

// Variables d'environnement Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping des produits vers des images qui existent
const imageMapping = {
  'echinocactus-grusonii': 'Echinocactus_grusonii_intermedius.jpg',
  'echinocactus-horizonthalonius': 'Echinocactus_grusonii_intermedius.jpg', // Temporaire
  'myrtillocactus-geometrizans': 'Myrtillocactus_Geometrizans.jpg',
  'trichocereus-pachanoi': 'Trichocereus_Pachanoi_en_groupe.jpg',
  'trichocereus-spachianus': 'Trichocereus_Spachianus.jpg',
  'euphorbia-lactea': 'Euphorbia_lactea_cristata.jpg',
  'yucca-desmetiana': 'Yucca_Desmetiana.jpg',
  'agave-nigra': 'Agave_Nigra.jpg',
  'aloe-aristata': 'Aloe_Aristata.jpg',
};

async function fixImages() {
  try {
    console.log('🔄 Récupération des produits...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url');

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return;
    }

    console.log(`📦 ${products.length} produits trouvés`);

    for (const product of products) {
      // Créer un slug à partir du nom pour matcher avec notre mapping
      const slug = product.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Trouver une image correspondante
      let newImageUrl = imageMapping[slug] ? `/images/${imageMapping[slug]}` : '/cactus-1.png'; // Image par défaut

      // Mettre à jour seulement si l'image actuelle est problématique
      if (!product.image_url || product.image_url.includes('.jpg') && product.image_url.startsWith('/images/')) {
        console.log(`🖼️  Mise à jour de l'image pour "${product.name}": ${newImageUrl}`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newImageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Erreur lors de la mise à jour de ${product.name}:`, updateError);
        } else {
          console.log(`✅ Image mise à jour pour ${product.name}`);
        }
      }
    }

    console.log('🎉 Terminé !');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Lancer le script
fixImages(); 
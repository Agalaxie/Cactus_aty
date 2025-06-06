const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalFix() {
  try {
    console.log('🔍 Recherche directe par ID du produit Echinocactus Grusonii...');
    
    // Chercher par ID (nous savons que c'est l'ID 1)
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .eq('id', 1)
      .single();

    if (findError) {
      console.error('❌ Erreur lors de la recherche:', findError);
      return;
    }

    console.log(`🎯 Produit trouvé: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   URL actuelle: "${product.image_url}"`);

    // Vérifier si l'URL est problématique
    if (product.image_url === '/imagesEchinocactus_grusonii_intermedius.jpg') {
      console.log('❌ URL problématique confirmée !');
      
      // Corriger l'URL
      const correctUrl = '/images/Echinocactus_grusonii_intermedius.jpg';
      
      console.log(`🔧 Correction vers: "${correctUrl}"`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({ image_url: correctUrl })
        .eq('id', 1)
        .select();

      if (updateError) {
        console.error('❌ Erreur lors de la correction:', updateError);
        return;
      }

      console.log('✅ Mise à jour réussie !');
      console.log('📊 Données mises à jour:', updateData);
      
      // Vérification finale
      const { data: verifyProduct, error: verifyError } = await supabase
        .from('products')
        .select('id, name, image_url')
        .eq('id', 1)
        .single();

      if (!verifyError) {
        console.log(`🔍 Vérification finale: "${verifyProduct.image_url}"`);
        if (verifyProduct.image_url === correctUrl) {
          console.log('🎉 SUCCÈS ! L\'URL a été corrigée correctement.');
        } else {
          console.log('⚠️  La vérification montre une URL différente...');
        }
      }

    } else if (product.image_url === '/images/Echinocactus_grusonii_intermedius.jpg') {
      console.log('✅ L\'URL est déjà correcte !');
    } else {
      console.log('🤔 URL inattendue, voici ce qui est stocké:');
      console.log(`   "${product.image_url}"`);
      console.log('   Longueur:', product.image_url.length);
      console.log('   Caractères:');
      for (let i = 0; i < product.image_url.length; i++) {
        console.log(`   [${i}]: "${product.image_url[i]}" (code: ${product.image_url.charCodeAt(i)})`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Lancer la correction finale
finalFix(); 
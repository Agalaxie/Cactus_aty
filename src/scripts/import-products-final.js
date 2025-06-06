require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Chargement des variables d\'environnement...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importProducts() {
  try {
    console.log('🗑️  Suppression de TOUS les anciens produits...');
    
    // Supprimer TOUS les produits existants
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('Erreur lors de la suppression:', deleteError);
      return;
    }
    
    console.log('📖 Lecture du fichier CSV...');
    
    const products = [];
    const csvPath = path.join(__dirname, '../../public/wc-product-export-5-6-2025.csv');
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Ignorer les produits variables et variations
          if (row.Type !== 'simple' || !row.Nom || row.Nom === 'Nom') return;
          
          // Extraire et nettoyer les données
          const name = row.Nom.trim();
          const description = row['Description courte'] || `${name} - Description à venir`;
          
          // Extraire le prix (colonne "Tarif régulier")
          let price = 0;
          const prixStr = row['Tarif régulier'];
          if (prixStr && !isNaN(parseFloat(prixStr))) {
            price = parseFloat(prixStr);
          }
          
          // Si pas de prix régulier, essayer le tarif promo
          if (price === 0) {
            const promoStr = row['Tarif promo'];
            if (promoStr && !isNaN(parseFloat(promoStr))) {
              price = parseFloat(promoStr);
            }
          }
          
          // Extraire la catégorie
          let category = 'Cactus';
          if (row.Catégories) {
            const categories = row.Catégories.split(',')[0].trim();
            if (categories) {
              category = categories.split('>').pop().trim() || category;
            }
          }
          
          // Extraire l'image - UNIQUEMENT les URLs complètes
          let image_url = '';
          if (row.Images) {
            const images = row.Images.split(',');
            if (images.length > 0) {
              const imageCandidate = images[0].trim();
              // UNIQUEMENT accepter les URLs qui commencent par https://
              if (imageCandidate.startsWith('https://')) {
                image_url = imageCandidate;
              }
            }
          }
          
          // Validation stricte des données
          if (name && price > 0 && image_url.startsWith('https://')) {
            const product = {
              name,
              description: description.substring(0, 500), // Limiter la description
              price,
              category,
              image_url,
              stock_quantity: 10
            };
            
            products.push(product);
            console.log(`✓ ${name} - ${price}€ (${category})`);
          } else {
            // Debug : produits rejetés
            if (name && price > 0) {
              console.log(`❌ REJETÉ: ${name} - pas d'image valide (${image_url})`);
            }
          }
        })
        .on('end', async () => {
          console.log(`📦 ${products.length} produits avec images valides trouvés`);
          
          if (products.length === 0) {
            console.log('Aucun produit à importer');
            resolve();
            return;
          }
          
          console.log('⬆️  Import en cours...');
          
          // Importer par lots de 100
          const batchSize = 100;
          for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            
            const { data, error } = await supabase
              .from('products')
              .insert(batch);
            
            if (error) {
              console.error(`Erreur lors de l'import du lot ${i / batchSize + 1}:`, error);
              continue;
            }
            
            console.log(`✅ Lot ${i / batchSize + 1}/${Math.ceil(products.length / batchSize)} importé`);
          }
          
          console.log('🎉 Import terminé avec succès !');
          
          // Afficher quelques exemples
          console.log('\n📋 Exemples de produits importés :');
          products.slice(0, 5).forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} - ${p.price}€`);
            console.log(`   Image: ${p.image_url.substring(0, 50)}...`);
          });
          
          resolve();
        })
        .on('error', (error) => {
          console.error('Erreur lors de la lecture du CSV:', error);
          reject(error);
        });
    });
    
  } catch (error) {
    console.error('Erreur générale:', error);
  }
}

// Exécuter l'import
importProducts(); 
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Chargement des variables d\'environnement...');
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MANQUANTE');
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MANQUANTE');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    // Parsing simple du CSV (peut nécessiter des ajustements selon la complexité)
    const values = lines[i].split(',');
    
    if (values.length < 10) continue; // Ignorer les lignes incomplètes
    
    // Extraire les informations importantes
    const id = values[0]?.replace(/"/g, '').trim();
    const type = values[1]?.replace(/"/g, '').trim();
    const nom = values[4]?.replace(/"/g, '').trim();
    const description = values[9]?.replace(/"/g, '').trim();
    const prixRegulier = values[27]?.replace(/"/g, '').trim();
    const categories = values[28]?.replace(/"/g, '').trim();
    const images = values[31]?.replace(/"/g, '').trim();
    
    // Ignorer les produits variables et variations
    if (type !== 'simple' || !nom || nom === 'Nom') continue;
    
    // Extraire le prix
    let price = 0;
    if (prixRegulier && !isNaN(parseFloat(prixRegulier))) {
      price = parseFloat(prixRegulier);
    }
    
    // Extraire la première catégorie
    let category = 'Cactus';
    if (categories) {
      const catArray = categories.split('>').map(c => c.trim());
      if (catArray.length > 0) {
        category = catArray[catArray.length - 1] || catArray[0];
      }
    }
    
    // Extraire la première image
    let image_url = '';
    if (images) {
      const imageArray = images.split(',');
      if (imageArray.length > 0) {
        image_url = imageArray[0].trim();
      }
    }
    
    const product = {
      name: nom,
      description: description || `${nom} - Description à venir`,
      price: price,
      category: category,
      image_url: image_url,
      stock_quantity: 10 // Valeur par défaut
    };
    
    if (product.name && product.price > 0) {
      products.push(product);
    }
  }
  
  return products;
}

async function importProducts() {
  try {
    console.log('🗑️  Suppression des anciens produits...');
    
    // Supprimer tous les produits existants
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Supprimer tous les produits
    
    if (deleteError) {
      console.error('Erreur lors de la suppression:', deleteError);
      return;
    }
    
    console.log('📖 Lecture du fichier CSV...');
    
    // Lire le fichier CSV
    const csvPath = path.join(__dirname, '../../public/wc-product-export-5-6-2025.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('🔄 Parsing des données...');
    
    // Parser le CSV
    const products = parseCSV(csvContent);
    
    console.log(`📦 ${products.length} produits trouvés`);
    
    if (products.length === 0) {
      console.log('Aucun produit à importer');
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
      console.log(`${i + 1}. ${p.name} - ${p.price}€ (${p.category})`);
    });
    
  } catch (error) {
    console.error('Erreur générale:', error);
  }
}

// Exécuter l'import
importProducts(); 
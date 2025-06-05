const fs = require('fs');
const path = require('path');

// Fonction pour nettoyer le HTML et extraire le texte
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour parser CSV avec gestion correcte des guillemets
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Double quote - escape
        current += '"';
        i += 2;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

// Fonction pour mapper les catégories WooCommerce vers nos catégories
function mapCategory(wooCategory) {
  if (!wooCategory) return 'cactus';
  
  const categoryLower = wooCategory.toLowerCase();
  
  if (categoryLower.includes('agave')) return 'agaves';
  if (categoryLower.includes('aloe')) return 'aloes';
  if (categoryLower.includes('bouture')) return 'boutures';
  if (categoryLower.includes('yucca')) return 'yuccas';
  if (categoryLower.includes('sujets exceptionnels')) return 'sujets-exceptionnels';
  if (categoryLower.includes('cactus')) return 'cactus';
  if (categoryLower.includes('dasylirion')) return 'yuccas';
  
  return 'cactus';
}

// Fonction pour extraire les tailles et prix depuis les données WooCommerce
function extractSizesAndPrices(product, allProducts) {
  const sizes = [];
  
  // 1. Vérifier si c'est un produit variable avec des variations
  if (product.Type === 'variable') {
    // Récupérer les prix min/max depuis les métadonnées
    const minPrice = parseFloat(product['Méta : _min_variation_price'] || product['Méta : _min_variation_regular_price'] || '0');
    const maxPrice = parseFloat(product['Méta : _max_variation_price'] || product['Méta : _max_variation_regular_price'] || '0');
    
    // Extraire les tailles depuis les attributs
    const taillesStr = product['Valeur(s) de l\'attribut 1 '] || '';
    
    if (taillesStr && taillesStr.trim() !== '') {
      const tailles = taillesStr.split(',').map(t => t.trim().replace(/"/g, ''));
      
      // Trouver les variations correspondantes dans le CSV
      const variations = allProducts.filter(p => 
        p.Type === 'variation' && 
        p.Parent && 
        p.Parent.includes(product.ID)
      );
      
      console.log(`Produit ${product.Nom}: ${variations.length} variations trouvées`);
      
      tailles.forEach((taille, index) => {
        if (taille && taille !== '') {
          // Chercher la variation correspondante à cette taille
          const matchingVariation = variations.find(v => {
            const variationTaille = v['Valeur(s) de l\'attribut 1 '] || v.taille || '';
            return variationTaille.includes(taille);
          });
          
          let price = 0;
          if (matchingVariation) {
            price = parseFloat(matchingVariation['Tarif régulier'] || matchingVariation['Tarif promo'] || '0');
          } else if (minPrice && maxPrice) {
            // Interpoler le prix entre min et max
            const ratio = index / Math.max(tailles.length - 1, 1);
            price = minPrice + (ratio * (maxPrice - minPrice));
          }
          
          if (price > 0) {
            sizes.push({
              id: `size-${index}`,
              label: taille.includes('cm') ? taille : `${taille}cm`,
              price: Math.round(price),
              multiplier: 1 // On utilise directement le prix
            });
          }
        }
      });
    }
  }
  
  // 2. Extraire les tailles depuis la description si pas de variations
  if (sizes.length === 0) {
    const description = cleanHtml((product.Description || '') + ' ' + (product['Description courte'] || ''));
    const basePrice = parseFloat(product['Tarif régulier'] || product['Tarif promo'] || '50') || 50;
    
    // Chercher des patterns de tailles dans la description
    const tailleMatches = description.match(/(\d+)[-\/]?(\d+)?[-\/]?(\d+)?\s*cm/gi) || 
                         description.match(/taille[s]?\s*:\s*([^\.]+)/gi) ||
                         description.match(/diam[èe]tre[s]?\s*:\s*([^\.]+)/gi);
    
    if (tailleMatches && tailleMatches.length > 0) {
      tailleMatches.slice(0, 4).forEach((match, index) => {
        const cleanMatch = match.replace(/[^\d\-\/cm]/gi, '');
        if (cleanMatch) {
          const multiplier = 1 + (index * 0.4); // Progression des prix selon la taille
          sizes.push({
            id: `size-${index}`,
            label: cleanMatch.includes('cm') ? cleanMatch : `${cleanMatch}cm`,
            price: Math.round(basePrice * multiplier),
            multiplier: multiplier
          });
        }
      });
    }
    
    // Chercher des prix au cm (comme pour Yucca Rigida)
    const prixCmMatch = description.match(/(\d+[\.,]\d+)\s*[€e]?\s*le cm/i);
    if (prixCmMatch) {
      const prixParCm = parseFloat(prixCmMatch[1].replace(',', '.'));
      // Créer des tailles standards avec prix calculé
      [50, 75, 100, 150].forEach((cm, index) => {
        sizes.push({
          id: `size-${index}`,
          label: `${cm}cm`,
          price: Math.round(prixParCm * cm),
          multiplier: 1
        });
      });
    }
  }
  
  // 3. Si toujours pas de tailles, utiliser le prix de base
  if (sizes.length === 0) {
    const basePrice = parseFloat(product['Tarif régulier'] || product['Tarif promo'] || '50') || 50;
    sizes.push({
      id: 'standard',
      label: 'Taille standard',
      price: basePrice,
      multiplier: 1
    });
  }
  
  return sizes;
}

// Fonction pour extraire les caractéristiques
function extractCharacteristics(description, shortDescription, name) {
  const text = cleanHtml((description || '') + ' ' + (shortDescription || '')).toLowerCase();
  const nameText = name.toLowerCase();
  
  // Extraction de la résistance au froid
  let coldResistance = -5;
  const coldMatches = text.match(/-(\d+)°/g);
  if (coldMatches) {
    const temps = coldMatches.map(m => -parseInt(m.match(/-(\d+)°/)[1]));
    coldResistance = Math.min(...temps);
  }
  
  // Détermination de la taille adulte
  let matureSize = 'moyen';
  if (text.includes('petit') || text.includes('compact') || text.includes('30cm')) {
    matureSize = 'petit';
  } else if (text.includes('8 mètres') || text.includes('10m') || text.includes('géant') || text.includes('plus de 5')) {
    matureSize = 'géant';
  } else if (text.includes('3 mètres') || text.includes('4 mètres') || text.includes('3-4') || text.includes('3-5m')) {
    matureSize = 'grand';
  }
  
  // Vitesse de croissance
  let growthRate = 'moyenne';
  if (text.includes('croissance rapide') || text.includes('pousse très vite')) {
    growthRate = 'rapide';
  } else if (text.includes('croissance lente') || text.includes('lente')) {
    growthRate = 'lente';
  }
  
  const flowering = text.includes('floraison') || text.includes('fleur');
  const indoorSuitable = text.includes('intérieur') || text.includes('pot') || matureSize === 'petit';
  
  return {
    coldResistance,
    matureSize,
    growthRate,
    careLevel: 'facile',
    sunExposure: 'plein-soleil',
    flowering,
    indoorSuitable,
    outdoorSuitable: true,
    droughtTolerant: true,
    soilType: 'drainant'
  };
}

// Fonction pour créer un ID produit
function createProductId(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Fonction principale pour parser le CSV
function parseWooCommerceCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  console.log(`Headers trouvés: ${headers.length}`);
  
  // Parser tous les produits d'abord
  const allProducts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    try {
      const values = parseCSVLine(line);
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      
      allProducts.push(product);
    } catch (error) {
      console.error(`Erreur ligne ${i}:`, error.message);
    }
  }
  
  console.log(`Total produits parsés: ${allProducts.length}`);
  
  // Filtrer et traiter les produits principaux
  const mainProducts = allProducts.filter(product => 
    (product.Type === 'simple' || product.Type === 'variable') && 
    product.Nom && product.Nom.trim() !== '' && 
    product.Publié === '1'
  );
  
  console.log(`Produits principaux trouvés: ${mainProducts.length}`);
  
  const processedProducts = [];
  
  mainProducts.forEach((product, index) => {
    try {
      const sizes = extractSizesAndPrices(product, allProducts);
      const basePrice = sizes.length > 0 ? Math.min(...sizes.map(s => s.price)) : 50;
      
      const productData = {
        id: createProductId(product.Nom),
        name: cleanHtml(product.Nom),
        latin: '',
        category: mapCategory(product.Catégories || ''),
        basePrice: basePrice,
        description: cleanHtml(product['Description courte'] || product.Description || ''),
        images: ['/cactus-1.png'],
        details: [],
        sizes: sizes.map(s => ({
          id: s.id,
          label: s.label,
          multiplier: s.price / basePrice // Calculer le multiplicateur basé sur le prix réel
        })),
        inStock: true,
        featured: product['Mis en avant ?'] === '1',
        characteristics: extractCharacteristics(
          product.Description || '', 
          product['Description courte'] || '', 
          product.Nom || ''
        )
      };
      
      // Debug pour les premiers produits
      if (index < 5) {
        console.log(`\nProduit: ${productData.name}`);
        console.log(`Prix de base: ${productData.basePrice}€`);
        console.log(`Tailles: ${sizes.map(s => `${s.label}: ${s.price}€`).join(', ')}`);
      }
      
      processedProducts.push(productData);
    } catch (error) {
      console.error(`Erreur processing ${product.Nom}:`, error.message);
    }
  });
  
  return processedProducts;
}

// Script principal
async function main() {
  try {
    console.log('🔄 Import WooCommerce amélioré - Extraction des tailles et prix...');
    
    const csvPath = path.join(__dirname, '../public/wc-product-export-5-6-2025.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('📊 Parsing des données avec extraction des variations...');
    const products = parseWooCommerceCSV(csvContent);
    
    console.log(`✅ ${products.length} produits traités avec leurs tailles et prix`);
    
    if (products.length === 0) {
      console.log('⚠️ Aucun produit trouvé');
      return;
    }
    
    // Sauvegarder
    const outputDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'imported-products-enhanced.ts');
    
    const fileContent = `// Produits importés depuis WooCommerce avec tailles et prix réels
// Généré automatiquement le ${new Date().toISOString()}

import { Product, CategoryType } from './products';

export const enhancedProducts: Product[] = [
${products.map(product => `  {
    id: '${product.id}',
    name: \`${product.name.replace(/`/g, '\\`')}\`,
    latin: '${product.latin}',
    category: '${product.category}' as CategoryType,
    basePrice: ${product.basePrice},
    description: \`${product.description.replace(/`/g, '\\`')}\`,
    images: ['${product.images[0]}'],
    details: [],
    sizes: [${product.sizes.map(s => `{ id: '${s.id}', label: '${s.label}', multiplier: ${s.multiplier} }`).join(', ')}],
    inStock: ${product.inStock},
    featured: ${product.featured},
    characteristics: {
      coldResistance: ${product.characteristics.coldResistance},
      matureSize: '${product.characteristics.matureSize}',
      growthRate: '${product.characteristics.growthRate}',
      careLevel: '${product.characteristics.careLevel}',
      sunExposure: '${product.characteristics.sunExposure}',
      flowering: ${product.characteristics.flowering},
      indoorSuitable: ${product.characteristics.indoorSuitable},
      outdoorSuitable: ${product.characteristics.outdoorSuitable},
      droughtTolerant: ${product.characteristics.droughtTolerant},
      soilType: '${product.characteristics.soilType}'
    }
  }`).join(',\n')}
];`;
    
    fs.writeFileSync(outputPath, fileContent);
    
    console.log(`💾 Données avec tailles/prix sauvegardées dans ${outputPath}`);
    
    // Statistiques
    console.log('\n📊 Statistiques des tailles/prix:');
    let totalSizes = 0;
    let productsWithMultipleSizes = 0;
    
    products.forEach(p => {
      totalSizes += p.sizes.length;
      if (p.sizes.length > 1) {
        productsWithMultipleSizes++;
      }
    });
    
    console.log(`  Produits avec plusieurs tailles: ${productsWithMultipleSizes}/${products.length}`);
    console.log(`  Total variations de tailles: ${totalSizes}`);
    
    console.log('\n🎯 Exemples de produits avec tailles:');
    products.filter(p => p.sizes.length > 1).slice(0, 3).forEach(p => {
      console.log(`  ${p.name}:`);
      p.sizes.forEach(s => {
        const price = Math.round(p.basePrice * s.multiplier);
        console.log(`    - ${s.label}: ${price}€`);
      });
    });
    
    console.log('\n🎉 Import amélioré terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import amélioré:', error);
  }
}

main(); 
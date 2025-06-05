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
  if (categoryLower.includes('dasylirion')) return 'yuccas'; // Dasylirion dans yuccas
  
  // Par défaut, retourner cactus
  return 'cactus';
}

// Fonction pour extraire les caractéristiques depuis la description
function extractCharacteristics(description, shortDescription, name) {
  const text = cleanHtml((description || '') + ' ' + (shortDescription || '')).toLowerCase();
  const nameText = name.toLowerCase();
  
  // Extraction de la résistance au froid
  let coldResistance = -5; // Par défaut
  const coldMatches = text.match(/-(\d+)°/g);
  if (coldMatches) {
    const temps = coldMatches.map(m => -parseInt(m.match(/-(\d+)°/)[1]));
    coldResistance = Math.min(...temps); // Prendre la température la plus basse
  }
  
  // Détermination de la taille adulte basée sur les descriptions
  let matureSize = 'moyen';
  if (text.includes('petit') || text.includes('compact') || nameText.includes('petit') || text.includes('30cm')) {
    matureSize = 'petit';
  } else if (text.includes('8 mètres') || text.includes('10m') || text.includes('géant') || text.includes('plus de 5')) {
    matureSize = 'géant';
  } else if (text.includes('3 mètres') || text.includes('4 mètres') || text.includes('3-4') || text.includes('3-5m')) {
    matureSize = 'grand';
  }
  
  // Vitesse de croissance
  let growthRate = 'moyenne';
  if (text.includes('croissance rapide') || text.includes('pousse très vite') || text.includes('croissance rapide')) {
    growthRate = 'rapide';
  } else if (text.includes('croissance lente') || text.includes('lente')) {
    growthRate = 'lente';
  }
  
  // Facilité d'entretien
  let careLevel = 'facile';
  if (text.includes('difficile')) {
    careLevel = 'difficile';
  }
  
  // Floraison
  const flowering = text.includes('floraison') || text.includes('fleur') || text.includes('fleurit');
  
  // Adapté intérieur
  const indoorSuitable = text.includes('intérieur') || text.includes('pot') || matureSize === 'petit';
  
  // Résistant sécheresse (vrai pour la plupart des cactus/succulentes)
  const droughtTolerant = true;
  
  return {
    coldResistance,
    matureSize,
    growthRate,
    careLevel,
    sunExposure: 'plein-soleil',
    flowering,
    indoorSuitable,
    outdoorSuitable: true,
    droughtTolerant,
    soilType: 'drainant'
  };
}

// Fonction pour extraire les tailles depuis les attributs
function extractSizes(product) {
  const sizes = [];
  
  // Chercher dans les différents champs possibles pour les tailles
  const tailles = product['Valeur(s) de l\'attribut 1 '] || 
                 product['taille'] || 
                 product['Taille'] || 
                 '';
  
  if (tailles && tailles.trim() !== '') {
    const taillesList = tailles.split(',').map(t => t.trim().replace(/"/g, ''));
    taillesList.forEach((taille, index) => {
      if (taille && taille !== '' && taille !== '0') {
        let multiplier = 1 + (index * 0.3); // Augmentation progressive des prix
        
        // Ajustement des multiplicateurs selon la taille
        const tNum = parseInt(taille);
        if (tNum <= 30 || taille.includes('petit')) multiplier = 0.8;
        else if (tNum <= 50) multiplier = 1.0;
        else if (tNum <= 70) multiplier = 1.3;
        else if (tNum <= 100) multiplier = 1.6;
        else if (tNum <= 150) multiplier = 2.0;
        else if (tNum >= 200) multiplier = 2.5;
        
        sizes.push({
          id: `size-${index}`,
          label: taille,
          multiplier: Math.round(multiplier * 100) / 100
        });
      }
    });
  }
  
  // Si pas de tailles spécifiques, créer des tailles par défaut
  if (sizes.length === 0) {
    sizes.push(
      { id: 'medium', label: 'Taille standard', multiplier: 1.0 }
    );
  }
  
  return sizes;
}

// Fonction pour créer un ID produit à partir du nom
function createProductId(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/[^a-z0-9\s]/g, '') // Supprime caractères spéciaux
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .substring(0, 50); // Limite la longueur
}

// Fonction pour extraire le premier nom latin si présent
function extractLatinName(name, description) {
  const text = `${name} ${description || ''}`;
  // Chercher des patterns comme "Genus species"
  const latinMatch = text.match(/([A-Z][a-z]+\s+[a-z]+)/);
  return latinMatch ? latinMatch[1] : '';
}

// Fonction principale pour parser le CSV
function parseWooCommerceCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  console.log(`Headers trouvés: ${headers.length}`);
  console.log('Colonnes principales:', headers.slice(0, 10));
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    try {
      const values = parseCSVLine(line);
      
      // Créer l'objet produit
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      
      // Debug: Afficher quelques produits
      if (i <= 5) {
        console.log(`Produit ${i}:`, {
          nom: product.Nom,
          type: product.Type,
          publié: product.Publié,
          catégorie: product.Catégories
        });
      }
      
      // Filtrer seulement les produits principaux (pas les variations)
      if ((product.Type === 'simple' || product.Type === 'variable') && 
          product.Nom && product.Nom.trim() !== '' && 
          product.Publié === '1') {
        
        const basePrice = parseFloat(product['Tarif régulier'] || product['Tarif promo'] || '50') || 50;
        
        const productData = {
          id: createProductId(product.Nom),
          name: cleanHtml(product.Nom),
          latin: extractLatinName(product.Nom, product.Description),
          category: mapCategory(product.Catégories || ''),
          basePrice: Math.round(basePrice),
          description: cleanHtml(product['Description courte'] || product.Description || ''),
          images: ['/cactus-1.png'], // Image par défaut existante
          details: [],
          sizes: extractSizes(product),
          inStock: true, // Marquer tous les produits comme disponibles pour l'affichage
          featured: product['Mis en avant ?'] === '1',
          characteristics: extractCharacteristics(
            product.Description || '', 
            product['Description courte'] || '', 
            product.Nom || ''
          )
        };
        
        // Extraire quelques détails depuis la description
        const description = cleanHtml(product.Description || product['Description courte'] || '');
        if (description) {
          const details = [];
          
          // Origine
          const origineMatch = description.match(/originaire [^.,]*/i);
          if (origineMatch) details.push(origineMatch[0]);
          
          // Résistance au froid
          const froidMatch = description.match(/résistan[t|ce] [^.,]*/i);
          if (froidMatch) details.push(froidMatch[0]);
          
          // Taille adulte
          const tailleMatch = description.match(/peut atteindre [^.,]*/i);
          if (tailleMatch) details.push(tailleMatch[0]);
          
          // Floraison
          const floraisonMatch = description.match(/floraison [^.,]*/i);
          if (floraisonMatch) details.push(floraisonMatch[0]);
          
          productData.details = details.slice(0, 4); // Limiter à 4 détails
        }
        
        products.push(productData);
      }
    } catch (error) {
      console.error(`Erreur ligne ${i}:`, error.message);
    }
  }
  
  return products;
}

// Script principal
async function main() {
  try {
    console.log('🔄 Lecture du fichier WooCommerce...');
    
    const csvPath = path.join(__dirname, '../public/wc-product-export-5-6-2025.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('📊 Parsing des données...');
    const products = parseWooCommerceCSV(csvContent);
    
    console.log(`✅ ${products.length} produits trouvés`);
    
    if (products.length === 0) {
      console.log('⚠️ Aucun produit trouvé. Vérification des critères de filtrage...');
      return;
    }
    
    // Créer le dossier s'il n'existe pas
    const outputDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Sauvegarder les données converties
    const outputPath = path.join(outputDir, 'imported-products.ts');
    
    const fileContent = `// Produits importés depuis WooCommerce
// Généré automatiquement le ${new Date().toISOString()}

import { Product, ProductCharacteristics, CategoryType } from './products';

export const importedProducts: Product[] = [
${products.map(product => `  {
    id: '${product.id}',
    name: \`${product.name.replace(/`/g, '\\`')}\`,
    latin: '${product.latin}',
    category: '${product.category}' as CategoryType,
    basePrice: ${product.basePrice},
    description: \`${product.description.replace(/`/g, '\\`')}\`,
    images: ['${product.images[0]}'],
    details: [${product.details.map(d => `\`${d.replace(/`/g, '\\`')}\``).join(', ')}],
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
    
    console.log(`💾 Données sauvegardées dans ${outputPath}`);
    console.log('\n📋 Résumé par catégorie:');
    
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} produits`);
    });
    
    console.log('\n🎯 Exemples de produits importés:');
    products.slice(0, 3).forEach(p => {
      console.log(`  - ${p.name} (${p.category}) - ${p.basePrice}€`);
    });
    
    console.log('\n🎉 Import terminé ! Vous pouvez maintenant utiliser les données importées.');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez le fichier généré: src/data/imported-products.ts');
    console.log('2. Mettez à jour src/data/products.ts pour utiliser les données importées');
    console.log('3. Ajoutez les vraies images des produits dans le dossier public/');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
  }
}

main(); 
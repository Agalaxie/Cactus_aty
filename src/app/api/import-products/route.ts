import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Début de l\'importation des produits...');

    // Lire le fichier CSV avec gestion d'encodage
    const csvPath = path.join(process.cwd(), 'public', 'converted_products_for_import.csv');
    let csvContent;
    
    try {
      // Essayer UTF-8 d'abord
      csvContent = fs.readFileSync(csvPath, 'utf-8');
    } catch (error) {
      // Si ça échoue, essayer avec latin1
      csvContent = fs.readFileSync(csvPath, 'latin1');
    }
    
    // Parser le CSV avec gestion des différents types de retours à la ligne
    const lines = csvContent
      .replace(/\r\n/g, '\n')  // Windows vers Unix
      .replace(/\r/g, '\n')    // Mac vers Unix
      .split('\n')
      .filter(line => line.trim());
    
    const headers = lines[0].split(',');
    
    console.log('Headers trouvés:', headers);
    console.log(`Nombre total de lignes: ${lines.length}`);
    console.log(`Nombre de lignes à traiter: ${lines.length - 1}`);

    const products = [];
    let validLinesCount = 0;
    let skippedLines = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        skippedLines++;
        continue;
      }
      
      // Parser chaque ligne en tenant compte des virgules dans les guillemets
      const values = parseCSVLine(line);
      
      // Vérifier que c'est une ligne de produit valide (commence par un ID numérique)
      if (values.length >= headers.length && values[0] && /^\d+$/.test(values[0].trim())) {
        validLinesCount++;
        const product = {
          id: parseInt(values[0]) || null,
          name: values[1] || '',
          description: values[2] || '',
          price: parseFloat(values[3]) || 0,
          stock_quantity: parseInt(values[4]) || 0,
          category: values[5] || '',
          image_url: values[6] || '',
          created_at: values[7] || new Date().toISOString(),
          updated_at: values[8] || new Date().toISOString(),
          variants: values[9] || ''
        };
        
        // Nettoyer les données
        product.name = cleanText(product.name);
        product.description = cleanText(product.description);
        product.category = cleanText(product.category);
        product.image_url = cleanText(product.image_url);
        
        // Traiter les images multiples - prendre la première
        if (product.image_url && product.image_url.includes(',')) {
          product.image_url = product.image_url.split(',')[0].trim();
        }
        
        products.push(product);
      } else {
        skippedLines++;
        console.log(`Ligne ${i} ignorée (format invalide): ${line.substring(0, 100)}...`);
      }
    }

    console.log(`Statistiques d'analyse:`);
    console.log(`- Lignes valides trouvées: ${validLinesCount}`);
    console.log(`- Lignes ignorées: ${skippedLines}`);
    console.log(`- Produits à insérer: ${products.length}`);

    // Vérifier la structure de la table products
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Erreur lors de la vérification de la table:', checkError);
      return NextResponse.json({ 
        error: 'Erreur lors de la vérification de la table products',
        details: checkError.message 
      }, { status: 500 });
    }

    // Supprimer les anciens produits pour éviter les doublons
    console.log('Suppression des anciens produits...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Supprimer tous les produits

    if (deleteError) {
      console.warn('Erreur lors de la suppression des anciens produits:', deleteError);
    }

    // Insérer les nouveaux produits par batches de 100
    const batchSize = 100;
    let insertedCount = 0;
    let errors = [];

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`Insertion du batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}...`);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Erreur batch ${Math.floor(i/batchSize) + 1}:`, error);
        errors.push({
          batch: Math.floor(i/batchSize) + 1,
          error: error.message,
          products: batch.slice(0, 3).map(p => p.name) // Exemples
        });
      } else {
        insertedCount += data?.length || 0;
        console.log(`Batch ${Math.floor(i/batchSize) + 1} inséré avec succès: ${data?.length} produits`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importation terminée: ${insertedCount} produits insérés`,
      statistics: {
        totalLines: lines.length - 1, // Sans l'en-tête
        validLines: validLinesCount,
        skippedLines: skippedLines,
        productsProcessed: products.length,
        productsInserted: insertedCount
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'importation des produits',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// Fonction pour parser une ligne CSV avec gestion des guillemets
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Fonction pour nettoyer le texte
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^["']|["']$/g, '') // Supprimer guillemets de début/fin
    .replace(/\\n/g, '\n') // Convertir \\n en vrais retours à la ligne
    .replace(/&nbsp;/g, ' ') // Remplacer &nbsp; par espaces
    .trim();
} 
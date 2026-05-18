#!/usr/bin/env node

/**
 * Script de génération des sitemaps Loxo
 * 
 * Génère :
 * - sitemap.xml (index principal)
 * - sitemap-main.xml (pages statiques)
 * - sitemap-[dept].xml (un par département, ex: sitemap-69.xml)
 * 
 * Usage : node scripts/generate-sitemap.js
 * 
 * À exécuter après chaque import DVF (semestriel)
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

// ── Configuration ──
const SITE_URL = 'https://loxo.fr';
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
const LAST_MOD = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

// Supabase (utilise les mêmes variables d'env que ton projet)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Helpers XML ──
function xmlHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>`;
}

function urlEntry(loc, changefreq = 'monthly', priority = '0.8') {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function sitemapIndexEntry(loc) {
  return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>`;
}

// ── Génération sitemap-main.xml (pages statiques) ──
async function generateMainSitemap() {
  const urls = [
    urlEntry(`${SITE_URL}/`, 'monthly', '1.0'),
    urlEntry(`${SITE_URL}/contact`, 'yearly', '0.3'),
  ];

  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap-main.xml'), xml, 'utf-8');
  console.log('✅ sitemap-main.xml créé');
}

// ── Génération sitemap-[dept].xml (communes par département) ──
async function generateDepartmentSitemaps() {
  console.log('📊 Récupération des communes...');

  let allCommunes = [];
  let from = 0;
  const batchSize = 1000;

  while (true) {
    const { data: batch, error } = await supabase
      .from('communes')
      .select('code_commune')
      .not('code_commune', 'is', null)
      .order('code_commune')
      .range(from, from + batchSize - 1);

    if (error) {
      console.error('❌ Erreur:', error);
      process.exit(1);
    }

    if (!batch || batch.length === 0) break;

    allCommunes = allCommunes.concat(batch);
    console.log(`   Batch ${Math.floor(from / batchSize) + 1}: ${batch.length} communes (total: ${allCommunes.length})`);

    if (batch.length < batchSize) break; // Dernière page
    from += batchSize;
  }

  console.log(`📊 ${allCommunes.length} communes trouvées au total\n`);

  // Grouper par département
  const communesByDept = {};

  allCommunes.forEach(({ code_commune }) => {
    let dept;

    if (code_commune.startsWith('2A')) {
      dept = '2A';
    } else if (code_commune.startsWith('2B')) {
      dept = '2B';
    } else {
      dept = code_commune.substring(0, 2);
    }

    if (!communesByDept[dept]) {
      communesByDept[dept] = [];
    }
    communesByDept[dept].push(code_commune);
  });

  console.log(`📊 ${Object.keys(communesByDept).length} départements trouvés`);

  for (const [dept, codes] of Object.entries(communesByDept)) {
    console.log(`   Dept ${dept}: ${codes.length} communes`);
  }

  // Générer les sitemaps
  const sitemapFiles = [];

  for (const [dept, codes] of Object.entries(communesByDept)) {
    const urls = codes.map(code =>
      urlEntry(`${SITE_URL}/commune/${code}`, 'monthly', '0.8')
    );

    const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    const filename = `sitemap-${dept}.xml`;
    await fs.writeFile(path.join(OUTPUT_DIR, filename), xml, 'utf-8');

    sitemapFiles.push(filename);
    console.log(`  ✅ ${filename} créé (${codes.length} communes)`);
  }

  return sitemapFiles;
}

// ── Génération sitemap.xml (index principal) ──
async function generateSitemapIndex(departmentFiles) {
  const sitemaps = [
    sitemapIndexEntry(`${SITE_URL}/sitemap-main.xml`),
    ...departmentFiles.map(file =>
      sitemapIndexEntry(`${SITE_URL}/${file}`)
    ),
  ];

  const xml = `${xmlHeader()}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log('✅ sitemap.xml (index) créé');
}

// ── Main ──
async function main() {
  console.log('🚀 Génération des sitemaps Loxo...\n');

  try {
    // 1. Pages statiques
    await generateMainSitemap();

    // 2. Communes par département
    const departmentFiles = await generateDepartmentSitemaps();

    // 3. Index principal
    await generateSitemapIndex(departmentFiles);

    console.log(`\n✅ Génération terminée !`);
    console.log(`📁 Fichiers créés dans ${OUTPUT_DIR}/`);
    console.log(`📊 Total : ${departmentFiles.length + 2} fichiers XML`);
    console.log(`\n💡 Prochaines étapes :`);
    console.log(`   1. Vérifier ${SITE_URL}/sitemap.xml après déploiement`);
    console.log(`   2. Soumettre à Google Search Console`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

main();

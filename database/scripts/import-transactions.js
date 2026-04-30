// Script d'import DVF (Demandes de Valeurs Foncières)
// Source: https://files.data.gouv.fr/geo-dvf/latest/csv/

// Remplir les variables : 
const DEPARTEMENTS = ['01', '69', '38']; // Ain + Rhône + Isère
const ANNEES = [2021, 2022, 2023, 2024, 2025];

// Le système va exclure :
// Toutes les transactions qui ne correspondent pas a des maisons ou appartement 
// Toutes les transations en dehors des bornes définies (m2, prix, prixm2)
// Toutes les transactions sur des communes qui n'existent plus
// Toutes les transactions sur une commune avec plus de 10 transactions qui sont au dela de 3 ecart type. 


import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import csv from 'csv-parser';
import { Readable } from 'stream';

dotenv.config({ path: '.env.local' });

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erreur: Variables d\'environnement manquantes');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Client Supabase initialisé\n');


async function downloadDVF(departement, annee) {
    const url = `https://files.data.gouv.fr/geo-dvf/latest/csv/${annee}/departements/${departement}.csv.gz`;

    console.log(`📥 Téléchargement ${departement} ${annee}...`);
    console.log(`   URL: ${url}`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Convertir ReadableStream Web en Node.js stream
        const nodeStream = Readable.fromWeb(response.body);

        console.log(`✅ Téléchargement réussi (fichier compressé .gz)\n`);
        return nodeStream;

    } catch (error) {
        console.error(`❌ Erreur téléchargement:`, error.message);
        throw error;
    }
}

async function parseDVF(stream, departement, annee) {
    console.log(`📝 Parsing CSV ${departement} ${annee}...`);

    const transactions = [];
    const stats = {
        total: 0,
        valides: 0,
        rejets: {
            typeLocal: 0,
            prix: 0,
            surface: 0,
            prixM2: 0,
            sansSurface: 0
        },
        // Stats pour analyse
        typesLocauxRejetes: {},
        exemplesRejetsPrix: [],
        exemplesRejetsSurface: [],
        exemplesRejetsPrixM2: []
    };
    // Mapping type_local vers CHAR(1)
    const typeMapping = {
        'Maison': 'M',
        'Appartement': 'A'
    };

    // Décompression + parsing
    const gunzip = createGunzip();
    const parser = csv();

    return new Promise((resolve, reject) => {
        stream
            .pipe(gunzip)
            .pipe(parser)
            .on('data', (row) => {
                stats.total++;

                // Si ce n'est ni une maison ni un appartement on exclu 
                if (row.type_local !== 'Maison' && row.type_local !== 'Appartement') {
                    stats.rejets.typeLocal++;
                    stats.typesLocauxRejetes[row.type_local] = (stats.typesLocauxRejetes[row.type_local] || 0) + 1;
                    return;
                }

                // Si le prix est inférieur à 5000€ ou supérieur à 10 millions on exclu
                const valeur = parseFloat(row.valeur_fonciere);
                if (!valeur || valeur < 5000 || valeur > 10000000) {
                    stats.rejets.prix++;
                    // Garder 10 exemples
                    if (stats.exemplesRejetsPrix.length < 10) {
                        stats.exemplesRejetsPrix.push({
                            type: row.type_local,
                            prix: valeur,
                            commune: row.code_commune
                        });
                    }
                    return;
                }

                // Si la surface n'est pas renseigné ou quelle est hors borne on exclu
                const surface = parseFloat(row.surface_reelle_bati);
                if (!surface || surface < 8 || surface > 500) {
                    if (!surface) {
                        stats.rejets.sansSurface++;
                    } else {
                        stats.rejets.surface++;
                        // Garder 10 exemples
                        if (stats.exemplesRejetsSurface.length < 10) {
                            stats.exemplesRejetsSurface.push({
                                type: row.type_local,
                                surface: surface,
                                prix: valeur,
                                commune: row.code_commune
                            });
                        }
                    }
                    return;
                }

                // Si le prix au m2 est hors borne on exclu
                const prixM2 = valeur / surface;
                if (prixM2 < 100 || prixM2 > 20000) {
                    stats.rejets.prixM2++;
                    // Garder 10 exemples
                    if (stats.exemplesRejetsPrixM2.length < 10) {
                        stats.exemplesRejetsPrixM2.push({
                            type: row.type_local,
                            surface: surface,
                            prix: valeur,
                            prixM2: Math.round(prixM2),
                            commune: row.code_commune
                        });
                    }
                    return;
                }

                const transaction = {
                    date_mutation: row.date_mutation,
                    valeur_fonciere: Math.round(valeur),
                    code_commune: row.code_commune,
                    type_local: typeMapping[row.type_local],
                    surface_reelle_bati: surface,
                    surface_terrain: parseFloat(row.surface_terrain) || null,
                    nombre_pieces_principales: parseInt(row.nombre_pieces_principales) || null,
                    id_parcelle: row.id_parcelle || null,
                    latitude: parseFloat(row.latitude) || null,
                    longitude: parseFloat(row.longitude) || null,
                    numero_voie: row.adresse_numero || null,
                    nom_voie: row.adresse_nom_voie || null,
                    // Temporaire pour filtre écart-type
                    prix_m2: prixM2
                };

                transactions.push(transaction);
                stats.valides++;

            })
            .on('end', () => {
                console.log(`✅ Parsing terminé:`);
                console.log(`   Total lignes: ${stats.total}`);
                console.log(`   Valides: ${stats.valides} (${((stats.valides / stats.total) * 100).toFixed(1)}%)`);
                console.log(`   Rejets: ${stats.total - stats.valides}`);
                console.log('');
                resolve({ transactions, stats });
            })
            .on('error', reject);
    });
}

function filterOutliersByCommune(transactions) {
    console.log('📊 Filtrage outliers par écart-type...\n');

    // Étape 1 : Grouper par commune
    const parCommune = {};

    transactions.forEach(t => {
        if (!parCommune[t.code_commune]) {
            parCommune[t.code_commune] = [];
        }
        parCommune[t.code_commune].push(t);
    });

    const nbCommunesTotales = Object.keys(parCommune).length;

    // Étape 2 : Calculer stats pour communes avec >= 10 transactions
    const statsCommunes = {};

    Object.keys(parCommune).forEach(codeCommune => {
        const trans = parCommune[codeCommune];

        if (trans.length >= 10) {
            const prixM2 = trans.map(t => t.prix_m2);
            const mean = prixM2.reduce((a, b) => a + b, 0) / prixM2.length;
            const variance = prixM2.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / prixM2.length;
            const stdDev = Math.sqrt(variance);

            statsCommunes[codeCommune] = {
                mean: mean,
                stdDev: stdDev,
                count: trans.length,
                min: mean - 3 * stdDev,
                max: mean + 3 * stdDev
            };
        }
    });

    const nbCommunesAvecStats = Object.keys(statsCommunes).length;
    console.log(`   ${nbCommunesAvecStats} communes avec >= 10 transactions (sur ${nbCommunesTotales} communes)`);

    // Étape 3 : Filtrer outliers
    let totalOutliers = 0;

    const filtered = transactions.filter(t => {
        const stat = statsCommunes[t.code_commune];

        // Si pas assez de données pour cette commune, on garde
        if (!stat) return true;

        // Vérifier si dans ±3 écarts-types
        if (t.prix_m2 < stat.min || t.prix_m2 > stat.max) {
            totalOutliers++;
            return false;
        }

        return true;
    });

    console.log(`   ${totalOutliers} outliers détectés et exclus`);
    console.log(`   ${filtered.length} transactions conservées\n`);

    // Retirer le champ temporaire prix_m2
    filtered.forEach(t => delete t.prix_m2);

    return filtered;
}

function analyseRejets(stats) {
    console.log('🔍 ANALYSE DES REJETS\n');

    // 1. Types locaux rejetés
    console.log('📊 Types locaux rejetés:');
    const sorted = Object.entries(stats.typesLocauxRejetes)
        .sort((a, b) => b[1] - a[1]);
    sorted.forEach(([type, count]) => {
        console.log(`   - ${type || '(vide)'}: ${count}`);
    });
    console.log('');

    // 2. Exemples rejets prix
    if (stats.exemplesRejetsPrix.length > 0) {
        console.log('💰 Exemples rejets prix (< 5k€ ou > 10M€):');
        stats.exemplesRejetsPrix.slice(0, 5).forEach(ex => {
            console.log(`   - ${ex.type}: ${ex.prix}€ (commune ${ex.commune})`);
        });
        console.log('');
    }

    // 3. Exemples rejets surface
    if (stats.exemplesRejetsSurface.length > 0) {
        console.log('📐 Exemples rejets surface (< 8m² ou > 500m²):');
        stats.exemplesRejetsSurface.slice(0, 5).forEach(ex => {
            console.log(`   - ${ex.type}: ${ex.surface}m² - ${ex.prix}€ (commune ${ex.commune})`);
        });
        console.log('');
    }

    // 4. Exemples rejets prix/m²
    if (stats.exemplesRejetsPrixM2.length > 0) {
        console.log('💸 Exemples rejets prix/m² (< 100€ ou > 20k€/m²):');
        stats.exemplesRejetsPrixM2.slice(0, 5).forEach(ex => {
            console.log(`   - ${ex.type}: ${ex.prixM2}€/m² (${ex.surface}m², ${ex.prix}€, commune ${ex.commune})`);
        });
        console.log('');
    }
}

async function validateCommunes(transactions, supabase) {
    console.log('🔍 Validation codes communes...\n');

    // Récupérer TOUTES les communes avec pagination
    let allCommunes = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('communes')
            .select('code_commune')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            throw new Error(`Erreur lecture communes: ${error.message}`);
        }

        if (data.length === 0) break;

        allCommunes = allCommunes.concat(data);
        page++;

        if (data.length < pageSize) break; // Dernière page
    }

    const validCodes = new Set(allCommunes.map(c => c.code_commune));
    console.log(`   ${validCodes.size} communes valides en base`);

    // Filtrer
    const valid = [];
    const invalid = new Set();

    transactions.forEach(t => {
        if (validCodes.has(t.code_commune)) {
            valid.push(t);
        } else {
            invalid.add(t.code_commune);
        }
    });

    if (invalid.size > 0) {
        console.log(`   ⚠️ ${transactions.length - valid.length} transactions avec communes inexistantes:`);
        console.log(`   Codes: ${[...invalid].slice(0, 10).join(', ')}${invalid.size > 10 ? '...' : ''}`);
    }

    console.log(`   ✅ ${valid.length} transactions avec communes valides\n`);

    return valid;
}

async function insertBatch(transactions, supabase, departement, annee) {
    const BATCH_SIZE = 1000;
    const total = transactions.length;

    console.log(`💾 Insertion ${total} transactions (dept ${departement} ${annee})...\n`);

    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = transactions.slice(i, i + BATCH_SIZE);

        try {
            const { error } = await supabase
                .from('transactions')
                .insert(batch);

            if (error) throw error;

            inserted += batch.length;
            const progress = ((inserted / total) * 100).toFixed(1);
            console.log(`   ✅ ${inserted}/${total} (${progress}%)`);

        } catch (error) {
            console.error(`   ❌ Erreur batch ${i}-${i + BATCH_SIZE}:`, error.message);
            errors += batch.length;
        }
    }

    console.log(`\n✅ Insertion terminée: ${inserted} succès, ${errors} erreurs\n`);

    return { inserted, errors };
}


async function importDepartement(dept, annee) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 IMPORT DVF ${dept} - ${annee}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
        // 1. Téléchargement
        const stream = await downloadDVF(dept, annee);

        // 2. Parsing & filtres de base
        let { transactions, stats } = await parseDVF(stream, dept, annee);

        // Afficher analyse rejets seulement pour le premier import (éviter spam)
        // analyseRejets(stats);

        // 3. Filtre écart-type
        transactions = filterOutliersByCommune(transactions);

        // 4. Validation communes
        transactions = await validateCommunes(transactions, supabase);

        // 5. Insertion
        if (transactions.length > 0) {
            const { inserted, errors } = await insertBatch(transactions, supabase, dept, annee);

            console.log(`✅ Import ${dept} ${annee} terminé: ${inserted} insérées, ${errors} erreurs\n`);

            return { dept, annee, inserted, errors };
        } else {
            console.log(`⚠️ Aucune transaction à insérer pour ${dept} ${annee}\n`);
            return { dept, annee, inserted: 0, errors: 0 };
        }

    } catch (error) {
        console.error(`❌ Erreur import ${dept} ${annee}:`, error.message);
        return { dept, annee, inserted: 0, errors: 'ERREUR' };
    }
}

async function main() {
    const startTime = Date.now();

    console.log('\n🎯 LANCEMENT IMPORT DVF COMPLET\n');
    console.log(`Configuration:`);
    console.log(`  Départements: ${DEPARTEMENTS.join(', ')}`);
    console.log(`  Années: ${ANNEES.join(', ')}`);
    console.log(`  Total imports: ${DEPARTEMENTS.length * ANNEES.length}\n`);

    const results = [];

    // Boucle sur tous les départements × années
    for (const dept of DEPARTEMENTS) {
        for (const annee of ANNEES) {
            const result = await importDepartement(dept, annee);
            results.push(result);
        }
    }

    // Récapitulatif final
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 IMPORT COMPLET TERMINÉ');
    console.log('='.repeat(60) + '\n');

    console.log('📊 Récapitulatif par département × année:\n');

    results.forEach(r => {
        const status = r.errors === 'ERREUR' ? '❌ ERREUR' : `✅ ${r.inserted}`;
        console.log(`  ${r.dept} ${r.annee}: ${status}`);
    });

    const totalInserted = results
        .filter(r => r.errors !== 'ERREUR')
        .reduce((sum, r) => sum + r.inserted, 0);

    console.log(`\n📈 Total transactions insérées: ${totalInserted}`);
    console.log(`⏱️  Durée totale: ${duration} minutes\n`);
}

main();
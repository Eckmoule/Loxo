// Scripts pour charger la table communes a partir de l'API : https://geo.api.gouv.fr/communes
// A lancer via node import-communes.js

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erreur: Variables d\'environnement manquantes');
    console.error('Vérifiez que SUPABASE_URL et SUPABASE_SERVICE_KEY sont dans .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Client Supabase initialisé\n');

async function fetchCommunes() {
    console.log('📡 Appel à l\'API geo.gouv.fr...\n');

    const API_URL = 'https://geo.api.gouv.fr/communes';
    const FIELDS = 'nom,code,codesPostaux,codeDepartement,centre,population';

    const url = `${API_URL}?fields=${FIELDS}&type=commune-actuelle,arrondissement-municipal`;
    console.log(`URL: ${url}\n`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const communes = await response.json();

        console.log(`✅ ${communes.length} communes récupérées\n`);

        return communes;

    } catch (error) {
        console.error('❌ Erreur lors de l\'appel API:');
        console.error(error.message);
        process.exit(1);
    }
}

function mapCommune(data) {
    return {
        code_commune: data.code,
        nom_commune: data.nom,
        code_departement: data.codeDepartement,
        code_postal: data.codesPostaux || [],
        latitude: data.centre?.coordinates?.[1] || null, // GeoJSON = [lon, lat]
        longitude: data.centre?.coordinates?.[0] || null,
        population: data.population || null
    };
}

async function insertCommunes(communes) {
    console.log('\n💾 Insertion dans Supabase...\n');

    const BATCH_SIZE = 1000;
    const total = communes.length;
    let inserted = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = communes.slice(i, i + BATCH_SIZE);
        const batchMapped = batch.map(mapCommune);

        try {
            const { error } = await supabase
                .from('communes')
                .insert(batchMapped);

            if (error) throw error;

            inserted += batch.length;
            const progress = ((inserted / total) * 100).toFixed(1);
            console.log(`✅ ${inserted}/${total} (${progress}%)`);

        } catch (error) {
            console.error(`❌ Erreur batch ${i}-${i + BATCH_SIZE}:`, error.message);
            return false;
        }
    }

    console.log(`\n✅ ${inserted} communes insérées avec succès !`);
    return true;
}

async function main() {
    const communes = await fetchCommunes();

    // Insertion
    const success = await insertCommunes(communes);

    if (success) {
        console.log('\n🎉 Import terminé avec succès !');
    } else {
        console.log('\n❌ Échec de l\'import');
        process.exit(1);
    }
}

main();




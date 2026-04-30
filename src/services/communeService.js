import { supabase } from '../lib/supabase';

/**
 * Recherche des communes par nom ou code postal
 * @param {string} query - Texte de recherche (minimum 2 caractères)
 * @returns {Promise<Array>} Liste des communes correspondantes (max 5)
 */
export async function searchCommunes(query) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const isNumeric = /^\d+$/.test(query);

        if (isNumeric) {
            // Recherche de code postal : récupérer toutes les communes du département
            // et filtrer côté client (plus efficace que récupérer toute la France)
            const dept = query.substring(0, 2);

            const { data, error } = await supabase
                .from('communes')
                .select('code_commune, nom_commune, code_postal')
                .eq('code_departement', dept)
                .order('population', { ascending: false }) // Trier par population décroissante
                .limit(500);

            if (error) throw error;

            // Filtrer les communes dont au moins un code postal commence par query
            const results = (data || []).filter(commune =>
                commune.code_postal.some(cp => cp.startsWith(query))
            );

            return results.slice(0, 5);

        } else {
            // Recherche par nom de commune
            const { data, error } = await supabase
                .from('communes')
                .select('code_commune, nom_commune, code_postal')
                .ilike('nom_commune', `%${query}%`)
                .order('population', { ascending: false }) // Trier par population décroissante
                .limit(5);

            if (error) throw error;

            return data || [];
        }

    } catch (error) {
        console.error('Erreur recherche communes:', error);
        return [];
    }
}
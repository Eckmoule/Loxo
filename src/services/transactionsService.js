import { supabase } from '../lib/supabase';

/**
 * Récupère les années disponibles pour une commune (sans charger toutes les transactions)
 * @param {string} codeCommune - Code INSEE de la commune
 * @returns {Promise<Array<number>>} Liste des années disponibles triées (plus récente en premier)
 */
export async function getAnneesDisponibles(codeCommune) {
    try {
        const { data, error } = await supabase
            .rpc('get_annees_disponibles', { code_commune_param: codeCommune });

        if (error) throw error;

        // La fonction retourne [{annee: 2025}, {annee: 2024}, ...]
        return (data || []).map(row => row.annee);
    } catch (error) {
        console.error('Erreur récupération années disponibles:', error);
        return [];
    }
}
/**
 * Récupère les transactions d'une commune 
 */
export async function getTransactionsCommune(codeCommune, annees = null) {
    try {
        const allTransactions = [];
        let start = 0;
        const pageSize = 1000;
        let hasMore = true;

        // Construire la requête de base
        let query = supabase
            .from('transactions')
            .select('id, date_mutation, type_local, nombre_pieces_principales, surface_reelle_bati, surface_terrain, numero_voie, nom_voie, valeur_fonciere', { count: 'exact' })
            .eq('code_commune', codeCommune)
            .order('date_mutation', { ascending: false });

        // Filtrer par années si spécifié
        if (annees && annees.length > 0) {
            // Créer des filtres OR corrects pour Supabase
            const orFilters = annees.map(year =>
                `and(date_mutation.gte.${year}-01-01,date_mutation.lte.${year}-12-31)`
            ).join(',');

            query = query.or(orFilters);
        }

        // Paginer
        while (hasMore) {
            const { data, error } = await query.range(start, start + pageSize - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                allTransactions.push(...data);
                start += pageSize;
                hasMore = data.length === pageSize;
            } else {
                hasMore = false;
            }
        }

        // Formater les données
        return allTransactions.map(t => ({
            id: t.id,
            date_mutation: t.date_mutation,
            type_local: t.type_local,
            nombre_pieces_principales: t.nombre_pieces_principales,
            surface_reelle_bati: t.surface_reelle_bati,
            surface_terrain: t.surface_terrain,
            adresse: formatAdresse(t.numero_voie, t.nom_voie),
            valeur_fonciere: t.valeur_fonciere,
            prix_m2: Math.round(t.valeur_fonciere / t.surface_reelle_bati)
        }));
    } catch (error) {
        console.error('Erreur récupération transactions:', error);
        return [];
    }
}

/**
 * Formate une adresse à partir du numéro et du nom de voie
 */
function formatAdresse(numero, nomVoie) {
    if (!nomVoie) return 'Adresse non renseignée';
    if (!numero) return nomVoie;
    return `${numero} ${nomVoie}`;
}
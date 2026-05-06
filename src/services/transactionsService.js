import { supabase } from '../lib/supabase';

/**
 * Récupère les transactions d'une commune 
 */
export async function getTransactionsCommune(codeCommune) {
    try {
        const allTransactions = [];
        let start = 0;
        const pageSize = 1000;
        let hasMore = true;

        // Paginer jusqu'à récupérer toutes les transactions
        while (hasMore) {
            const { data, error, count } = await supabase
                .from('transactions')
                .select('id, date_mutation, type_local, nombre_pieces_principales, surface_reelle_bati, surface_terrain, numero_voie, nom_voie, valeur_fonciere', { count: 'exact' })
                .eq('code_commune', codeCommune)
                .order('date_mutation', { ascending: false })
                .range(start, start + pageSize - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                allTransactions.push(...data);
                start += pageSize;
                hasMore = data.length === pageSize;
            } else {
                hasMore = false;
            }
        }

        // Formater les données pour le frontend
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
import { supabase } from '../lib/supabase';

/**
 * Récupère les agrégats d'une commune
 * @param {string} codeCommune - Code INSEE de la commune
 * @returns {Promise<Array>} Liste des agrégats
 */
export async function getAggregatsCommune(codeCommune) {
    try {
        const { data, error } = await supabase
            .from('agregats')
            .select('trimestre, type_local, prix_m2_median, prix_median, nb_transactions')
            .eq('code_commune', codeCommune)
            .order('trimestre', { ascending: true });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Erreur récupération agrégats:', error);
        return [];
    }
}

/**
 * Transforme les agrégats en format pour le graphique
 * @param {Array} agregats - Données brutes de Supabase
 * @returns {Object} Données formatées pour LineChart
 */
export function formatAggregatsForChart(agregats) {
    // Grouper par type et trimestre
    const grouped = {
        appartement: { all: [], '2p': [], '3p': [] },
        maison: { all: [] }
    };

    const labels = [];
    const trimestresSet = new Set();

    agregats.forEach(agg => {
        const trimestre = new Date(agg.trimestre);
        const year = trimestre.getFullYear();
        const quarter = Math.floor(trimestre.getMonth() / 3) + 1;
        const label = `T${quarter} ${year}`;

        if (!trimestresSet.has(label)) {
            trimestresSet.add(label);
            labels.push(label);
        }

        // Type A = Appartement, M = Maison, T = Tous
        if (agg.type_local === 'A') {
            grouped.appartement.all.push(agg.prix_m2_median);
        } else if (agg.type_local === 'M') {
            grouped.maison.all.push(agg.prix_m2_median);
        }
    });

    // Calculer stats
    const allPrices = agregats.map(a => a.prix_m2_median);
    const lastQuarter = agregats.filter(a => a.type_local === 'T').slice(-1)[0];

    const stats = {
        mediane: lastQuarter ? Math.round(lastQuarter.prix_m2_median) : 0,
        volume: agregats.reduce((sum, a) => sum + a.nb_transactions, 0),
        tendance: 0 // À calculer
    };

    return {
        priceHistory: grouped,
        labels,
        stats
    };
}
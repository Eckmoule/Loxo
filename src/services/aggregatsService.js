import { supabase } from '../lib/supabase';

/**
 * Récupère tous les agrégats d'une commune
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
 * Calcule l'indicateur de fiabilité
 */
function calculerFiabilite(agregats) {
    const totalTransactions = agregats.reduce((sum, a) => sum + a.nb_transactions, 0);
    const minTrimestre = Math.min(...agregats.map(a => a.nb_transactions));

    let niveau = 'limite';
    if (minTrimestre >= 10) niveau = 'excellent';
    else if (minTrimestre >= 5) niveau = 'bon';

    return {
        total_transactions: totalTransactions,
        min_trimestre: minTrimestre,
        niveau
    };
}

/**
 * Formate un trimestre en label "T1'21"
 */
function formatTrimestre(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `T${quarter}'${year}`;
}

/**
 * Prépare les données pour le graphique principal
 */
function prepareGraphiqueData(agregats, filtre) {
    // Filtrer selon le type
    let filtered = agregats;
    if (filtre === 'appartements') {
        filtered = agregats.filter(a => a.type_local === 'A');
    } else if (filtre === 'maisons') {
        filtered = agregats.filter(a => a.type_local === 'M');
    } else {
        // 'tous' = type_local 'T'
        filtered = agregats.filter(a => a.type_local === 'T');
    }

    return filtered.map(a => ({
        trimestre: formatTrimestre(a.trimestre),
        prix_m2: Math.round(a.prix_m2_median),
        nb: a.nb_transactions
    }));
}

/**
 * Calcule les stats des 12 derniers mois
 */
function calculerStats12Mois(agregats, filtre) {
    // Filtrer selon le type
    let filtered = agregats;
    if (filtre === 'appartements') {
        filtered = agregats.filter(a => a.type_local === 'A');
    } else if (filtre === 'maisons') {
        filtered = agregats.filter(a => a.type_local === 'M');
    } else {
        filtered = agregats.filter(a => a.type_local === 'T');
    }

    // Trier par date décroissante
    const sorted = [...filtered].sort((a, b) =>
        new Date(b.trimestre) - new Date(a.trimestre)
    );

    // 12 derniers mois = 4 derniers trimestres
    const derniers4 = sorted.slice(0, 4);
    const precedents4 = sorted.slice(4, 8);

    if (derniers4.length === 0) {
        return null;
    }

    // Prix m² moyen des 4 derniers trimestres
    const prixM2Actuel = derniers4.reduce((sum, a) => sum + a.prix_m2_median, 0) / derniers4.length;
    const prixM2Precedent = precedents4.length > 0
        ? precedents4.reduce((sum, a) => sum + a.prix_m2_median, 0) / precedents4.length
        : prixM2Actuel;
    const evolPrixM2 = ((prixM2Actuel - prixM2Precedent) / prixM2Precedent * 100).toFixed(1);

    // Achat moyen
    const achatActuel = derniers4.reduce((sum, a) => sum + a.prix_median, 0) / derniers4.length;
    const achatPrecedent = precedents4.length > 0
        ? precedents4.reduce((sum, a) => sum + a.prix_median, 0) / precedents4.length
        : achatActuel;
    const evolAchat = ((achatActuel - achatPrecedent) / achatPrecedent * 100).toFixed(1);

    // Transactions
    const nbActuel = derniers4.reduce((sum, a) => sum + a.nb_transactions, 0);
    const nbPrecedent = precedents4.length > 0
        ? precedents4.reduce((sum, a) => sum + a.nb_transactions, 0)
        : nbActuel;
    const evolTransactions = ((nbActuel - nbPrecedent) / nbPrecedent * 100).toFixed(1);

    // Répartition M/A (calculé sur type 'T' uniquement)
    const agregatsT = agregats.filter(a => a.type_local === 'T');
    const derniers4T = agregatsT.slice(-4);
    const nbTotalRecent = derniers4T.reduce((sum, a) => sum + a.nb_transactions, 0);

    const agregatsM = agregats.filter(a => a.type_local === 'M');
    const derniers4M = agregatsM.slice(-4);
    const nbMaisons = derniers4M.reduce((sum, a) => sum + a.nb_transactions, 0);

    const agregatsA = agregats.filter(a => a.type_local === 'A');
    const derniers4A = agregatsA.slice(-4);
    const nbApparts = derniers4A.reduce((sum, a) => sum + a.nb_transactions, 0);

    const maisonsPct = nbTotalRecent > 0 ? Math.round((nbMaisons / nbTotalRecent) * 100) : 0;
    const appartsPct = nbTotalRecent > 0 ? Math.round((nbApparts / nbTotalRecent) * 100) : 0;

    return {
        prix_m2: {
            valeur: Math.round(prixM2Actuel),
            evolution_pct: parseFloat(evolPrixM2),
            direction: evolPrixM2 > 0 ? 'up' : evolPrixM2 < 0 ? 'down' : 'stable'
        },
        achat_moyen: {
            valeur: Math.round(achatActuel),
            evolution_pct: parseFloat(evolAchat),
            direction: evolAchat > 0 ? 'up' : evolAchat < 0 ? 'down' : 'stable'
        },
        repartition: {
            maisons_pct: maisonsPct,
            appartements_pct: appartsPct
        },
        transactions: {
            total: nbActuel,
            evolution_pct: parseFloat(evolTransactions),
            direction: evolTransactions > 0 ? 'up' : evolTransactions < 0 ? 'down' : 'stable'
        }
    };
}

/**
 * Calcule l'évolution annuelle
 */
function calculerEvolAnnuelle(agregats, filtre) {
    // Filtrer selon le type
    let filtered = agregats;
    if (filtre === 'appartements') {
        filtered = agregats.filter(a => a.type_local === 'A');
    } else if (filtre === 'maisons') {
        filtered = agregats.filter(a => a.type_local === 'M');
    } else {
        filtered = agregats.filter(a => a.type_local === 'T');
    }

    // Grouper par année
    const parAnnee = {};
    filtered.forEach(a => {
        const year = new Date(a.trimestre).getFullYear();
        if (!parAnnee[year]) parAnnee[year] = [];
        parAnnee[year].push(a);
    });

    // Calculer moyenne par année
    const annees = Object.keys(parAnnee).sort();
    const evolution = annees.map((year, index) => {
        const agregatsAnnee = parAnnee[year];
        const prixMoyen = agregatsAnnee.reduce((sum, a) => sum + a.prix_m2_median, 0) / agregatsAnnee.length;

        let variation_pct = null;
        if (index > 0) {
            const anneePrecedente = annees[index - 1];
            const agregatsPrec = parAnnee[anneePrecedente];
            const prixPrec = agregatsPrec.reduce((sum, a) => sum + a.prix_m2_median, 0) / agregatsPrec.length;
            variation_pct = Math.round(((prixMoyen - prixPrec) / prixPrec) * 100);
        }

        return {
            annee: parseInt(year),
            prix_m2: Math.round(prixMoyen),
            variation_pct
        };
    });

    return evolution;
}

/**
 * Détermine les filtres disponibles
 */
function determinerFiltresDisponibles(agregats) {
    const types = new Set(agregats.map(a => a.type_local));

    return {
        tous: types.has('T'),
        maisons: types.has('M'),
        appartements: types.has('A')
    };
}

/**
 * Fonction principale : formater toutes les données pour la page commune
 */
export function formatCommuneData(agregats, filtre = 'tous') {
    if (!agregats || agregats.length === 0) {
        return null;
    }

    const stats12Mois = calculerStats12Mois(agregats, filtre); // Temporaire

    return {
        fiabilite: calculerFiabilite(agregats),
        filtres_disponibles: determinerFiltresDisponibles(agregats),
        graphique_prix: prepareGraphiqueData(agregats, filtre),
        stats_12_mois: calculerStats12Mois(agregats, filtre),
        evolution_annuelle: calculerEvolAnnuelle(agregats, filtre),
        // Temporaire
        stats: stats12Mois ? {
            mediane: stats12Mois.prix_m2.valeur,
            volume: stats12Mois.transactions.total,
            tendance: stats12Mois.prix_m2.evolution_pct
        } : null,
        priceHistory: {
            appartement: { all: [] },
            maison: { all: [] }
        },
        labels: []
    };
}
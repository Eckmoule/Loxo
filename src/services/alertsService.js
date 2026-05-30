import { supabase } from '../lib/supabase';

/**
 * Récupère l'alerte d'un user pour une commune
 */
export async function getAlert(codeCommune) {
    const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('code_commune', codeCommune)
        .maybeSingle();

    if (error) return null;
    return data;
}

/**
 * Suivre une commune
 * - Si n'existe pas → INSERT
 * - Si existe mais inactive → réactive
 */
export async function followCommune(codeCommune) {
    const { data: { session } } = await supabase.auth.getSession();

    // Vérifier si une alerte existe déjà
    const existing = await getAlert(codeCommune);

    if (existing) {
        const { error } = await supabase
            .from('user_alerts')
            .update({ is_active: true })
            .eq('code_commune', codeCommune)
            .eq('user_id', session.user.id);
        return { error };
    }

    // Créer une nouvelle alerte avec user_id explicite
    const { error } = await supabase
        .from('user_alerts')
        .insert({
            code_commune: codeCommune,
            is_active: true,
            user_id: session.user.id
        });

    return { error };
}

/**
 * Ne plus suivre une commune (soft delete)
 */
export async function unfollowCommune(codeCommune) {
    const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: false })
        .eq('code_commune', codeCommune);

    return { error };
}

/**
 * Récupère toutes les alertes actives de l'utilisateur
 * avec les infos des communes
 */
export async function getUserAlerts() {
    // 1. Récupérer les alertes
    const { data: alerts, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error || !alerts) return [];

    console.log('Alertes raw:', alerts, 'Error:', error);

    // 2. Récupérer les infos communes séparément
    const codes = alerts.map(a => a.code_commune);
    console.log('Codes communes:', codes);

    const { data: communes, error: error2 } = await supabase
        .from('communes')
        .select('code_commune, nom_commune, code_postal')
        .in('code_commune', codes);

    console.log('Communes raw:', communes, 'Error2:', error2);

    // 3. Fusionner les données
    return alerts.map(alert => ({
        ...alert,
        commune: communes?.find(c => c.code_commune === alert.code_commune) || null
    }));
}
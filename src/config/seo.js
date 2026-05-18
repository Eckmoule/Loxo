export const SEO_CONFIG = {
    // Période des données
    DATA_PERIOD_START: 2021,
    DATA_PERIOD_END: 2025,
    DATA_PERIOD_LABEL: '2021-2025',

    // Dernière mise à jour
    LAST_UPDATE_MONTH: 'Décembre',
    LAST_UPDATE_YEAR: 2025,

    // Site
    SITE_NAME: 'Loxo',
    SITE_URL: 'https://loxo.fr',

    // Descriptions réutilisables
    DATA_SOURCE: 'Données notariales publiques (DVF)',

    // Helper pour formater la dernière MAJ
    getLastUpdateLabel: () => `${SEO_CONFIG.LAST_UPDATE_MONTH} ${SEO_CONFIG.LAST_UPDATE_YEAR}`,
}
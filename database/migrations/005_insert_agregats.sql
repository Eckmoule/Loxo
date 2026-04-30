
-- ============================================================================
-- INSERTION AGRÉGATS PAR TYPE (Maisons et Appartements)
-- ============================================================================

INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  code_commune,
  DATE_TRUNC('quarter', date_mutation) AS trimestre,
  type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY valeur_fonciere / NULLIF(surface_reelle_bati, 0)
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY valeur_fonciere
  ))::INT AS prix_median,
  COUNT(*) AS nb_transactions
FROM transactions
WHERE 
  type_local IN ('M', 'A')
  AND valeur_fonciere > 0
  AND surface_reelle_bati > 0
GROUP BY code_commune, DATE_TRUNC('quarter', date_mutation), type_local;

-- ============================================================================
-- INSERTION AGRÉGATS TOUS TYPES (T)
-- ============================================================================

INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  code_commune,
  DATE_TRUNC('quarter', date_mutation) AS trimestre,
  'T' AS type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY valeur_fonciere / NULLIF(surface_reelle_bati, 0)
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY valeur_fonciere
  ))::INT AS prix_median,
  COUNT(*) AS nb_transactions
FROM transactions
WHERE 
  type_local IN ('M', 'A')
  AND valeur_fonciere > 0
  AND surface_reelle_bati > 0
GROUP BY code_commune, DATE_TRUNC('quarter', date_mutation);

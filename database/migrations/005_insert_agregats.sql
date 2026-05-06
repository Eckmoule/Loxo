
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

-- ============================================================================
-- AGRÉGATS POUR COMMUNES AVEC ARRONDISSEMENTS
-- ============================================================================
-- Calcule les agrégats des communes "parent" (Lyon, Paris, Marseille)
-- en agrégeant les données de leurs arrondissements

-- Lyon (69123) - Agrège les 9 arrondissements (69381-69389)
-- Maisons et Appartements
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '69123' AS code_commune,
  trimestre,
  type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('69381', '69382', '69383', '69384', '69385', '69386', '69387', '69388', '69389')
  AND type_local IN ('M', 'A')
GROUP BY trimestre, type_local;

-- Lyon (69123) - Tous types (T)
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '69123' AS code_commune,
  trimestre,
  'T' AS type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('69381', '69382', '69383', '69384', '69385', '69386', '69387', '69388', '69389')
  AND type_local IN ('M', 'A')
GROUP BY trimestre;

-- Paris (75056) - Agrège les 20 arrondissements (75101-75120)
-- Maisons et Appartements
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '75056' AS code_commune,
  trimestre,
  type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('75101', '75102', '75103', '75104', '75105', '75106', '75107', '75108', '75109', '75110',
                   '75111', '75112', '75113', '75114', '75115', '75116', '75117', '75118', '75119', '75120')
  AND type_local IN ('M', 'A')
GROUP BY trimestre, type_local;

-- Paris (75056) - Tous types (T)
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '75056' AS code_commune,
  trimestre,
  'T' AS type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('75101', '75102', '75103', '75104', '75105', '75106', '75107', '75108', '75109', '75110',
                   '75111', '75112', '75113', '75114', '75115', '75116', '75117', '75118', '75119', '75120')
  AND type_local IN ('M', 'A')
GROUP BY trimestre;

-- Marseille (13055) - Agrège les 16 arrondissements (13201-13216)
-- Maisons et Appartements
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '13055' AS code_commune,
  trimestre,
  type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('13201', '13202', '13203', '13204', '13205', '13206', '13207', '13208',
                   '13209', '13210', '13211', '13212', '13213', '13214', '13215', '13216')
  AND type_local IN ('M', 'A')
GROUP BY trimestre, type_local;

-- Marseille (13055) - Tous types (T)
INSERT INTO agregats (code_commune, trimestre, type_local, prix_m2_median, prix_median, nb_transactions)
SELECT 
  '13055' AS code_commune,
  trimestre,
  'T' AS type_local,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_m2_median
  )::numeric, 2)::float AS prix_m2_median,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY prix_median
  ))::INT AS prix_median,
  SUM(nb_transactions) AS nb_transactions
FROM agregats
WHERE 
  code_commune IN ('13201', '13202', '13203', '13204', '13205', '13206', '13207', '13208',
                   '13209', '13210', '13211', '13212', '13213', '13214', '13215', '13216')
  AND type_local IN ('M', 'A')
GROUP BY trimestre;

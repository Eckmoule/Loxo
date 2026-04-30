CREATE TABLE agregats (
  id BIGSERIAL PRIMARY KEY,
  code_commune TEXT NOT NULL REFERENCES communes(code_commune),
  trimestre DATE NOT NULL,
  type_local TEXT NOT NULL,
  prix_m2_median FLOAT NOT NULL,
  prix_median INT NOT NULL,
  nb_transactions INT NOT NULL,
  
  UNIQUE(code_commune, trimestre, type_local)
);

-- Index pour requêtes temporelles
CREATE INDEX idx_agregats_commune_trimestre ON agregats(code_commune, trimestre DESC);
CREATE INDEX idx_agregats_type ON agregats(type_local);

-- Commentaires
COMMENT ON TABLE agregats IS 'Agrégats trimestriels pré-calculés (médiane prix m², volume)';
COMMENT ON COLUMN agregats.trimestre IS 'Premier jour du trimestre (ex: 2024-01-01 = T1 2024)';
COMMENT ON COLUMN agregats.type_local IS 'M = Maison, A = Appartement, T = Tous types';
COMMENT ON COLUMN agregats.prix_m2_median IS 'Prix médian au m² (arrondi 2 décimales)';
COMMENT ON COLUMN agregats.prix_median IS 'Prix médian total en euros';
COMMENT ON COLUMN agregats.nb_transactions IS 'Nombre de transactions ayant servi au calcul';

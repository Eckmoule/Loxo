CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  date_mutation DATE NOT NULL,
  valeur_fonciere INT,
  code_commune TEXT REFERENCES communes(code_commune),
  type_local CHAR(1), -- 'M' (Maison) ou 'A' (Appartement)
  surface_reelle_bati FLOAT,
  surface_terrain FLOAT,
  nombre_pieces_principales INT,
  id_parcelle TEXT,
  latitude FLOAT,
  longitude FLOAT
);

-- Index composite pour agrégations (remplace 3 index séparés)
CREATE INDEX idx_transactions_agg ON transactions(code_commune, date_mutation, type_local);

-- Index géospatial pour la vue micro (carte)
CREATE INDEX idx_transactions_geo ON transactions(latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Commentaires
COMMENT ON TABLE transactions IS 'Transactions immobilières DVF depuis 2014';
COMMENT ON COLUMN transactions.valeur_fonciere IS 'Valeur de la transaction en euros';
COMMENT ON COLUMN transactions.type_local IS 'M = Maison, A = Appartement (filtré à l''import)';

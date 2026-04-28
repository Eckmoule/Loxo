CREATE TABLE communes (
  code_commune TEXT PRIMARY KEY,
  nom_commune TEXT NOT NULL,
  code_departement TEXT NOT NULL,
  code_postal TEXT[], -- Array pour gérer plusieurs codes postaux
  latitude FLOAT,
  longitude FLOAT,
  population INT
);

-- Index pour optimiser les recherches
CREATE INDEX idx_communes_nom ON communes USING gin(to_tsvector('french', nom_commune));
CREATE INDEX idx_communes_dept ON communes(code_departement);
CREATE INDEX idx_communes_cp ON communes USING GIN(code_postal);

-- Commentaires
COMMENT ON TABLE communes IS 'Référentiel des communes françaises (~35K communes)';
COMMENT ON COLUMN communes.code_postal IS 'Array de codes postaux (une commune peut en avoir plusieurs)';
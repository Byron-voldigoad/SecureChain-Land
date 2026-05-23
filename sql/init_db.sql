-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Créer la table
CREATE TABLE IF NOT EXISTS parcelles (
  id SERIAL PRIMARY KEY,
  titre_id VARCHAR(50) UNIQUE NOT NULL,
  proprietaire VARCHAR(100) NOT NULL,
  cni VARCHAR(20),
  superficie_m2 NUMERIC(12, 2),
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Créer l'index spatial
CREATE INDEX IF NOT EXISTS idx_parcelles_geom ON parcelles USING GIST(geom);

-- Créer la fonction de détection
CREATE OR REPLACE FUNCTION detecter_chevauchement(nouvelle_geom GEOMETRY)
RETURNS TABLE(titre_id VARCHAR, proprietaire VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT p.titre_id, p.proprietaire
  FROM parcelles p
  WHERE ST_Intersects(p.geom, nouvelle_geom);
END;
$$ LANGUAGE plpgsql;

-- Insérer une parcelle test (Bastos - Yaoundé)
INSERT INTO parcelles (titre_id, proprietaire, cni, superficie_m2, geom)
VALUES (
  'TF-YDE-2025-001847',
  'MBALLA Jean-Pierre',
  '123456789',
  850.5,
  ST_SetSRID(
    ST_GeomFromGeoJSON('{
      "type": "Polygon",
      "coordinates": [[
        [11.502, 3.848],
        [11.505, 3.848],
        [11.505, 3.851],
        [11.502, 3.851],
        [11.502, 3.848]
      ]]
    }'),
    4326
  )
);

-- Vérifier
SELECT COUNT(*) as nb_parcelles FROM parcelles;

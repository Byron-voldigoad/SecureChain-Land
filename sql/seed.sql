-- Supprimer les anciennes données (optionnel)
TRUNCATE TABLE parcelles RESTART IDENTITY;

-- Insertion des parcelles de test (Bastos + Essos)
INSERT INTO parcelles (titre_id, proprietaire, cni, superficie_m2, geom)
VALUES 
  ('TF-YDE-2025-001847', 'MBALLA Jean-Pierre', '123456789', 850.5, 
   ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[11.502,3.848],[11.505,3.848],[11.505,3.851],[11.502,3.851],[11.502,3.848]]]}'), 4326)),
  ('TF-YDE-2026-0002', 'NDI Samuel', '987654321', 620.0, 
   ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[11.51,3.85],[11.513,3.85],[11.513,3.853],[11.51,3.853],[11.51,3.85]]]}'), 4326));

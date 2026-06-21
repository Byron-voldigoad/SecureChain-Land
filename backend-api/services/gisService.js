const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
console.log("Mot de passe lu :", process.env.DB_PASSWORD);
// Vérifier les chevauchements avant enregistrement
async function checkOverlaps(geometryGeoJSON) {
  const geomWKT = geoJSONToWKT(geometryGeoJSON);
  
  const query = `
    SELECT * FROM detecter_chevauchement(
      ST_GeomFromGeoJSON($1)
    );
  `;
  
  const result = await pool.query(query, [JSON.stringify(geometryGeoJSON)]);
  return result.rows; // Liste des titres en conflit
}

// Insérer une nouvelle parcelle après validation
async function insertParcel(titleID, owner, nationalID, geometryGeoJSON, area_m2) {
  const query = `
    INSERT INTO parcelles (titre_id, proprietaire, cni, geom, superficie_m2)
    VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5)
    RETURNING id, titre_id, proprietaire, ST_AsGeoJSON(geom) as geojson;
  `;
  
  const result = await pool.query(query, [
    titleID, owner, nationalID, JSON.stringify(geometryGeoJSON), area_m2
  ]);
  return result.rows[0];
}

// Récupérer toutes les parcelles pour la carte
async function getAllParcels() {
  const query = `
    SELECT id, titre_id, proprietaire, cni, superficie_m2, 
           ST_AsGeoJSON(geom) as geojson,
           created_at
    FROM parcelles
  `;
  const result = await pool.query(query);
  return result.rows;
}

function geoJSONToWKT(geojson) {
  // Helper: convertit GeoJSON en WKT si besoin
  // Pour l'instant on passe le GeoJSON directement à ST_GeomFromGeoJSON
  return geojson;
}

module.exports = { checkOverlaps, insertParcel, getAllParcels };module.exports = { checkOverlaps, insertParcel, getAllParcels, pool };

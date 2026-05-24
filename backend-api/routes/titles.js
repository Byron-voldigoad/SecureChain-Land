const express = require('express');
const router = express.Router();
const gis = require('../services/gisService');
const ai = require('../services/aiClient');
const pool = require('../services/gisService').pool; // on récupère le pool

// POST /api/titles
router.post('/', async (req, res, next) => {
  try {
    const { titleID, owner, nationalID, geometry, area_m2 } = req.body;

    // Vérifier les chevauchements
    const overlaps = await gis.checkOverlaps(geometry);
    if (overlaps.length > 0) {
      return res.status(409).json({
        error: 'CHEVAUCHEMENT_DETECTE',
        conflicts: overlaps,
        message: `La parcelle chevauche ${overlaps.length} titre(s) existant(s)`
      });
    }

    // Analyse IA (mock)
    const aiResult = await ai.analyzeRisk({ titleID, owner, area_m2 });
    if (aiResult.requires_review) {
      return res.status(403).json({
        error: 'FRAUDE_SUSPECTEE',
        ai_score: aiResult.anomaly_score,
        risk_percentage: aiResult.risk_percentage
      });
    }

    // Insérer dans PostGIS
    const newParcel = await gis.insertParcel(titleID, owner, nationalID, geometry, area_m2);

    res.status(201).json({
      success: true,
      titleID,
      gis_id: newParcel.id,
      ai_status: aiResult.label,
      geojson: JSON.parse(newParcel.geojson),
      message: 'Titre enregistré'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/titles (toutes)
router.get('/', async (req, res, next) => {
  try {
    const parcels = await gis.getAllParcels();
    const features = parcels.map(p => ({
      type: 'Feature',
      geometry: JSON.parse(p.geojson),
      properties: {
        titleID: p.titre_id,
        owner: p.proprietaire,
        area_m2: p.superficie_m2,
        created_at: p.created_at
      }
    }));
    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    next(err);
  }
});

// GET /api/titles/:id (unitaire)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT titre_id, proprietaire, cni, superficie_m2, 
              ST_AsGeoJSON(geom) as geojson, created_at 
       FROM parcelles WHERE titre_id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Titre non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

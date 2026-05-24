const express = require('express');
const router = express.Router();
const gis = require('../services/gisService');
const ai = require('../services/aiClient');

// POST /api/titles — Enregistrement d'un nouveau titre
router.post('/', async (req, res) => {
  try {
    const { titleID, owner, nationalID, geometry, area_m2 } = req.body;

    // 1. Vérifier les chevauchements géospatiaux
    const overlaps = await gis.checkOverlaps(geometry);
    
    if (overlaps.length > 0) {
      return res.status(409).json({
        error: 'CHEVAUCHEMENT_DETECTE',
        conflicts: overlaps,
        message: `La parcelle chevauche ${overlaps.length} titre(s) existant(s)`
      });
    }

    // 2. Analyser le risque avec l'IA
    const aiResult = await ai.analyzeRisk({
      titleID,
      owner,
      area_m2,
      mutation_count: 0,
      days_since_last_mutation: 0
    });

    // 3. Si l'IA détecte une anomalie, bloquer ou alerter
    if (aiResult.requires_review) {
      return res.status(403).json({
        error: 'FRAUDE_SUSPECTEE',
        ai_score: aiResult.anomaly_score,
        risk_percentage: aiResult.risk_percentage,
        message: 'Transaction suspecte détectée par l\'IA'
      });
    }

    // 4. Insérer dans PostGIS
    const newParcel = await gis.insertParcel(
      titleID, owner, nationalID, geometry, area_m2
    );

    res.status(201).json({
      success: true,
      titleID,
      gis_id: newParcel.id,
      ai_status: aiResult.label,
      risk_score: aiResult.risk_percentage,
      geojson: JSON.parse(newParcel.geojson),
      message: 'Titre enregistré avec succès'
    });

  } catch (err) {
    console.error('[API ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/titles — Récupérer tous les titres
router.get('/', async (req, res) => {
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
    
    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
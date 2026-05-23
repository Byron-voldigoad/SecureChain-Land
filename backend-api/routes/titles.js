const express = require('express');
const router = express.Router();
const gis = require('../services/gisService');

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

    // 2. Si OK, insérer dans PostGIS
    const newParcel = await gis.insertParcel(
      titleID, owner, nationalID, geometry, area_m2
    );

    // 3. TODO: Appeler le service IA (à venir)
    // 4. TODO: Appeler la blockchain Hyperledger Fabric (à venir)

    res.status(201).json({
      success: true,
      titleID,
      gis_id: newParcel.id,
      geojson: JSON.parse(newParcel.geojson),
      message: 'Titre validé géospatialement, en attente de finalisation'
    });

  } catch (err) {
    console.error('[API ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/titles — Récupérer tous les titres pour la carte
router.get('/', async (req, res) => {
  try {
    const parcels = await gis.getAllParcels();
    // Convertir en format GeoJSON FeatureCollection
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
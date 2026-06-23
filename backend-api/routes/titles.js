const express = require("express");
const router = express.Router();
const gis = require("../services/gisService");
const ai = require("../services/aiClient");
const bc = require("../services/blockchainService");
const pool = require("../services/gisService").pool;

// POST /api/titles
router.post("/", async (req, res, next) => {
  try {
    const {
      titleID,
      owner,
      nationalID,
      geometry,
      area_m2,
      montant,
      historique_mutations,
    } = req.body;

    // 1. Vérifier les chevauchements
    const overlaps = await gis.checkOverlaps(geometry);
    if (overlaps.length > 0) {
      return res
        .status(409)
        .json({ error: "CHEVAUCHEMENT_DETECTE", conflicts: overlaps });
    }

    // 2. Analyse IA
    const aiResult = await ai.analyzeRisk({
      montant,
      superficie: area_m2,
      historique_mutations,
    });
    if (aiResult.status === "SUSPECT") {
      return res.status(403).json({ error: "FRAUDE_SUSPECTEE", ai: aiResult });
    }

    // 3. Enregistrer dans PostGIS
    const newParcel = await gis.insertParcel(
      titleID,
      owner,
      nationalID,
      geometry,
      area_m2,
    );

    // 4. Enregistrer dans la Blockchain
    await bc.addBlock(titleID, { owner, area_m2, montant });

    res
      .status(201)
      .json({
        success: true,
        titleID,
        ai: aiResult,
        aiStatus: aiResult.status,
      });
  } catch (err) {
    next(err);
  }
});

// GET /api/titles/blockchain
router.get("/blockchain", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM audit_chain ORDER BY id DESC",
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/titles (toutes)
router.get("/", async (req, res, next) => {
  try {
    const parcels = await gis.getAllParcels();
    const features = parcels.map((p) => ({
      type: "Feature",
      geometry: JSON.parse(p.geojson),
      properties: {
        titleID: p.titre_id,
        owner: p.proprietaire,
        area_m2: p.superficie_m2,
        created_at: p.created_at,
      },
    }));
    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    next(err);
  }
});

// GET /api/titles/:id (unitaire)
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT titre_id, proprietaire, cni, superficie_m2,
              ST_AsGeoJSON(geom) as geojson, created_at
       FROM parcelles WHERE titre_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Titre non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

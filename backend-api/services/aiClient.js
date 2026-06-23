const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

async function analyzeRisk(data) {
  console.log("[AI] Appel service Python:", AI_SERVICE_URL);

  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/predict_fraud`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    console.error("[AI ERROR]", err.message);
    // Fail-safe: mode dégradé si le service IA est indisponible
    return {
      status: "NORMAL",
      score_risque: 0,
      statut_ia: "Fallback (Service Indisponible)",
    };
  }
}

module.exports = { analyzeRisk };

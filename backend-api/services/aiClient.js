const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

async function analyzeRisk(transaction) {
  // Pour l'instant, mode mock (en attendant le service Python)
  // Retourne un score aléatoire pour tester l'intégration
  
  console.log('[AI] Analyse de transaction:', transaction.titleID);
  
  // Simulation d'un appel API (remplacé par le vrai appel plus tard)
  const mockResponse = {
    label: Math.random() > 0.8 ? 'SUSPECT' : 'NORMAL',
    anomaly_score: Math.random() * 0.5,
    risk_percentage: Math.random() * 100,
    requires_review: Math.random() > 0.9
  };
  
  return mockResponse;
  
  /* VRAI appel API (à décommenter quand le service IA sera prêt)
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/predict_fraud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction })
    });
    return await response.json();
  } catch (err) {
    console.error('[AI ERROR]', err.message);
    return { label: 'NORMAL', risk_percentage: 0, requires_review: false };
  }
  */
}

module.exports = { analyzeRisk };
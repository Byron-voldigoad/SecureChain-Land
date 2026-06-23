## SecureChain-Land

**Projet :** Registre foncier décentralisé (Proof of Concept)

---

## 🎯 Ce que ce projet permet de réaliser

SecureChain-Land est un système complet de gestion foncière qui combine :
- ✅ **API REST** (Node.js + Express)
- ✅ **Intégration PostgreSQL / PostGIS** (géospatial)
- ✅ **Détection automatique des chevauchements de parcelles**
- ✅ **Analyse IA** (Service Flask / Isolation Forest) pour la détection de fraudes
- ✅ **Registres Immuables** (Simulation Blockchain / SHA-256)
- ✅ **Interface Dashboard** (React, TypeScript, Leaflet) pour la gestion visuelle

---

## 🚀 Démarrage rapide

### 1. Prérequis
- Node.js & npm
- Python (pour le module IA)
- Docker & Docker Compose (pour la base PostGIS)

### 2. Démarrer la base de données
À la racine du projet :
```bash
docker-compose up -d
```

### 3. Lancer le backend
```bash
cd backend-api
npm install
node server.js
```

### 4. Lancer le service IA
```bash
cd ai-service
python -m venv venv
# Activer l'environnement (ex: .\venv\Scripts\activate sur Windows)
pip install flask
python app.py
```

### 5. Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Scénarios de démonstration

1.  **Enregistrement valide** : Saisir des informations avec un montant < 200M FCFA. La parcelle est ajoutée à la carte, au registre et à la blockchain.
2.  **Conflit géographique** : Dessiner une parcelle qui chevauche une autre. Le système renvoie `HTTP 409` et bloque l'enregistrement.
3.  **Fraude financière (IA)** : Saisir un montant > 200M FCFA. L'IA détecte une transaction suspecte (`HTTP 403`), le blocage est effectif et une alerte explicative apparaît sur le Dashboard.

---

## 🔌 API Principale

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/titles` | Liste toutes les parcelles |
| **POST** | `/api/titles` | Enregistre un titre (avec validation IA + Blockchain) |
| **GET** | `/api/titles/blockchain` | Récupère l'audit immuable de la blockchain |

Voici la version **mise à jour** de ton README, intégrant la route `GET /api/titles/:id` (maintenant implémentée), le middleware d’erreur, et quelques précisions sur le seed.

---

## SecureChain-Land Backend API

**Auteur :** Tchango – Membre 3 (Task-Force B)  
**Rôle :** Développeur Node.js / API REST  
**Projet :** Registre foncier décentralisé – Master 1 GL, ISSAM.

---

## 🎯 Ce que j’ai réalisé

- ✅ **API REST complète** (Node.js + Express)
- ✅ **Intégration avec PostgreSQL / PostGIS** (géospatial)
- ✅ **Détection automatique des chevauchements de parcelles** (`ST_Intersects`)
- ✅ **Endpoint `GET /api/titles`** → retourne toutes les parcelles au format GeoJSON (prêt pour Leaflet)
- ✅ **Endpoint `GET /api/titles/:id`** → retourne un titre spécifique (par son `titre_id`)
- ✅ **Endpoint `POST /api/titles`** → enregistrement d’un nouveau titre avec validation spatiale
- ✅ **Mock du service IA** (prêt pour intégration future du vrai modèle Isolation Forest)
- ✅ **Middleware global de gestion d’erreurs** (réponses JSON propres, pas de crash)
- ✅ **Script de seed** (`sql/seed.sql`) pour initialiser la base avec des données de test
- ✅ **Architecture modulaire :** routes, services, middleware

---

## 📁 Structure du projet

```text
backend-api/
├── .env                     # Variables d’environnement
├── server.js                # Point d’entrée
├── routes/
│   └── titles.js            # Routes principales
├── services/
│   ├── gisService.js        # Communication avec PostGIS
│   └── aiClient.js          # Client pour l’IA (mock + futur réel)
├── middleware/
│   └── errorHandler.js      # Gestion centralisée des erreurs
├── sql/
│   └── seed.sql             # Données de test (Bastos, Essos)
└── package.json
```

---

## 🚀 Démarrage rapide (pour les membres de l’équipe)

### 1. Cloner le dépôt et se placer dans le bon dossier

```bash
git clone https://github.com/Byron-Voldigoad/securechain-land.git
cd securechain-land/backend-api
```

### 2. Démarrer la base PostGIS (Docker Compose)

À la racine du projet (`~/securechain-land`) :

```bash
sudo docker-compose up -d
```

### 3. Initialiser la base avec les données de test

```bash
sudo docker exec -i securechain_db psql -U admin -d securechain_geodb < sql/seed.sql
```

### 4. Configurer les variables d’environnement

Copier le fichier `.env.example` et adapter :

```bash
cp .env.example .env
```

*Contenu recommandé pour `.env` :*

```ini
PORT=5000
POSTGIS_HOST=localhost
POSTGIS_PORT=5432
POSTGIS_DB=securechain_geodb
POSTGIS_USER=admin
POSTGIS_PASSWORD=cadastre_admin
JWT_SECRET=securechain-land-secret-key-2026
AI_SERVICE_URL=http://localhost:5001
```

### 5. Installer les dépendances et lancer l’API

```bash
npm install
node server.js
```

*Tu devrais voir :*

```
✅ PostgreSQL/PostGIS connecté
✅ API SecureChain-Land démarrée sur http://localhost:5000
```

### 6. Tester rapidement

```bash
# Récupérer toutes les parcelles
curl http://localhost:5000/api/titles

# Récupérer une parcelle spécifique
curl http://localhost:5000/api/titles/TF-YDE-2025-001847

# Créer une nouvelle parcelle (fichier test-parcel.json)
curl -X POST http://localhost:5000/api/titles \
  -H "Content-Type: application/json" \
  -d @test-parcel.json
```

---

## 🔌 Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/titles` | Liste toutes les parcelles (GeoJSON) |
| **GET** | `/api/titles/:id` | Récupère un titre par son `titre_id` (ex: `TF-YDE-2025-001847`) |
| **POST** | `/api/titles` | Enregistre un nouveau titre (avec validation spatiale + IA) |
| **GET** | `/health` | Vérification de l’état du service |

---

## 🧪 Exemple de payload POST attendu

```json
{
  "titleID": "TF-YDE-2026-0002",
  "owner": "NDI Samuel",
  "nationalID": "987654321",
  "area_m2": 620.0,
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [11.51, 3.85],
      [11.513, 3.85],
      [11.513, 3.853],
      [11.51, 3.853],
      [11.51, 3.85]
    ]]
  }
}
```

### Réponse en cas de succès (201)

```json
{
  "success": true,
  "titleID": "TF-YDE-2026-0002",
  "gis_id": 2,
  "ai_status": "NORMAL",
  "geojson": { ... },
  "message": "Titre enregistré"
}
```

### Réponse en cas de chevauchement (409)

```json
{
  "error": "CHEVAUCHEMENT_DETECTE",
  "conflicts": [
    { "titre_id": "TF-YDE-2025-001847", "proprietaire": "MBALLA Jean-Pierre" }
  ],
  "message": "La parcelle chevauche 1 titre(s) existant(s)"
}
```

---

## 🗄️ Scripts SQL utiles

- `sql/seed.sql` – Crée la table `parcelles`, la fonction `detecter_chevauchement`, et insère deux parcelles de test (Bastos, Essos).
- Pour réinitialiser la base : `sudo docker exec -i securechain_db psql -U admin -d securechain_geodb < sql/seed.sql`

---

## 🛡️ Gestion des erreurs

Un middleware central (`middleware/errorHandler.js`) capture toutes les erreurs et retourne une réponse JSON standard :

```json
{ "error": "Message explicatif" }
```

Ainsi, l’API ne plante jamais et le frontend peut toujours interpréter la réponse.

---

## 🔜 Prochaines améliorations (feuille de route)

- ✅ Authentification JWT (seuls les agents MINDCAF peuvent créer/muter)
- ✅ Connexion au vrai service IA (Python/Flask) quand il sera prêt
- ✅ Endpoint de mutation de propriété (`PUT /api/titles/:id/transfer`)

---

## 🧪 Validation des tests effectués (le 24 mai 2026)

| Test | Résultat |
|------|----------|
| `GET /api/titles` → liste des parcelles | ✅ 2 parcelles |
| `GET /api/titles/TF-YDE-2025-001847` → détail | ✅ JSON OK |
| `GET /api/titles/INEXISTANT` → 404 | ✅ |
| `POST` sans chevauchement → 201 | ✅ |
| `POST` avec chevauchement → 409 | ✅ |
| Middleware d’erreur (PostGIS arrêté) → 500 JSON | ✅ |

---

**Statut actuel :** ✅ BACKEND 100% OPÉRATIONNEL – PRÊT POUR L’INTÉGRATION AVEC LE FRONTEND REACT, L’IA ET LA BLOCKCHAIN.

---

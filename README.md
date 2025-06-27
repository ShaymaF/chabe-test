# API de Test Technique - Node.js/Express

Cette API REST, développée avec Node.js, Express.js et TypeScript, sert d'interface pour interagir avec le service externe GDS Waynium. Elle inclut la communication avec une API tierce, l'authentification, la validation, et le déploiement continu.

## Fonctionnalités

- **Intégration GDS Waynium** : Communication réelle avec l'endpoint `https://api.waynium.com/gdsv3`.
- **Gestion des Missions** :
  - Création de missions via `/set-ressource-v2`.
  - Récupération et filtrage de missions par date via `/get-ressource`.
- **Système de Callback** : Configuration du GDS pour recevoir des notifications de changement d'état (webhooks).
- **Authentification JWT** : Sécurisation des endpoints de l'API avec JSON Web Tokens.
- **Génération de Token** : Un endpoint de développement pour générer facilement des tokens de test.
- **Validation des Données** : Utilisation de `Joi` pour valider les requêtes entrantes.
- **Gestion des Erreurs et Logging** : Mécanismes robustes pour logger les requêtes et centraliser la gestion des erreurs.
- **Documentation API** : Documentation interactive disponible via Swagger UI disponible à http://localhost:3000/api-docs.
- **CI/CD** : Déploiement automatisé sur Azure App Service via GitHub Actions.

## Prérequis

- Node.js (v18.x ou supérieur recommandé)
- npm
- Git

## 1. Installation

Suivez ces étapes pour mettre en place le projet localement.

**1.1. Clonez le dépôt :**

```bash
git clone https://github.com/ShaymaF/chabe-test.git
cd chabe-test
```

**1.2. Installez les dépendances :**

```bash
npm install
```

**1.3. Configurez les variables d'environnement :**

Le projet utilise un fichier .env pour gérer les configurations sensibles.

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Ouvrez le fichier `.env` et remplissez les valeurs. Ceci est une étape cruciale.

```
# Configuration de votre API
PORT=3000
API_CLIENT_SECRET=un-secret-tres-solide-pour-le-jwt-de-notre-api-32-chars

# Configuration pour la communication avec l'API GDS Waynium
GDS_API_URL=https://api.waynium.com/gdsv3
GDS_API_KEY=dev
GDS_SECRET_KEY=un-autre-secret-tres-solide-que-vous-partagez-avec-gds
```

## 2. Utilisation

**Lancer l'application**

Mode développement (avec redémarrage automatique via nodemon) :

```bash
npm run dev
```

Build pour la production :

```bash
npm run build
```

Lancer en production (après un `npm run build`) :

```bash
npm start
```

Lancer les tests unitaires :

```bash
npm test
```

Une fois lancée, l'API sera accessible sur : `http://localhost:3000`

## 3. Endpoints de l'API

La documentation interactive complète est disponible à :  
`http://localhost:3000/api-docs`

### 3.1. Authentification

La plupart des endpoints sont protégés par JWT. Pour en obtenir un :

**GET /api/generate-test-token**

Exemple de réponse :

```json
{
  "message": "Use this token to access protected endpoints.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Utiliser le token dans le header :

```
Authorization: Bearer <votre_token>
```

### 3.2. Gestion des Missions

**GET /api/missions**

Paramètres de Query (optionnels) :

- `MIS_DATE_DEBUT#MIN` (YYYY-MM-DD)
- `MIS_DATE_DEBUT#MAX` (YYYY-MM-DD)

Exemple :

```bash
curl -X GET "http://localhost:3000/api/missions?MIS_DATE_DEBUT%23MIN=2023-01-01" \
  -H "Authorization: Bearer <votre_token>"
```

**POST /api/mission**

Body JSON minimal :

```json
{
  "MIS_DATE_DEBUT": "2024-12-25",
  "MIS_TSE_ID": "ID-TYPE-SERVICE-1",
  "MIS_TVE_ID": "ID-TYPE-VEHICULE-2"
}
```

### 3.3. Configuration Système

**POST /api/system/set-callback**

Body :

```json
{
  "url": "https://my-domaine.com/webhook-handler"
}
```

## 4. Déploiement CI/CD

Défini dans `.github/workflows/main_chabe-test-api.yml`.

Déclencheur : push sur la branche `main`

Étapes :

- Installation des dépendances
- Compilation TypeScript
- Exécution des tests unitaires
- Déploiement Azure

### Configuration requise sur GitHub :

Créer un secret :  
**AZURE_WEBAPP_PUBLISH_PROFILE**

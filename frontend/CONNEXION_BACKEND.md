# 🔗 Connexion Frontend-Backend

Ce document explique comment le frontend est connecté au backend.

## 📋 Configuration

### URL du Backend

L'URL du backend est configurée dans `src/config/api.ts` :

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

Par défaut, le backend est sur `http://localhost:8080/api`.

Pour changer l'URL, créez un fichier `.env` à la racine du frontend :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🏗 Architecture

### Services API

Tous les appels API sont centralisés dans `src/services/api.ts` :

- **authService** : Authentification (login)
- **projectService** : Gestion des projets (CRUD)
- **taskService** : Gestion des tâches (CRUD)

### Contextes

- **AuthContext** : Gère l'authentification et le token JWT
- **ProjectContext** : Gère les projets et tâches avec synchronisation backend

## 🔐 Authentification

### Flux d'authentification

1. L'utilisateur se connecte via `AuthContext.login()`
2. Le service API appelle `POST /api/auth/login`
3. Le backend retourne un token JWT
4. Le token est stocké dans `localStorage`
5. Toutes les requêtes suivantes incluent le header `Authorization: Bearer <token>`

### Utilisateurs de démonstration

Le backend crée automatiquement deux utilisateurs :

| Email | Password |
|-------|----------|
| `user@example.com` | `password123` |
| `alice@example.com` | `alice123` |

## 📡 Endpoints utilisés

### Authentification
- `POST /api/auth/login` - Connexion

### Projets
- `GET /api/projects` - Liste des projets
- `GET /api/projects/{id}` - Détails d'un projet
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/{id}` - Mettre à jour un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Tâches
- `GET /api/projects/{projectId}/tasks` - Liste des tâches
- `POST /api/projects/{projectId}/tasks` - Créer une tâche
- `PUT /api/projects/{projectId}/tasks/{taskId}` - Mettre à jour une tâche
- `PATCH /api/projects/{projectId}/tasks/{taskId}/toggle` - Basculer le statut
- `DELETE /api/projects/{projectId}/tasks/{taskId}` - Supprimer une tâche

## 🔄 Synchronisation

### Chargement initial

Au démarrage de l'application, `ProjectContext` :
1. Charge tous les projets via `GET /api/projects`
2. Pour chaque projet, charge ses tâches via `GET /api/projects/{id}/tasks`
3. Met à jour l'état local

### Opérations CRUD

Toutes les opérations (créer, modifier, supprimer) sont :
1. Envoyées au backend via l'API
2. Mises à jour dans l'état local après succès
3. Gérées avec gestion d'erreurs appropriée

## ⚠️ Gestion des erreurs

### Erreurs réseau

Les erreurs sont capturées et affichées via des toasts :
- Erreur 401 : Token invalide ou expiré → Redirection vers login
- Erreur 404 : Ressource non trouvée
- Erreur 400 : Données invalides
- Erreur 500 : Erreur serveur

### Messages d'erreur

Les messages d'erreur proviennent du backend et sont affichés à l'utilisateur.

## 🚀 Démarrage

### 1. Démarrer le backend

```bash
cd backend
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`

### 2. Démarrer le frontend

```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### 3. Tester la connexion

1. Ouvrir `http://localhost:5173`
2. Se connecter avec `user@example.com` / `password123`
3. Les projets et tâches sont chargés depuis le backend

## 🔧 Dépannage

### Erreur CORS

Si vous voyez des erreurs CORS, vérifiez que :
- Le backend est démarré
- L'URL dans `config/api.ts` correspond au port du backend
- Le backend autorise l'origine `http://localhost:5173` (configuré dans `SecurityConfig.java`)

### Erreur 401 Unauthorized

- Vérifiez que vous êtes connecté
- Vérifiez que le token est valide dans `localStorage`
- Le token expire après 24h par défaut

### Les données ne se chargent pas

- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que le backend est accessible
- Vérifiez les logs du backend pour les erreurs serveur

## 📝 Notes importantes

- Les IDs sont maintenant des `number` (au lieu de `string`) pour correspondre au backend
- Toutes les opérations sont asynchrones
- Le contexte gère automatiquement le chargement et les erreurs
- Les projets et tâches sont synchronisés avec le backend en temps réel


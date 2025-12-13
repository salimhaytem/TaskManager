# 📋 Explication des DTOs (Data Transfer Objects)

## Vue d'ensemble
Les DTOs sont des objets utilisés pour transférer des données entre les couches de l'application (Client ↔ Controller ↔ Service). Ils permettent de découpler les entités JPA de l'API publique.

---

## 🔐 1. LoginRequest
**Fichier:** `dto/LoginRequest.java`  
**Usage:** Reçu du client lors de la connexion

### Champs:
- `email` (String) - **Requis**
  - Validation: `@NotBlank` + `@Email`
  - Message d'erreur: "Email is required" / "Email must be valid"
  
- `password` (String) - **Requis**
  - Validation: `@NotBlank`
  - Message d'erreur: "Password is required"

### Utilisation:
```java
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### ✅ Points positifs:
- Validations appropriées
- Messages d'erreur clairs
- Utilise `@Data` de Lombok (génère getters/setters automatiquement)

---

## 🔑 2. LoginResponse
**Fichier:** `dto/LoginResponse.java`  
**Usage:** Envoyé au client après authentification réussie

### Champs:
- `token` (String) - JWT token pour l'authentification
- `email` (String) - Email de l'utilisateur
- `fullName` (String) - Nom complet de l'utilisateur

### Utilisation:
```java
// Réponse après login réussi
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

### ✅ Points positifs:
- Structure simple et claire
- Contient toutes les informations nécessaires pour le frontend
- Utilise `@AllArgsConstructor` pour faciliter la création

### ⚠️ Note:
- Pas de constructeur par défaut explicite (mais Lombok `@Data` le génère)

---

## 📁 3. ProjectRequest
**Fichier:** `dto/ProjectRequest.java`  
**Usage:** Reçu du client pour créer/modifier un projet

### Champs:
- `title` (String) - **Requis**
  - Validation: `@NotBlank` + `@Size(max = 200)`
  - Message: "Title is required" / "Title must not exceed 200 characters"
  
- `description` (String) - **Optionnel**
  - Validation: `@Size(max = 1000)`
  - Message: "Description must not exceed 1000 characters"

### Utilisation:
```java
POST /api/projects
PUT /api/projects/{id}
{
  "title": "Mon Projet",
  "description": "Description du projet"
}
```

### ✅ Points positifs:
- Validations appropriées
- Description optionnelle (logique métier correcte)
- Limites de taille définies

---

## 📊 4. ProjectResponse
**Fichier:** `dto/ProjectResponse.java`  
**Usage:** Envoyé au client avec les informations d'un projet

### Champs:
- `id` (Long) - Identifiant unique du projet
- `title` (String) - Titre du projet
- `description` (String) - Description du projet
- `createdAt` (LocalDateTime) - Date de création
- `totalTasks` (int) - Nombre total de tâches
- `completedTasks` (int) - Nombre de tâches complétées
- `progressPercentage` (double) - Pourcentage de progression (0-100)

### Utilisation:
```java
// Réponse GET /api/projects/{id}
{
  "id": 1,
  "title": "Mon Projet",
  "description": "Description",
  "createdAt": "2024-01-15T10:30:00",
  "totalTasks": 5,
  "completedTasks": 2,
  "progressPercentage": 40.0
}
```

### ✅ Points positifs:
- Contient des métriques calculées (totalTasks, completedTasks, progressPercentage)
- Structure complète pour l'affichage frontend
- Types de données appropriés

### 📝 Note:
- Les métriques sont calculées dynamiquement dans l'entité `Project` via `@Transient`

---

## ✅ 5. TaskRequest
**Fichier:** `dto/TaskRequest.java`  
**Usage:** Reçu du client pour créer/modifier une tâche

### Champs:
- `title` (String) - **Requis**
  - Validation: `@NotBlank` + `@Size(max = 200)`
  - Message: "Title is required" / "Title must not exceed 200 characters"
  
- `description` (String) - **Optionnel**
  - Validation: `@Size(max = 2000)`
  - Message: "Description must not exceed 2000 characters"
  
- `dueDate` (LocalDate) - **Requis**
  - Validation: `@NotNull`
  - Message: "Due date is required"

### Utilisation:
```java
POST /api/projects/{projectId}/tasks
PUT /api/projects/{projectId}/tasks/{taskId}
{
  "title": "Ma Tâche",
  "description": "Description de la tâche",
  "dueDate": "2024-12-31"
}
```

### ✅ Points positifs:
- Validations appropriées
- Description optionnelle
- Date d'échéance requise (logique métier)

### ⚠️ Correction effectuée:
- ❌ Import `@Future` inutilisé supprimé

### 💡 Suggestion d'amélioration:
- Pourrait ajouter `@Future` sur `dueDate` si on veut forcer une date future
- Actuellement, n'importe quelle date est acceptée (passée ou future)

---

## 📝 6. TaskResponse
**Fichier:** `dto/TaskResponse.java`  
**Usage:** Envoyé au client avec les informations d'une tâche

### Champs:
- `id` (Long) - Identifiant unique de la tâche
- `title` (String) - Titre de la tâche
- `description` (String) - Description de la tâche
- `dueDate` (LocalDate) - Date d'échéance
- `completed` (boolean) - Statut de complétion
- `createdAt` (LocalDateTime) - Date de création
- `projectId` (Long) - ID du projet parent

### Utilisation:
```java
// Réponse GET /api/projects/{projectId}/tasks/{taskId}
{
  "id": 1,
  "title": "Ma Tâche",
  "description": "Description",
  "dueDate": "2024-12-31",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00",
  "projectId": 1
}
```

### ✅ Points positifs:
- Structure complète
- Contient le `projectId` pour référence
- Statut de complétion inclus

---

## 🔍 Analyse globale

### ✅ Points forts:
1. **Séparation claire:** Request vs Response DTOs
2. **Validations:** Utilisation appropriée de Jakarta Validation
3. **Messages d'erreur:** Tous les champs ont des messages personnalisés
4. **Lombok:** Utilisation de `@Data` pour réduire le code boilerplate
5. **Cohérence:** Structure similaire entre les DTOs
6. **Types appropriés:** Utilisation de `LocalDate` et `LocalDateTime`

### ⚠️ Points d'attention:
1. **TaskRequest:** Pourrait bénéficier de `@Future` sur `dueDate` si la logique métier l'exige
2. **LoginResponse:** Pas de constructeur par défaut explicite (mais généré par Lombok)
3. **ProjectResponse:** Les métriques sont calculées côté serveur (bonne pratique)

### 📊 Résumé des validations:

| DTO | Champs requis | Champs optionnels | Validations spéciales |
|-----|--------------|-------------------|----------------------|
| LoginRequest | email, password | - | @Email |
| LoginResponse | - | - | - |
| ProjectRequest | title | description | @Size(max=200/1000) |
| ProjectResponse | - | - | - |
| TaskRequest | title, dueDate | description | @Size(max=200/2000), @NotNull |
| TaskResponse | - | - | - |

---

## ✅ Conclusion
Tous les DTOs sont **bien structurés** et **correctement validés**. Aucune erreur critique détectée. Le code est propre et suit les bonnes pratiques Spring Boot.


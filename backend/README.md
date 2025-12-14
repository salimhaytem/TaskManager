# 📋 Task Manager Backend API

API REST complète pour un système de gestion de tâches (Task Management System) développée avec Spring Boot 3.2.0.

## 📑 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentification JWT](#authentification-jwt)
- [Base de données](#base-de-données)
- [Exemples d'utilisation](#exemples-dutilisation)

---

## 🎯 Vue d'ensemble

Cette application backend permet de gérer des projets et des tâches avec authentification JWT. Chaque utilisateur peut créer ses propres projets et y ajouter des tâches, suivre leur progression et les marquer comme complétées.

### Fonctionnalités principales

- ✅ Authentification JWT sécurisée
- 📁 Gestion de projets (CRUD complet)
- ✅ Gestion de tâches (CRUD complet)
- 📊 Calcul automatique de la progression des projets
- 🔒 Sécurité basée sur Spring Security
- 🌐 Support CORS pour le frontend
- ⚡ Validation des données avec Jakarta Validation

---

## 🛠 Technologies utilisées

| Technologie | Version | Description |
|------------|---------|-------------|
| **Java** | 17 | Langage de programmation |
| **Spring Boot** | 3.2.0 | Framework principal |
| **Spring Security** | 3.2.0 | Authentification et sécurité |
| **Spring Data JPA** | 3.2.0 | Accès aux données |
| **MySQL** | 8.0+ | Base de données |
| **JWT (jjwt)** | 0.11.5 | Tokens d'authentification |
| **Lombok** | - | Réduction du code boilerplate |
| **Jakarta Validation** | - | Validation des données |
| **Maven** | - | Gestion des dépendances |

---

## 🏗 Architecture

### Diagramme d'architecture globale

```mermaid
graph TB
    Client[Client Frontend] -->|HTTP/REST| API[Spring Boot API]
    API --> Security[Spring Security]
    Security --> JWT[JWT Filter]
    JWT --> Controller[Controllers]
    Controller --> Service[Services]
    Service --> Repository[Repositories]
    Repository --> DB[(MySQL Database)]
    
    style Client fill:#e1f5ff
    style API fill:#fff4e1
    style Security fill:#ffe1e1
    style DB fill:#e1ffe1
```

### Architecture en couches

```mermaid
graph TD
    A[Controller Layer] -->|DTOs| B[Service Layer]
    B -->|Entities| C[Repository Layer]
    C -->|SQL| D[Database]
    
    E[Security Layer] -->|JWT Filter| A
    F[Exception Handler] -->|Error Responses| A
    
    style A fill:#ffcccc
    style B fill:#ccffcc
    style C fill:#ccccff
    style D fill:#ffffcc
    style E fill:#ffccff
    style F fill:#ccffff
```

### Flux d'authentification

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant JwtService
    participant UserRepository
    participant DB

    Client->>AuthController: POST /api/auth/login
    AuthController->>AuthService: authenticate(request)
    AuthService->>UserRepository: findByEmail(email)
    UserRepository->>DB: SELECT user
    DB-->>UserRepository: User data
    UserRepository-->>AuthService: User
    AuthService->>AuthService: verify password
    AuthService->>JwtService: generateToken(userDetails)
    JwtService-->>AuthService: JWT Token
    AuthService-->>AuthController: LoginResponse
    AuthController-->>Client: 200 OK + Token
```

### Flux de requête authentifiée

```mermaid
sequenceDiagram
    participant Client
    participant JwtFilter
    participant SecurityContext
    participant Controller
    participant Service
    participant Repository
    participant DB

    Client->>JwtFilter: Request + JWT Token
    JwtFilter->>JwtFilter: Extract & Validate Token
    JwtFilter->>SecurityContext: Set Authentication
    JwtFilter->>Controller: Forward Request
    Controller->>Service: Business Logic
    Service->>Repository: Data Access
    Repository->>DB: SQL Query
    DB-->>Repository: Result
    Repository-->>Service: Entity
    Service-->>Controller: DTO
    Controller-->>Client: JSON Response
```

---

## 📁 Structure du projet

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/hahn/taskmanager/
│   │   │   ├── config/              # Configuration
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/          # Contrôleurs REST
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── ProjectController.java
│   │   │   │   └── TaskController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   ├── ProjectRequest.java
│   │   │   │   ├── ProjectResponse.java
│   │   │   │   ├── TaskRequest.java
│   │   │   │   └── TaskResponse.java
│   │   │   ├── entity/              # Entités JPA
│   │   │   │   ├── User.java
│   │   │   │   ├── Project.java
│   │   │   │   └── Task.java
│   │   │   ├── exception/           # Gestion des erreurs
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── repository/          # Repositories JPA
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   └── TaskRepository.java
│   │   │   ├── service/             # Logique métier
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── JwtService.java
│   │   │   │   ├── ProjectService.java
│   │   │   │   └── TaskService.java
│   │   │   └── TaskManagerApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

### Diagramme des relations entre entités

```mermaid
erDiagram
    USER ||--o{ PROJECT : "has"
    PROJECT ||--o{ TASK : "contains"
    
    USER {
        Long id PK
        String email UK
        String password
        String fullName
    }
    
    PROJECT {
        Long id PK
        String title
        String description
        LocalDateTime createdAt
        Long userId FK
    }
    
    TASK {
        Long id PK
        String title
        String description
        LocalDate dueDate
        boolean completed
        LocalDateTime createdAt
        Long projectId FK
    }
```

---

## 🚀 Installation

### Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- MySQL 8.0+ (ou MariaDB)
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Étapes d'installation

1. **Cloner le projet** (si applicable)
   ```bash
   git clone <repository-url>
   cd hahn/backend
   ```

2. **Configurer MySQL**
   ```sql
   CREATE DATABASE task_manager_db;
   -- La base sera créée automatiquement si createDatabaseIfNotExist=true
   ```

3. **Configurer les paramètres**
   - Modifier `application.properties` avec vos identifiants MySQL
   - Voir section [Configuration](#configuration)

4. **Compiler le projet**
   ```bash
   mvn clean install
   ```

5. **Lancer l'application**
   ```bash
   mvn spring-boot:run
   ```
   
   Ou depuis votre IDE, exécutez la classe `TaskManagerApplication`

6. **Vérifier le démarrage**
   - L'application démarre sur `http://localhost:8080`
   - Les utilisateurs de démonstration sont créés automatiquement

---

## ⚙️ Configuration

### Fichier `application.properties`

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/task_manager_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000  # 24 heures en millisecondes

# CORS
cors.allowed-origins=http://localhost:5173
```

### Utilisateurs de démonstration

L'application crée automatiquement deux utilisateurs au démarrage :

| Email | Password | Nom |
|-------|----------|-----|
| `user@example.com` | `password123` | John Doe |
| `alice@example.com` | `alice123` | Alice Smith |

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentification

#### `POST /api/auth/login`
Authentifie un utilisateur et retourne un token JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

**Erreurs:**
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Email ou mot de passe incorrect

---

### Projets

Tous les endpoints de projets nécessitent une authentification JWT.

#### `POST /api/projects`
Crée un nouveau projet.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Mon Projet",
  "description": "Description du projet"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Mon Projet",
  "description": "Description du projet",
  "createdAt": "2024-01-15T10:30:00",
  "totalTasks": 0,
  "completedTasks": 0,
  "progressPercentage": 0.0
}
```

#### `GET /api/projects`
Récupère tous les projets de l'utilisateur authentifié.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Mon Projet",
    "description": "Description",
    "createdAt": "2024-01-15T10:30:00",
    "totalTasks": 5,
    "completedTasks": 2,
    "progressPercentage": 40.0
  }
]
```

#### `GET /api/projects/{id}`
Récupère un projet spécifique par son ID.

**Response (200 OK):**
```json
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

#### `PUT /api/projects/{id}`
Met à jour un projet.

**Request:**
```json
{
  "title": "Projet Modifié",
  "description": "Nouvelle description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Projet Modifié",
  "description": "Nouvelle description",
  "createdAt": "2024-01-15T10:30:00",
  "totalTasks": 5,
  "completedTasks": 2,
  "progressPercentage": 40.0
}
```

#### `DELETE /api/projects/{id}`
Supprime un projet et toutes ses tâches.

**Response (204 No Content)**

---

### Tâches

Tous les endpoints de tâches nécessitent une authentification JWT.

#### `POST /api/projects/{projectId}/tasks`
Crée une nouvelle tâche dans un projet.

**Request:**
```json
{
  "title": "Ma Tâche",
  "description": "Description de la tâche",
  "dueDate": "2024-12-31"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Ma Tâche",
  "description": "Description de la tâche",
  "dueDate": "2024-12-31",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00",
  "projectId": 1
}
```

#### `GET /api/projects/{projectId}/tasks`
Récupère toutes les tâches d'un projet.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Ma Tâche",
    "description": "Description",
    "dueDate": "2024-12-31",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00",
    "projectId": 1
  }
]
```

#### `PUT /api/projects/{projectId}/tasks/{taskId}`
Met à jour une tâche.

**Request:**
```json
{
  "title": "Tâche Modifiée",
  "description": "Nouvelle description",
  "dueDate": "2024-12-31"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Tâche Modifiée",
  "description": "Nouvelle description",
  "dueDate": "2024-12-31",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00",
  "projectId": 1
}
```

#### `PATCH /api/projects/{projectId}/tasks/{taskId}/toggle`
Bascule le statut de complétion d'une tâche.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Ma Tâche",
  "description": "Description",
  "dueDate": "2024-12-31",
  "completed": true,
  "createdAt": "2024-01-15T10:30:00",
  "projectId": 1
}
```

#### `DELETE /api/projects/{projectId}/tasks/{taskId}`
Supprime une tâche.

**Response (204 No Content)**

---

## 🔐 Authentification JWT

### Comment ça fonctionne

1. **Login**: L'utilisateur envoie email/password
2. **Validation**: Le serveur vérifie les credentials
3. **Token génération**: Un JWT est créé avec l'email de l'utilisateur
4. **Stockage**: Le client stocke le token (localStorage, sessionStorage, etc.)
5. **Requêtes**: Chaque requête inclut le token dans le header `Authorization: Bearer <token>`
6. **Validation**: Le filtre JWT valide le token à chaque requête

### Structure du token JWT

```json
{
  "sub": "user@example.com",
  "iat": 1705312800,
  "exp": 1705399200
}
```

### Utilisation dans les requêtes

```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Expiration

- Durée par défaut: **24 heures** (86400000 ms)
- Configurable dans `application.properties`: `jwt.expiration`

---

## 🗄 Base de données

### Schéma de base de données

```mermaid
erDiagram
    USER {
        bigint id PK
        varchar email UK "NOT NULL"
        varchar password "NOT NULL"
        varchar fullName "NOT NULL"
    }
    
    PROJECT {
        bigint id PK
        varchar title "NOT NULL"
        varchar description
        datetime createdAt "NOT NULL"
        bigint user_id FK "NOT NULL"
    }
    
    TASK {
        bigint id PK
        varchar title "NOT NULL"
        varchar description
        date dueDate "NOT NULL"
        boolean completed "NOT NULL DEFAULT false"
        datetime createdAt "NOT NULL"
        bigint project_id FK "NOT NULL"
    }
    
    USER ||--o{ PROJECT : "has many"
    PROJECT ||--o{ TASK : "contains"
```

### Relations

- **User → Projects**: One-to-Many (Un utilisateur a plusieurs projets)
- **Project → Tasks**: One-to-Many (Un projet contient plusieurs tâches)
- **Cascade**: Suppression en cascade (supprimer un projet supprime ses tâches)

### Stratégie de génération

- `ddl-auto=update`: Hibernate met à jour automatiquement le schéma
- Les tables sont créées automatiquement au démarrage

---

## 💡 Exemples d'utilisation

### Exemple complet avec cURL

#### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### 2. Créer un projet
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Mon Projet",
    "description": "Description du projet"
  }'
```

#### 3. Créer une tâche
```bash
curl -X POST http://localhost:8080/api/projects/1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Ma Tâche",
    "description": "Description de la tâche",
    "dueDate": "2024-12-31"
  }'
```

#### 4. Récupérer tous les projets
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer <token>"
```

#### 5. Marquer une tâche comme complétée
```bash
curl -X PATCH http://localhost:8080/api/projects/1/tasks/1/toggle \
  -H "Authorization: Bearer <token>"
```

### Exemple avec JavaScript (Fetch API)

```javascript
// Login
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Créer un projet
const projectResponse = await fetch('http://localhost:8080/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Mon Projet',
    description: 'Description du projet'
  })
});

const project = await projectResponse.json();
console.log(project);
```

---

## 🛡 Sécurité

### Mesures de sécurité implémentées

- ✅ **JWT Authentication**: Tokens sécurisés avec expiration
- ✅ **Password Encryption**: BCrypt pour le hachage des mots de passe
- ✅ **CORS Configuration**: Origines autorisées configurées
- ✅ **Input Validation**: Validation Jakarta sur tous les DTOs
- ✅ **SQL Injection Protection**: JPA/Hibernate avec paramètres liés
- ✅ **Exception Handling**: Gestion centralisée des erreurs

### Configuration CORS

Actuellement configuré pour `http://localhost:5173` (Vite/React par défaut).

Pour changer l'origine autorisée, modifiez `application.properties`:
```properties
cors.allowed-origins=http://localhost:3000
```

---

## 🧪 Tests

### Lancer les tests

```bash
mvn test
```

### Structure des tests

Les tests sont dans `src/test/java/com/hahn/taskmanager/`

---

## 📝 Notes importantes

### Validation des données

- Tous les DTOs utilisent Jakarta Validation
- Les erreurs de validation retournent un `400 Bad Request` avec les détails

### Gestion des erreurs

- `404 Not Found`: Ressource non trouvée
- `401 Unauthorized`: Token invalide ou expiré
- `400 Bad Request`: Données invalides
- `500 Internal Server Error`: Erreur serveur

### Performance

- Les requêtes utilisent des transactions `@Transactional`
- Les relations JPA utilisent `LAZY` loading pour optimiser les performances
- Les métriques de projet (totalTasks, progressPercentage) sont calculées dynamiquement

---

## 🔧 Dépannage

### Problèmes courants

#### 1. Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans `application.properties`
- Vérifiez que la base de données existe

#### 2. Erreur 401 Unauthorized
- Vérifiez que le token JWT est valide
- Vérifiez que le token n'est pas expiré
- Vérifiez le format du header: `Authorization: Bearer <token>`

#### 3. Erreur CORS
- Vérifiez que l'origine du frontend correspond à `cors.allowed-origins`
- Vérifiez que le header `Authorization` est autorisé

---

## 📚 Ressources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/) - Décoder et vérifier les tokens JWT
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 👥 Auteur

Développé par Mr.SALIM Haytem

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2024


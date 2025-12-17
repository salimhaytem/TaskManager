# 🎨 TaskFlow Frontend

Interface utilisateur moderne pour le système de gestion de tâches TaskManager, construite avec React et TypeScript.

## 📑 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Workflow utilisateur](#workflow-utilisateur)
- [Structure du projet](#structure-du-projet)
- [Composants principaux](#composants-principaux)
- [Exemples d'utilisation](#exemples-dutilisation)

---

## 🎯 Vue d'ensemble

**TaskFlow** est une application web moderne de gestion de projets et de tâches. Elle permet aux utilisateurs de :
- ✅ S'authentifier de manière sécurisée
- 📁 Créer et gérer des projets
- ✅ Ajouter et suivre des tâches
- 📊 Visualiser la progression en temps réel

---

## 🏗 Architecture

### Architecture Globale

```mermaid
graph TB
    User[👤 Utilisateur] --> UI[Interface React]
    UI --> Router[React Router]
    Router --> Auth[Pages Authentification]
    Router --> Dashboard[Pages Dashboard]
    
    Auth --> SignIn[Sign In]
    Auth --> SignUp[Sign Up]
    
    Dashboard --> Overview[Vue d'ensemble]
    Dashboard --> Projects[Liste Projets]
    Dashboard --> ProjectDetails[Détails Projet]
    Dashboard --> CreateProject[Créer Projet]
    
    UI --> Context[Context Providers]
    Context --> AuthContext[AuthContext]
    Context --> ProjectContext[ProjectContext]
    
    AuthContext --> API[API Backend]
    ProjectContext --> API
    
    API --> Backend[Spring Boot\nhttp://localhost:8080]
    
    style User fill:#e1f5ff
    style UI fill:#fff4e1
    style Backend fill:#e1ffe1
    style Context fill:#ffe1e1
```

### Architecture des Composants

```mermaid
graph LR
    A[App.tsx] --> B[AuthProvider]
    B --> C[ProjectProvider]
    C --> D[Router]
    
    D --> E[Public Routes]
    D --> F[Protected Routes]
    
    E --> G[Index]
    E --> H[SignIn]
    E --> I[SignUp]
    
    F --> J[DashboardLayout]
    J --> K[Navbar]
    J --> L[Sidebar]
    J --> M[Pages]
    
    M --> N[Overview]
    M --> O[Projects]
    M --> P[ProjectDetails]
    M --> Q[CreateProject]
    
    style A fill:#ffcccc
    style B fill:#ccffcc
    style C fill:#ccccff
    style F fill:#ffffcc
```

---

## 🛠 Technologies utilisées

| Technologie | Version | Description |
|------------|---------|-------------|
| **React** | 18.3.1 | Bibliothèque UI |
| **TypeScript** | 5.8.3 | Typage statique |
| **Vite** | 7.3.0 | Build tool moderne |
| **React Router** | 6.30.1 | Navigation SPA |
| **TanStack Query** | 5.83.0 | Gestion d'état serveur |
| **React Hook Form** | 7.61.1 | Gestion de formulaires |
| **Zod** | 3.25.76 | Validation de schémas |
| **Tailwind CSS** | 3.4.17 | Framework CSS utilitaire |
| **shadcn/ui** | - | Composants UI (Radix UI) |
| **Lucide React** | 0.462.0 | Icônes |

---

## 🚀 Installation

### Prérequis

- Node.js 18+ ou Bun
- npm ou bun
- Backend Spring Boot en cours d'exécution sur `http://localhost:8080`

### Étapes d'installation

1. **Naviguer vers le dossier frontend**
   ```bash
   cd frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   bun dev
   ```

4. **Accéder à l'application**
   - Ouvrir `http://localhost:5173` dans votre navigateur

5. **Build pour la production** (optionnel)
   ```bash
   npm run build
   npm run preview
   ```

---

## 👤 Workflow utilisateur

### Flux d'authentification

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant UI as Interface
    participant AC as AuthContext
    participant API as Backend API
    participant LS as LocalStorage

    U->>UI: Accède à /signin
    UI->>U: Affiche formulaire
    U->>UI: Entre email + password
    UI->>AC: login(email, password)
    AC->>API: POST /api/auth/login
    
    alt Login Success
        API-->>AC: {token, email, fullName}
        AC->>LS: Sauvegarde token
        AC-->>UI: Success
        UI->>U: Redirige vers /dashboard
    else Login Failed
        API-->>AC: 401 Unauthorized
        AC-->>UI: Error message
        UI->>U: Affiche erreur
    end
```

### Flux de gestion de projet

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant P as Projects Page
    participant PC as ProjectContext
    participant API as Backend API
    participant PD as ProjectDetails

    U->>P: Clique "New Project"
    P->>U: Affiche formulaire
    U->>P: Entre titre + description
    P->>PC: createProject(data)
    PC->>API: POST /api/projects
    API-->>PC: ProjectResponse
    PC-->>P: Projet créé
    P->>U: Affiche toast success
    
    U->>P: Clique sur un projet
    P->>PD: Navigation /projects/{id}
    PD->>PC: getProject(id)
    PC-->>PD: Project data
    PD->>U: Affiche détails + tâches
```

### Flux de gestion de tâches

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant PD as ProjectDetails
    participant PC as ProjectContext
    participant API as Backend API

    U->>PD: Clique "Add Task"
    PD->>U: Affiche dialog
    U->>PD: Entre titre, description, date
    PD->>PC: addTask(projectId, data)
    PC->>API: POST /api/projects/{id}/tasks
    API-->>PC: TaskResponse
    PC-->>PD: Tâche ajoutée
    PD->>U: Affiche tâche + toast
    
    U->>PD: Toggle tâche complétée
    PD->>PC: toggleTask(projectId, taskId)
    PC->>API: PATCH /api/projects/{id}/tasks/{taskId}/toggle
    API-->>PC: TaskResponse updated
    PC-->>PD: État mis à jour
    PD->>U: Progression recalculée
```

---

## 📁 Structure du projet

```
frontend/
├── public/                      # Assets statiques
├── src/
│   ├── components/             # Composants réutilisables
│   │   ├── ui/                # Composants shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ...
│   │   ├── DashboardSidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── TaskItem.tsx
│   │
│   ├── contexts/               # Context API
│   │   ├── AuthContext.tsx    # Authentification
│   │   └── ProjectContext.tsx # Gestion projets/tâches
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── use-toast.ts
│   │
│   ├── lib/                    # Utilitaires
│   │   └── utils.ts
│   │
│   ├── pages/                  # Pages de l'application
│   │   ├── Dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Overview.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectDetails.tsx
│   │   │   └── CreateProject.tsx
│   │   ├── Index.tsx          # Page d'accueil
│   │   ├── SignIn.tsx         # Connexion
│   │   ├── SignUp.tsx         # Inscription
│   │   └── NotFound.tsx       # 404
│   │
│   ├── App.tsx                 # Composant racine
│   ├── main.tsx                # Point d'entrée
│   └── index.css               # Styles globaux
│
├── index.html                  # Template HTML
├── package.json                # Dépendances
├── tailwind.config.ts          # Config Tailwind
├── tsconfig.json               # Config TypeScript
└── vite.config.ts              # Config Vite
```

---

## 🧩 Composants principaux

### AuthContext

Gère l'état d'authentification global :
- Login/Logout
- Stockage du token JWT
- Récupération des informations utilisateur
- Protection des routes

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### ProjectContext

Gère l'état des projets et tâches :
- CRUD Projets
- CRUD Tâches
- Calcul de progression
- Cache local

```typescript
const { 
  projects, 
  createProject, 
  deleteProject,
  addTask, 
  toggleTask,
  getProjectProgress 
} = useProjects();
```

### ProtectedRoute

Composant de protection des routes nécessitant l'authentification :

```typescript
<ProtectedRoute>
  <DashboardLayout />
</ProtectedRoute>
```

---

## 📖 Exemples d'utilisation

### Exemple 1 : Se connecter

```mermaid
flowchart TD
    A[👤 Utilisateur arrive sur l'app] --> B{Authentifié ?}
    B -->|Non| C[Redirigé vers /signin]
    B -->|Oui| D[Accède au /dashboard]
    
    C --> E[Remplit formulaire]
    E --> F[Email: user@example.com<br/>Password: password123]
    F --> G[Clique 'Sign In']
    G --> H{Credentials valides ?}
    
    H -->|Oui| I[Token JWT sauvegardé]
    I --> J[Redirigé vers /dashboard]
    
    H -->|Non| K[Message d'erreur affiché]
    K --> E
    
    style A fill:#e1f5ff
    style J fill:#ccffcc
    style K fill:#ffcccc
```

**Détails :**
1. L'utilisateur entre `user@example.com` et `password123`
2. Le système envoie une requête POST à `/api/auth/login`
3. Le backend renvoie un JWT token
4. Le token est stocké dans localStorage
5. L'utilisateur est redirigé vers le tableau de bord

---

### Exemple 2 : Créer un projet

```mermaid
flowchart TD
    A[📊 Dashboard] --> B[Clique 'New Project']
    B --> C[Redirigé vers /dashboard/create-project]
    C --> D[Formulaire affiché]
    
    D --> E[Entre titre: 'Site Web E-commerce']
    E --> F[Entre description: 'Créer un site de vente en ligne']
    F --> G[Clique 'Create Project']
    
    G --> H[POST /api/projects]
    H --> I{Success ?}
    
    I -->|Oui| J[Projet créé avec ID]
    J --> K[Toast: 'Project created!']
    K --> L[Ajouté à la liste]
    L --> M[Redirigé vers /dashboard/projects]
    
    I -->|Non| N[Toast erreur]
    N --> D
    
    style A fill:#e1f5ff
    style M fill:#ccffcc
    style N fill:#ffcccc
```

**Résultat :**
- Un nouveau projet apparaît dans la grille avec :
  - Titre : "Site Web E-commerce"
  - Description : "Créer un site de vente en ligne"
  - Progression : 0% (0/0 tâches)

---

### Exemple 3 : Ajouter et gérer des tâches

```mermaid
flowchart TD
    A[📁 Page Projet] --> B[Affiche détails du projet]
    B --> C[Clique 'Add Task']
    
    C --> D[Dialog s'ouvre]
    D --> E[Titre: 'Créer maquettes']
    E --> F[Description: 'Designs Figma page accueil']
    F --> G[Due Date: '2025-12-31']
    G --> H[Clique 'Create Task']
    
    H --> I[POST /api/projects/1/tasks]
    I --> J[Tâche ajoutée à 'Pending Tasks']
    
    J --> K{Utilisateur complete la tâche}
    K --> L[Clique sur checkbox]
    L --> M[PATCH /api/projects/1/tasks/1/toggle]
    
    M --> N[Tâche déplacée vers 'Completed Tasks']
    N --> O[Progression mise à jour]
    O --> P[Barre de progression: 33%]
    
    style A fill:#e1f5ff
    style P fill:#ccffcc
```

**Scénario complet :**

1. **État initial du projet "Site Web E-commerce"**
   - Total tâches : 0
   - Complétées : 0
   - Progression : 0%

2. **Ajout de 3 tâches :**
   - ✅ "Créer maquettes" - Due: 2025-12-31
   - ✅ "Développer frontend" - Due: 2026-01-15
   - ✅ "Configurer backend" - Due: 2026-01-10

3. **Après ajout :**
   - Total tâches : 3
   - Complétées : 0
   - Progression : 0%

4. **L'utilisateur complète "Créer maquettes" :**
   - Clique sur la checkbox de la tâche
   - La tâche passe de "Pending" à "Completed"
   - Progression mise à jour : 33% (1/3)

5. **Visualisation :**
   ```
   ┌─────────────────────────────────────┐
   │  Site Web E-commerce                │
   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
   │  Progress: ████████░░░░░░░░░░░░ 33% │
   │  1 of 3 tasks completed             │
   └─────────────────────────────────────┘
   
   Pending Tasks (2):
   ☐ Développer frontend (Due: Jan 15)
   ☐ Configurer backend (Due: Jan 10)
   
   Completed Tasks (1):
   ☑ Créer maquettes (Due: Dec 31)
   ```

---

### Exemple 4 : Navigation complète

```mermaid
graph TD
    Start([🏠 Page d'accueil]) --> SignIn[🔐 Sign In]
    SignIn --> Dashboard[📊 Dashboard Overview]
    
    Dashboard --> Stats[📈 Voir statistiques]
    Dashboard --> AllProjects[📁 Cliquer 'View All Projects']
    
    AllProjects --> ProjectsList[📋 Liste de tous les projets]
    ProjectsList --> NewProject[➕ Créer nouveau projet]
    ProjectsList --> ViewProject[👁️ Voir détails projet]
    
    NewProject --> CreateForm[📝 Formulaire création]
    CreateForm --> ProjectsList
    
    ViewProject --> ProjectDetail[📁 Page détails]
    ProjectDetail --> AddTask[➕ Ajouter tâche]
    ProjectDetail --> ToggleTask[✅ Toggle tâche]
    ProjectDetail --> DeleteTask[🗑️ Supprimer tâche]
    ProjectDetail --> DeleteProject[🗑️ Supprimer projet]
    
    AddTask --> ProjectDetail
    ToggleTask --> UpdateProgress[📊 Progression mise à jour]
    UpdateProgress --> ProjectDetail
    
    DeleteTask --> ProjectDetail
    DeleteProject --> ProjectsList
    
    Dashboard --> Logout[🚪 Se déconnecter]
    Logout --> Start
    
    style Start fill:#e1f5ff
    style Dashboard fill:#fff4e1
    style ProjectDetail fill:#ccffcc
```

---

## 🎨 Interface utilisateur

### Design System

**Couleurs :**
- Primary : Violet/Bleu pour les actions principales
- Success : Vert pour les tâches complétées
- Warning : Orange pour les tâches en attente
- Destructive : Rouge pour les actions de suppression

**Composants UI :**
- Buttons avec variantes (default, outline, ghost, destructive)
- Cards avec ombres subtiles
- Progress bars animées
- Dialogs et AlertDialogs pour les confirmations
- Toast notifications pour le feedback

---

## 🔒 Sécurité

- **Routes protégées** : Redirection automatique vers `/signin` si non authentifié
- **Token JWT** : Stocké de manière sécurisée dans localStorage
- **Expiration** : Gestion automatique de l'expiration du token
- **CORS** : Configuration correcte avec le backend

---

## 📦 Build et Déploiement

### Build de production

```bash
npm run build
```

Génère les fichiers optimisés dans `dist/`

### Variables d'environnement

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:8080
```

### Déploiement

Compatible avec :
- Vercel
- Netlify
- GitHub Pages
- Tout hébergeur statique

---

## 🐛 Dépannage

### Problème : Impossible de se connecter au backend

**Solution :**
- Vérifier que le backend est démarré sur `http://localhost:8080`
- Vérifier la console pour les erreurs CORS

### Problème : Token expiré

**Solution :**
- Se reconnecter
- Le token JWT expire après 24h

---

## 👨‍💻 Développement

### Lancer en mode dev

```bash
npm run dev
```

### Linter

```bash
npm run lint
```

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👥 Auteur

Développé par Mr.SALIM Haytem

---

**Version :** 1.0.0  
**Dernière mise à jour :** Décembre 2024

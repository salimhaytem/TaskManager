# 🔧 Guide de dépannage - Connexion

## Problème : La connexion ne fonctionne pas

### ✅ Vérifications à faire

#### 1. Vérifier que le backend est démarré

Ouvrez un terminal et vérifiez que le backend tourne :

```powershell
# Vérifier si le port 8080 est utilisé
netstat -ano | findstr :8080
```

Ou testez directement l'API :

```powershell
# Tester l'endpoint de login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

**Si le backend n'est pas démarré :**

```powershell
cd C:\Users\pc\Desktop\hahn\backend
mvn spring-boot:run
```

Attendez de voir :
```
🚀 Application started successfully on http://localhost:8080
```

#### 2. Vérifier la console du navigateur

1. Ouvrez votre navigateur (Chrome, Firefox, Edge)
2. Appuyez sur `F12` pour ouvrir les outils de développement
3. Allez dans l'onglet **Console**
4. Essayez de vous connecter
5. Regardez les erreurs affichées

**Erreurs courantes :**

- `Failed to fetch` ou `Network Error` → Le backend n'est pas accessible
- `CORS policy` → Problème de configuration CORS
- `401 Unauthorized` → Email/mot de passe incorrect
- `404 Not Found` → L'URL de l'API est incorrecte

#### 3. Vérifier l'URL de l'API

Dans la console du navigateur, vérifiez quelle URL est appelée :

1. Ouvrez l'onglet **Network** (Réseau)
2. Essayez de vous connecter
3. Cherchez la requête vers `/api/auth/login`
4. Vérifiez l'URL complète (devrait être `http://localhost:8080/api/auth/login`)

#### 4. Vérifier les identifiants

Utilisez les identifiants de démonstration :

- **Email** : `user@example.com`
- **Password** : `password123`

Ou :

- **Email** : `alice@example.com`
- **Password** : `alice123`

### 🔍 Diagnostic étape par étape

#### Étape 1 : Test du backend

```powershell
# Dans PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"user@example.com","password":"password123"}'
```

**Si ça fonctionne** : Le backend répond correctement, le problème vient du frontend.

**Si ça ne fonctionne pas** : Le backend n'est pas démarré ou il y a une erreur.

#### Étape 2 : Test du frontend

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Ouvrez la console (F12)
3. Allez dans l'onglet **Network**
4. Essayez de vous connecter
5. Regardez la requête vers `/api/auth/login`

**Vérifiez :**
- L'URL complète de la requête
- Le statut de la réponse (200, 401, 404, 500, etc.)
- Le corps de la réponse

#### Étape 3 : Vérifier CORS

Si vous voyez une erreur CORS dans la console :

1. Vérifiez que le backend autorise `http://localhost:5173`
2. Le fichier `SecurityConfig.java` doit contenir :
   ```java
   configuration.setAllowedOrigins(List.of("http://localhost:5173"));
   ```

### 🛠 Solutions courantes

#### Solution 1 : Redémarrer le backend

```powershell
# Arrêter le backend (Ctrl+C)
# Puis redémarrer
cd C:\Users\pc\Desktop\hahn\backend
mvn spring-boot:run
```

#### Solution 2 : Vérifier la base de données

Le backend a besoin de MySQL. Vérifiez que :

1. MySQL est démarré
2. La base de données `task_manager_db` existe
3. Les identifiants dans `application.properties` sont corrects

#### Solution 3 : Vider le cache du navigateur

1. Appuyez sur `Ctrl + Shift + Delete`
2. Sélectionnez "Cookies et données de sites"
3. Cliquez sur "Effacer les données"
4. Rechargez la page

#### Solution 4 : Vérifier les variables d'environnement

Créez un fichier `.env` dans le dossier `frontend` :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Puis redémarrez le serveur de développement :

```powershell
# Arrêter (Ctrl+C) et redémarrer
npm run dev
```

### 📝 Logs à vérifier

#### Backend (dans le terminal où il tourne)

Cherchez des erreurs comme :
- `Connection refused`
- `Database connection failed`
- `Table doesn't exist`
- `Port 8080 already in use`

#### Frontend (dans la console du navigateur)

Cherchez des erreurs comme :
- `Failed to fetch`
- `CORS policy`
- `401 Unauthorized`
- `Network request failed`

### 🆘 Si rien ne fonctionne

1. **Vérifiez que les deux serveurs tournent :**
   - Backend : `http://localhost:8080`
   - Frontend : `http://localhost:5173`

2. **Testez avec curl ou Postman :**
   ```powershell
   curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
   ```

3. **Vérifiez les logs du backend** pour voir les requêtes reçues

4. **Vérifiez la console du navigateur** pour voir les erreurs exactes

### 📞 Informations à fournir en cas de problème

Si vous avez toujours un problème, fournissez :

1. Le message d'erreur exact de la console
2. Le statut HTTP de la réponse (dans l'onglet Network)
3. Les logs du backend
4. La version de Node.js : `node --version`
5. La version de Java : `java --version`


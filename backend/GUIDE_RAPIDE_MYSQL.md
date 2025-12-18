# ⚡ Guide Rapide - Configuration MySQL

## 🎯 Solution Rapide

### Si vous n'avez pas MySQL installé :

**Option 1 : Installer XAMPP (Le plus simple)**
1. Téléchargez : https://www.apachefriends.org/
2. Installez XAMPP
3. Ouvrez XAMPP Control Panel
4. Cliquez sur "Start" pour MySQL
5. ✅ MySQL est maintenant démarré sur le port 3306

**Option 2 : Installer MySQL directement**
1. Téléchargez : https://dev.mysql.com/downloads/installer/
2. Installez MySQL
3. Notez le mot de passe root que vous définissez
4. Démarrez le service MySQL :
   ```powershell
   net start MySQL80
   ```

### Configuration dans le projet

Le fichier `application.properties` est déjà configuré avec :
- **URL** : `localhost:3306/task_manager_db`
- **Username** : `root`
- **Password** : `root`

**⚠️ Si votre mot de passe MySQL est différent de "root"**, modifiez `application.properties` :

```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

### Vérifier que MySQL fonctionne

```powershell
# Test rapide
mysql -u root -p
# Entrez votre mot de passe
# Si ça fonctionne, tapez : exit
```

### Démarrer le backend

```powershell
cd C:\Users\pc\Desktop\hahn\backend
mvn spring-boot:run
```

**Ce qui va se passer :**
1. ✅ Spring Boot se connecte à MySQL
2. ✅ Crée automatiquement la base `task_manager_db`
3. ✅ Crée les tables automatiquement
4. ✅ Crée les utilisateurs de démonstration
5. ✅ Affiche : `🚀 Application started successfully`

### Si vous voyez une erreur de connexion

**Erreur :** `Communications link failure` ou `Access denied`

**Solutions :**
1. Vérifiez que MySQL est démarré
2. Vérifiez le mot de passe dans `application.properties`
3. Testez la connexion : `mysql -u root -p`

---

## 📋 Résumé des étapes

1. ✅ Installer MySQL (XAMPP ou MySQL directement)
2. ✅ Démarrer MySQL
3. ✅ Vérifier/modifier le mot de passe dans `application.properties`
4. ✅ Démarrer le backend : `mvn spring-boot:run`
5. ✅ Vérifier que vous voyez : `Application started successfully`

Une fois fait, vous pourrez vous connecter au frontend ! 🎉


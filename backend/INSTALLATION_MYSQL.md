# 🗄️ Installation et Configuration MySQL

## 📋 Prérequis

Avant de démarrer le backend, vous devez avoir MySQL installé et démarré.

## 🔧 Installation de MySQL

### Option 1 : Installer MySQL (Recommandé)

1. **Télécharger MySQL**
   - Allez sur : https://dev.mysql.com/downloads/installer/
   - Téléchargez "MySQL Installer for Windows"
   - Choisissez la version "Full" ou "Developer Default"

2. **Installer MySQL**
   - Lancez l'installateur
   - Suivez les étapes d'installation
   - **Important** : Notez le mot de passe root que vous définissez
   - Par défaut, le port est `3306`

3. **Vérifier l'installation**
   ```powershell
   mysql --version
   ```

### Option 2 : Utiliser XAMPP (Plus simple)

1. **Télécharger XAMPP**
   - Allez sur : https://www.apachefriends.org/
   - Téléchargez XAMPP pour Windows
   - Installez-le

2. **Démarrer MySQL via XAMPP**
   - Ouvrez le panneau de contrôle XAMPP
   - Cliquez sur "Start" pour MySQL
   - MySQL sera accessible sur `localhost:3306`

## 🚀 Démarrer MySQL

### Si vous avez installé MySQL directement :

```powershell
# Vérifier si MySQL est démarré
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Démarrer MySQL (si nécessaire)
net start MySQL80
# ou
net start MySQL
```

### Si vous utilisez XAMPP :

1. Ouvrez le panneau de contrôle XAMPP
2. Cliquez sur "Start" pour MySQL

### Vérifier que MySQL fonctionne :

```powershell
# Tester la connexion
mysql -u root -p
# Entrez votre mot de passe (par défaut "root" si vous utilisez la config du projet)
```

## ⚙️ Configuration de la base de données

### Étape 1 : Se connecter à MySQL

```powershell
mysql -u root -p
# Entrez votre mot de passe
```

### Étape 2 : Créer la base de données (Optionnel)

La base sera créée automatiquement grâce à `createDatabaseIfNotExist=true`, mais vous pouvez la créer manuellement :

```sql
CREATE DATABASE IF NOT EXISTS task_manager_db;
USE task_manager_db;
```

### Étape 3 : Vérifier les identifiants

Vérifiez que votre configuration dans `application.properties` correspond à vos identifiants MySQL :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_manager_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root  # ⚠️ Changez si votre mot de passe est différent
```

**Si votre mot de passe MySQL est différent de "root"**, modifiez `application.properties` :

```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

## ✅ Vérification

### Test 1 : Vérifier que MySQL écoute sur le port 3306

```powershell
netstat -ano | findstr :3306
```

Vous devriez voir quelque chose comme :
```
TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING
```

### Test 2 : Tester la connexion depuis PowerShell

```powershell
# Installer le module MySQL si nécessaire
# Install-Module -Name MySql.Data

# Ou utiliser telnet
Test-NetConnection -ComputerName localhost -Port 3306
```

### Test 3 : Se connecter avec MySQL Workbench (Optionnel)

1. Téléchargez MySQL Workbench : https://dev.mysql.com/downloads/workbench/
2. Créez une nouvelle connexion :
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: votre mot de passe
3. Testez la connexion

## 🚀 Démarrer le backend

Une fois MySQL installé et démarré :

```powershell
cd C:\Users\pc\Desktop\hahn\backend
mvn spring-boot:run
```

### Ce qui devrait se passer :

1. Spring Boot démarre
2. Il se connecte à MySQL
3. Il crée automatiquement la base `task_manager_db` si elle n'existe pas
4. Il crée les tables automatiquement (grâce à `ddl-auto=update`)
5. Il crée les utilisateurs de démonstration
6. Vous voyez : `🚀 Application started successfully on http://localhost:8080`

### Si vous voyez une erreur de connexion :

```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
```

**Solutions :**
1. Vérifiez que MySQL est démarré
2. Vérifiez le mot de passe dans `application.properties`
3. Vérifiez que le port 3306 est accessible
4. Vérifiez que le firewall n'bloque pas MySQL

## 🔧 Dépannage

### Problème : "Access denied for user 'root'@'localhost'"

**Solution :**
1. Vérifiez le mot de passe dans `application.properties`
2. Ou réinitialisez le mot de passe MySQL :
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
   FLUSH PRIVILEGES;
   ```

### Problème : "Can't connect to MySQL server"

**Solutions :**
1. Vérifiez que MySQL est démarré
2. Vérifiez le port (par défaut 3306)
3. Vérifiez les logs MySQL pour les erreurs

### Problème : "Unknown database 'task_manager_db'"

**Solution :**
La base sera créée automatiquement grâce à `createDatabaseIfNotExist=true`. Si ça ne fonctionne pas, créez-la manuellement :

```sql
CREATE DATABASE task_manager_db;
```

## 📝 Configuration alternative : Utiliser H2 (Base de données en mémoire)

Si vous ne voulez pas installer MySQL pour le développement, vous pouvez utiliser H2 (base de données en mémoire) :

### 1. Ajouter la dépendance H2 dans `pom.xml` :

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Modifier `application.properties` :

```properties
# H2 Database (pour le développement uniquement)
spring.datasource.url=jdbc:h2:mem:taskmanager
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

**⚠️ Note :** H2 est une base en mémoire, les données seront perdues à chaque redémarrage. Utilisez MySQL pour la production.

## ✅ Checklist

Avant de démarrer le backend, vérifiez :

- [ ] MySQL est installé
- [ ] MySQL est démarré (service actif ou XAMPP)
- [ ] Le port 3306 est accessible
- [ ] Les identifiants dans `application.properties` sont corrects
- [ ] La base de données peut être créée (permissions)

Une fois tout cela fait, le backend devrait démarrer correctement ! 🎉


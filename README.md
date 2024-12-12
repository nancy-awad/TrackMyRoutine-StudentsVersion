# 1. Comprendre les fonctionnalités clés pour établir votre projet
Il faut en premier comprendre les fonctionalités clés et structurer votre projet pour bien demarrer avant le codage.

## Authentification des utilisateurs
- Inscription : Les utilisateurs peuvent créer un compte avec un nom d'utilisateur, un e-mail et un mot de passe.
- Connexion : Les utilisateurs peuvent se connecter avec leurs identifiants et recevoir un jeton ou un cookie pour rester connectés.
- Rester connecté : Utiliser des JWT (JSON Web Tokens) ou des cookies pour maintenir les sessions des utilisateurs.

## Gestion des habitudes (opérations CRUD)
- Créer : Ajouter de nouvelles habitudes à suivre pour les utilisateurs (par exemple, faire de l'exercice, étudier, etc.).
- Lire : Consulter la liste des habitudes ou les détails d'une habitude spécifique.
- Mettre à jour : Modifier des habitudes existantes (par exemple, renommer, changer la fréquence).
- Supprimer : Retirer des habitudes de la liste de l'utilisateur.

## Suivi quotidien
- Marquer comme complétée : Les utilisateurs peuvent indiquer qu'une habitude a été accomplie pour un jour donné.
- Données historiques : Récupérer l'historique des habitudes (par exemple, quelles habitudes ont été complétées quels jours).

## Rapport mensuel
- Résumé des performances : Générer des rapports montrant le suivi des habitudes pour chaque mois (par exemple, le pourcentage de jours où une habitude a été complétée).


# 2. Configurer l'environnement pour votre projet

## 2.1 Structurer le projet:

Creez la structure de votre projet: les dossiers et l'arborescence à suivre pour vos dossiers/fichiers. Cette architecture initiale du projet peut changé à fur et à mesure de l'avancement en rajoutant supprimant ou deplacant des fichiers.

## 2.2 : Initialiser le projet:

* _Installer Node.js : Si Node.js n’est pas encore installé, téléchargez et installez-le depuis le site officiel de Node.js._

* Ouvrez votre terminal/ligne de commande depuis votre dossier dans VS code et exécutez la commande :

```javascript
npm init -y
```
* Cela générera un fichier package.json pour votre projet.



## 2.3 : Choisir les outils/technologies

Il faut penser aux outils et technologies necessaires pour developper votre backend avant de se lancer dans le codage sinon vous vous tromperez sur le chemein sans être sûre d'où vient le problème.

1. ### Technologies de base utilisées pour ce projet: {Node.js, Express.js SQLite}

- Nous utiliserons Node.js comme environnement de developement,  Express.js pour configurer le serveur et gérer les routes des différents points d'API (par exemple, inscription, connexion, opérations CRUD pour les habitudes). Et finalement SQlite pour le stoquage et la gestion des données.

2. #### Choisir une methode d'authentification en plus du username/password, entre JWT ou Cookies:

- **JWT (JSON Web Tokens)**: Une méthode sécurisée pour authentifier les utilisateurs sans nécessiter de sessions. Les JWT peuvent être stockés dans des cookies ou dans le stockage local côté client.

- **Cookies** : Alternativement, vous pouvez utiliser des cookies pour stocker la session et garder les utilisateurs connectés.

3. #### Middleware :

- **body-parser**: Pour analyser les données JSON envoyées par les utilisateurs dans les requêtes (important pour les requêtes POST et PUT).

- **CORS** : Pour gérer le partage de ressources entre origines, utile si votre front-end et votre back-end sont hébergés sur des domaines ou ports différents.

- **dotenv** : Pour stocker les variables d'environnement (par exemple, clés secrètes, chaînes de connexion à la base de données).

## 2.4 Installer les dépendances 
En fonction des outils que vous choisissez, vous devrez installer certaines dépendances :

`npm install express bcryptjs jsonwebtoken body-parser cors dotenv sqlite3`

Vous pouvez vérifier les paquets installés en consultant le fichier package.json.

Voici à quoi sert certains paquets :
----------------------------------
- **express**: Un framework léger pour créer l'API REST.
- **dotenv**: Pour gerer les variables de l'environement.
- **bcryptjs**: Pour hacher et comparer les mots de passe.
- **jsonwebtoken**: Pour gérer et verifier les JSON Web Tokens (si vous choisisser de l'utiliser au lieu des sessions).
- **cookie-parser**: Pour gérer les sessions.
- **body-parser** : Pour analyser les corps de requêtes entrants.
- **cors** : Pour autoriser les requêtes cross-origin, utile si vous utilisez des environnements différents (par exemple, front-end et back-end).
- **dotenv** : Pour gérer les variables d'environnement.
- **sqlite3**: Pour créer et gérer une BD simple.

Vous pouvez toujours installer les modules externes à fur et à mesure de votre avancement dans le projet selon les besoins rencontrés.

*__Remarque__: Si vous cloner un projet qui contient le fichier package.json il vous suffit d'executer la commande `npm install` sans preciser la liste des paquets à installer qui va être recuperer directement du fichier packag.json*

## 2.5 : Definir votre point d'entrée du Backend
Le fichier _server.js_ est le point d'entrée du backend de votre projet. Il initialise le serveur, charge les routes qui sont dans les autres fichiers, et configure des routes géneraux si necessaire, connecte la base de données et gère les requêtes HTTP via les middlewares.

Pour le lancer:

`node backend/server/server.js`

# 3. Definition la Base de Données

## 3.1 Création de la Base de Données SQLite
- Pensez **TOUJOURS** en premier à la façon dont vos données seront stockées et représentées. Une base de données mal conçue, avec un MCD non logique, peut rendre votre logique de développement exponentiellement plus complexe. Prenez le temps de réfléchir à la structure de vos tables, aux informations à conserver (colonnes necessaires), et aux relations entre elles. Évaluez si certaines données nécessitent la création de nouvelles tables plutôt que l'ajout de colonnes supplémentaires ou de relations compliquées. Une structure bien pensée est indispensable pour garantir la cohérence et l'efficacité de votre base de données.

- Commencez par la BD avant de commencez par le developement de votre serveur.

- Pour ce projet vous trouvez le script de creation de la base de données dans db/dbCreation.js

- Une fois que vous avez le script de création (et d'insertion facultatif ) prêt dans votre fichier db.js, vous pouvez l'exécuter depuis le terminal pour lancer les commandes SQL.

`node /backend/db/dbCreation.js`

<!-- ![C'est le script de creation de BD ](private/images/Script-Creation-BD.png)</br> -->

- Verifier que votre base de données a été créee habitTracker.db


### Quelques remarques :

- Si vous importez le fichier db.js dans server.js, il s'exécutera à chaque fois que vous lancez l'application. Il n'est donc pas nécessaire de le faire à chaque fois. Vous pouvez exécuter le fichier db.js une seule fois dans votre terminal pour créer la base de données.

- La base de données est simple, donc tout le code SQL est inclus dans un seul fichier. Vous pouvez le structurer selon vos besoins.
Assurez-vous d'exécuter les scripts de création (et d'insertion, si vous en avez) de manière contrôlée pour éviter des exécutions multiples inutiles.


## 3.2 Interagir avec la Base de Données depuis la Ligne de Commande
Il est indispensable de vérifier les données de votre base de données (BD) en dehors des APIs. Cela permet de valider que vos requêtes SQL sont correctes ou de tester des requêtes avant de les intégrer dans vos APIs. C'est pourquoi accéder directement à votre base de données SQLite depuis la ligne de commande est une étape essentielle.

Après avoir créé votre base de données et ses tables, utilisez la commande suivante pour ouvrir une interface en ligne de commande (CLI) avec votre base :

`sqlite3 chemin_vers_votre_BD`

#### Commandes Utiles:

- afficher les tables créées:

`.tables`

- Ecrire des requêtes:

`Select * from user;`

- Quitter l'interface SQLite:

 Appuyer deux fois `Ctrl + C`

## 3.3  Accéder à la BD depuis differents fichiers (dans le code)

1. Pour pouvoir acceder à la Base de Données depuis les differents fichiers surtout les routes qui doivent requêter votre BD, il est conseillé de créer un fichier qui contient le code de connexion à la BD . Dans ce projet c'est dbConnection.js

2. Exporter  l'instance db dans le fichier dbConnection.js: 

3. Maintennat chaque module qui necessite une connxion à la BD peut importer le fichier dbConnection.js pour avoir accés à l'instance db importée.

### Remarques:
* Chaque module important dbConnection.js aura la même instance db.

* Une logique centralisée (comme le fait d' avoir le code de la connexion à la BD dans un fichier) laisse votre code modulaire et maintenable facilement. 


# 4. Configuration des APIs
## 4.1 Organisation des fichiers des routes
Pour une meilleure visibilité et organisation, j'ai créé plusieurs fichiers dédiés aux routes dans le dossier routes. Cela permet de mieux structurer le projet et de garder une séparation claire entre les différentes fonctionnalités de l'application.

## 4.2 Test des APIs
Une fois vous configurez une API et la connexion à la base de données établie, vous devez la tester par postman. 
Verifiez toujours en parallèle dans vos bases de données si les l'objectif de l'API est bien réussi càd si l'ajout (POST), la supression (DELETE) ou la mise à jour (PUT) sont bien refletés, et si le reuêtage est correct (GET).

## 4.3 Gestion des erreurs dans vos API
Il faut toujours penser à la gestion des erreurs dans vos APIs, donc vos tests dans postman doivent couvrir toutes les possibilités pour verifier du bon fonctionnement global de vos APIs. 

# 5 Quelques remarques:

## 5.1 Organisation des routes
Pour une meilleure visibilité et organisation, j'ai créé plusieurs fichiers dédiés aux routes dans le dossier routes.
Vous Pouvez ecrire toutes les APIs dans le même fichier server.js mais pour une meilleur lisibilité et meilleur speration de code (ce qu'on appele modularité ), vous trouvez le fichier server.js qui importe les autres fichiers qui sont dans le repertoires routes.
Techniquement c'estla même chose d'ecrire les API l'une à la suite des autres dans un seul ficheier ou de creer des modules et d'imporeter ces modules dans un même fichier. La seule difference c'est la lisibilité et une bonne pratique de separation logique des API

## 5.2 variables de modules VS variables d'environement

#### Les variables de modules

- Les variables définies dans un module ne sont pas accessibles dans un autre module, sauf si vous les importez explicitement. Par exemple : si je déclare une variable un module, cette variable ne sera pas accessible dans un autre module **SAUF SI JE L'EXPORTE** depuis le fichier source et le load dans le module destination.

- Les variables modules comme db ne se propagent pas automatiquement entre les fichiers. 
Vous devez importer db  (ou autre variable) là où c'est nécessaire ==> C'est une approche propre et modulaire.

#### Les variables d'environnement

- En ce qui concerne les variables d'environnement stockées dans le fichier .env, une fois qu'elles sont chargées dans server.js, elles peuvent être utilisées dans tout le projet, dans les différents fichiers, sans avoir besoin de les recharger. Par example, regardez le fichier corsConfig.js qui appele les variables des URL Backend et frontend (const FRONTEND_URL = process.env.FRONTEND_URL ) avant de les appeler on a pas loader le fichier .env comme fait dans server.js

- Le fichier .env  ne doit pas être inclus dans le contrôle de version avec Github, car il contient souvent des informations sensibles comme des clés API ou de configurations.</br>
**Pourtant pour cet exercice je vais versionner le fichier pour que vous ayez accées**

## 5.3 Le fichier node_modules
On ignore le dossier node_modules dans le versionnement sur Github. Le répertoire node_modules doit être généré localement sur la machine de chaque développeur en exécutant le gestionnaire de paquets (npm) après le clonage du dépôt. 
Il faut juste executer la commande `npm install` sans preciser les paquets

#### Que se passe-t-il en coulisses ?
1. npm lit le fichier package.json pour obtenir la liste des dépendances de premier niveau.
2. Si un fichier package-lock.json existe, npm l'utilise pour résoudre les versions exactes des dépendances et sous-dépendances afin de garantir un environnement cohérent.
3. Il télécharge les paquets nécessaires depuis le registre npm et les place dans le répertoire node_modules.


# 6 L'invalidation du Token se fait côté client

Vous avez raison de souligner que la route /logout dans le code de authRoutes.js ne permet pas réellement d'invalider le jeton JWT côté serveur. Cela est dû au fait que les JWT (JSON Web Tokens) sont généralement sans état (stateless), ce qui signifie qu'ils ne doivent pas être stockés sur le serveur. Au lieu de cela, le jeton est transmis par le client et validé à chaque requête. Par conséquent, il n'est pas nécessaire d'"invalider" un JWT côté serveur comme cela se ferait avec un identifiant de session stocké dans une base de données ou dans un magasin de sessions côté serveur.

## Que fait la route /logout dans un système basé sur JWT ?

Dans la route /logout, l'idée est d'informer le client qu'il doit se débarrasser du jeton de son côté, ce qui revient à le déconnecter de son côté. C'est pourquoi on dit dans le message de réponse : "Veuillez supprimer le jeton côté client."

Cependant, étant donné que les JWT sont sans état et ne sont pas stockés sur le serveur, la seule façon d'"invalider" effectivement un JWT est de s'assurer que le client supprime le jeton de son stockage local, du stockage de session, des cookies ou de tout autre endroit où il est conservé.

## Comment rendre /logout plus efficace ?
Bien qu'il ne soit pas possible d'invalider réellement un JWT côté serveur, il existe quelques stratégies pour simuler le processus de déconnexion :

- __Suppression du jeton côté client__ : Lorsque l'utilisateur se déconnecte, il doit supprimer le jeton de son stockage local, du stockage de session ou des cookies (selon l'endroit où il est conservé). Cette action garantit que le client n'a plus de jeton à envoyer lors des requêtes suivantes.

- __Expiration du jeton (expiration intégrée)__ : Les JWT comportent déjà un temps d'expiration (par exemple, expiresIn: '1h' dans l'exemple). Une fois que le jeton a expiré, il n'est plus valide. Donc, si un utilisateur tente d'utiliser un jeton expiré après la déconnexion ou après un certain temps, le serveur le rejettera.

- __Utilisation d'une liste noire (facultatif)__ : Si vous souhaitez plus de contrôle sur l'invalidation du jeton, vous pouvez implémenter une liste noire de jetons. Lorsqu'un utilisateur se déconnecte, vous pouvez ajouter son JWT à cette liste noire (généralement stockée dans une base de données), que le serveur vérifiera avant de valider tout jeton.

Ainsi, même si le JWT n'est pas expiré, il sera considéré comme invalide s'il figure dans la liste noire. Cependant, cela introduit un état (stateful), ce qui va à l'encontre de la nature sans état des JWT, mais cela peut être une stratégie valide si nécessaire.

## Comment le client sait qu'il doit supprimer le token :

Le client (par exemple, un navigateur web ou une application mobile) doit avoir du code qui sait ce qu'il faut faire avec la réponse du serveur. Le client est responsable de la gestion de la suppression du token.
Lorsque le client se déconnecte, il doit explicitement supprimer le token stocké dans localStorage, sessionStorage ou les cookies dans son propre code, en fonction de l'action de déconnexion. Le serveur se contente de confirmer que l'action de déconnexion peut être effectuée.

Voici comment le client gère vraiment la suppression du token en réponse à une déconnexion réussie :

1. Code Frontend : Le client appelle la route /logout et, après avoir reçu un statut 200 OK, le client supprime le token de son stockage.
```Javascript
const logout = () => {
    // Make a POST request to the logout route
    fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // if you need the token for validation
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful. Please discard the token on the client side.') {
            // Remove the token from localStorage, sessionStorage, or cookie
            localStorage.removeItem('token'); // or sessionStorage.removeItem('token')
            console.log('Logged out successfully, token deleted.');
            window.location.href = '/login'; // Redirect user to login page
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
};
```

De même pour la route '/auth/me':
```Javascript
fetch('/auth/me', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // or sessionStorage.getItem('token')
    },
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
Si vous ne passez pas l'en-tête d'autorisation avec le jeton Bearer, le serveur ne pourra pas vérifier le jeton

2. Code Serveur (Logout) :
Le serveur répond avec un statut 200 OK et un message, confirmant simplement la demande de déconnexion.
Il ne fait rien avec le token lui-même (puisque l'authentification est stateless), mais il sert de signal pour que le client supprime le token.

```Javascript
router.post('/logout', (req, res) => {
    // Pas d'invalidation du token côté serveur, juste informer le client de le supprimer
    res.status(200).json({ message: 'Logout successful. Please discard the token on the client side.' });
});
```

### Points clés :
- Les jetons JWT sont sans état, ce qui signifie que le serveur n'a pas besoin de les stocker. Vous ne pouvez pas "invalider" techniquement un JWT sur le serveur après son émission.
- La route /logout n'a pas besoin d'effectuer d'opérations côté serveur pour invalider le jeton. C'est le client qui doit supprimer le jeton de l'endroit où il est stocké.
- Vous pouvez ajouter une expiration du jeton pour qu'il devienne automatiquement invalide après une certaine période.
- Si une invalidation plus immédiate est nécessaire (par exemple, un utilisateur se déconnecte et vous voulez invalider son jeton immédiatement), vous pouvez implémenter une liste noire côté serveur, bien que cela introduise plus de complexité.

# Comment tester les Token et que le authentication Middleware fonctionne?
Definissez une route qui necessite de l'authentification avant redirection comme la route auth/me que vous trouvez dans le fichier authRoutes.js. elle prend en second argument le middleware qui va s'executer en premier avant de passer au code de auth/me.

## Alors comment tester les token sans un frontend et à partir de Postman?

### Depuis Postman:
- Generer un Token à travers la route du login (en choisissant un username/password qui existe dans la BD)
![alt text](images/Generate%20aToken.png)

- Ovrez un nouveau onglet dans postman sans fermer celui su login a. 
Executez la Get de la route auth/me route en precisant dans le header la combinaison Key/Value ainsi:
    - key : authorization
    - value : Bearer <followed by the token>

![alt text](images/Testing%20the%20token.png)

Si le token est correct et que vous n'avez pas depasser la durée de vie du token **à voir dans le code du login** (dans ce code c'est une heure), ça doit retourner l'id et le username de l'utilisateur connecté!


# Démarrage

L'A.P.I est écrite en [Typescript](https://www.typescriptlang.org/) et est basée sur la
plateforme [Node.js](https://nodejs.org). Elle utilise le framework de developpement [NestJs](https://nestjs.com).
Une base de donnée Postgresql est nécessaire au stockage des données.


> [!TIP]
> Le projet inclus un fichier `docker-compose.yml` prêt à l'emploi.

## Prérequis

**Node.js** doit être installé sur votre poste. Pour plus d'information consultez la documentation depuis le site
de [Node.js](https://nodejs.org)

## Installation et démarrage

Pour installer le projet, il suffit d'exécuter la commande suivante dans votre terminal :

```bash
npm install
```

Une fois le projet et ses dépendances installées, copiez et renommez le fichier `env.example` en `.env`. Ce fichier vous
permet
de définir l'ensemble des variables d'environnement propre à votre configuration.
Dans le cas de l'utilisation de **Docker**, certaines variables sont directement réutilisées dans le
fichier `docker-compose.yml`, comme
le nom ou l'utilisateur de la base de donnée.

Une fois le fichier `.env` renseigné, vous pouvez démarrer l'application via docker ou en exécutant la commande :

```bash
# development mode
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

> [!WARNING]
> Dans le cas de l'utilisation de l'A.P.I. de FranceTravail comme source de donnée d'entreprise, une étape d'ajout
> de donnée dans la base de donnée est nécessaire. Pour en savoir plus, cliquez sur ce [lien](france-travail.md).

## Utilisation de docker

Le fichier `docker-compose.yml` contient en ensemble de service utile au fonctionnement de l'application. Pour pouvoir
utiliser ce fichier,
vous devrez au préalable installer et configurer [Docker desktop](https://docs.docker.com/compose/install/) sur votre
poste. Une fois installé et docker démarré,
lancer la commande suivante :

```bash
docker compose up
```

Docker se chargera de créer une image de l'application et lancera automatiquement l'application en mode `watch`.

Pour démarrer ou arrêter les services, utilisez les commandes suivantes :

```bash
# Start docker-compose.yml services
docker compose up

# Stop docker-compose.yml services
docker compose down
```

Cliquez [ici](https://docs.docker.com/compose/) pour accéder à la documentation de docker.

#### Troubleshooting

Dans le cas de l'utilisation de docker, une erreur peut être émise par le service PG Admin.

````
pg-admin_1  | Traceback (most recent call last):
pg-admin_1  |   File "/usr/local/lib/python3.8/site-packages/flask/app.py", line 1811, in full_dispatch_request
pg-admin_1  |     rv = self.preprocess_request()
pg-admin_1  |   File "/usr/local/lib/python3.8/site-packages/flask/app.py", line 2087, in preprocess_request
pg-admin_1  |     rv = func()
pg-admin_1  |   File "/usr/local/lib/python3.8/site-packages/flask_wtf/csrf.py", line 224, in csrf_protect
pg-admin_1  |     self.protect()
pg-admin_1  |   File "/usr/local/lib/python3.8/site-packages/flask_wtf/csrf.py", line 259, in protect
pg-admin_1  |     self._error_response(e.args[0])
pg-admin_1  |   File "/usr/local/lib/python3.8/site-packages/flask_wtf/csrf.py", line 302, in _error_response
pg-admin_1  |     raise CSRFError(reason)
pg-admin_1  | flask_wtf.csrf.CSRFError: 400 Bad Request: The CSRF session token is missing.
````

Pour résoudre cette erreur, assurer vous d'avoir fermé les onglets pgAdmin de votre navigateur avant de démarrer les
services docker.
[Source](https://stackoverflow.com/questions/64394628/csrf-token-is-missing-error-in-docker-pgadmin)
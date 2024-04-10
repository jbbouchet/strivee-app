# `AggregatorSource` FranceTravail.io

## Avant de commencer :

#### Identifier notre application auprès de la plateforme francetravail.io :

L'`AggregatorSource` FranceTravail repose sur l'A.P.I "La bonne boite" (V1) disponible à cette
adresse : https://francetravail.io/data/api/bonne-boite.
Les requêtes à cette A.P.I nécessitent une authentification préalable, il faudra
donc en amont [créer un compte](https://francetravail.io/data/documentation/gestion-compte-applications) et une
application sur la plateforme. Après avoir créé votre application et récupéré son identifiant et le secret,
renseignez les variables dans votre fichier `.env` à la racine du projet.

```dotenv
# L'identifiant de votre application
FRANCE_TRAVAIL_CLIENT_ID=''

# Le secret fournit lors de la creation de votre application sur la plateforme francetravail.io
FRANCE_TRAVAIL_CLIENT_SECRET=''
```

#### Préparer nos jeux de données utiles pour nos requêtes :

Les requêtes à l'A.P.I *La bonne boite* se basent sur deux paramètres pour fournir la liste des entreprises qui sont
susceptibles de recruter au cours des 6 prochains mois.
Le premier paramètre est le `commune_id`, numéro unique basé sur la
nomenclature de l'INSEE [disponible ici]( https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/). Le
second est le`rome_code`, numéro
du [Répertoire Opérationnel des Métiers et des Emplois ](https://www.data.gouv.fr/fr/datasets/repertoire-operationnel-des-metiers-et-des-emplois-rome/).

Ces deux jeux de données peuvent être directement intégrés à notre application, en les rendant accessible depuis notre
base de donnée.
Pour remplir notre base avec ces jeux de données, exécuter la commande suivante :

```bash
ts-node -r tsconfig-paths/register ./src/populate-db.ts
```
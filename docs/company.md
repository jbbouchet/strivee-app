# Aggrégation des entreprises

## Récupérer la liste des entreprises `[GET] /company`

> [!TIP]
> Vous pouvez tester directement l'application en utilisant le Swagger disponible dans le projet, consultable à
> l'adresse **http://`<domain-de-lapi:port>`/swagger** Veillez à ce que l'application soit démarrée pour pouvoir y
> accéder.

#### Paramètre d'entrée :

| Nom          |   type   | description                                           | Requis |
|--------------|:--------:|:------------------------------------------------------|:------:|
| `job`        | `string` | le nom ou type de poste recherché.                    |  `x`   |
| `postalCode` | `string` | code postal près duquel la recherche doit s'effectuer |        |
| `locality`   | `string` | La ville près duquel la recherche doit s'effectuer    |        |

**Attention**: *Un code postal ou une ville est requis à minima pour effectuer la recherche. Pour plus de précision
dans la recherche, la combinaison des deux est vivement conseillée.*

#### Résultat :

| Nom              |         type          | description                                                                      |
|------------------|:---------------------:|:---------------------------------------------------------------------------------|
| `success`        |       `boolean`       | `true` si la requête s'est effectuée avec succès. `false` dans le cas contraire. |
| `companies`      | `RecruitingCompany[]` | Liste des entreprises répondant à la recherche, triée par score de potentiel.    |
| `availableToken` |       `number`        | Nombre de jetons restants.                                                       |
| `message?`       |       `string`        | Informations complémentaires lorsque la requête n'aboutit pas.                   |

#### Troubleshooting :

Des métiers dont la nomenclature ROME est récente n'ont pas encore été totalement intégrés à l'A.P.I. *La bonne boite*
de France
Travail. Il est donc conseillé de rechercher des métiers peu ambigus tel que :

- Vendeur
- Serveur
- Secrétaire
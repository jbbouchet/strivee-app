# Limite d'utilisation de l'A.P.I.

L'utilisation de l'A.P.I. est limitée. Chaque appel diminuera le solde de jeton disponible jusqu'à épuisement de
celui-ci.
*Dans cette version de l'A.P.I., dans le cas où la requête n'aboutit pas, le solde reste inchangé.*

## Compte `Account`

Un `Account` est la représentation d'une entité qui effectue une requête dans notre système. Il peut représenter un
utilisateur,
une application tiers, ou tout autre élément qui est en mesure d'effectuer un appel à notre A.P.I. et qui peut être
identifier au sein de notre application.

> [!TIP]
> Dans cette version de notre A.P.I. l'unicité du compte se base sur l'adresse IP qui effectue la requête.

## Limiter les interactions

Pour interagir avec le solde de jeton disponible pour un `Account`, il est possible d'utiliser le
service `TokenRateLimiter`.
Ce service permet de vérifier si le compte (`Account`) à des jetons, de connaitre son solde disponible, ou encore de
diminuer le solde
d'un nombre `n` de jeton.

> [!TIP]
> Ce service est une abstraction et son implementation actuelle pour ce test, utilise la
> class `InMemoryTokenRateLimiter` qui stock
> le solde des jetons de chaque compte en mémoire. Chaque redémarrage de l'A.P.I. réinitialisera donc le solde
> disponible.
> Il est admis qu'une version avec un stockage persistant des données devrait être mise en oeuvre pour une version de "
> production".

## Définir une limite

Par défaut, la limite est définie à 500 jetons, non renouvelable.
Pour changer le nombre de jetons par défaut, modifier la valeur depuis le fichier d'environnement :

```dotenv
# The default count of the token available by default for each account.
TOKEN_RATE_LIMIT_DEFAULT_COUNT=100
```
# Limite d'utilisation de l'A.P.I.

L'utilisation de l'A.P.I. est limité. Chaque appel diminuera le solde de jeton disponible jusqu'à épuisement.
Dans le cas où la requête n'aboutit pas, le solde reste inchangé.

## Compte `Account`

Un `Account` est la représentation d'une entité qui effectue une requête dans notre système. Cela peut représenter un
utilisateur,
une application tiers, ou tout autre élément qui est en mesure d'effectuer un appel à notre A.P.I. et qui peut être
identifier au sein de notre application.

> [!TIP]
> Dans cet version de notre A.P.I. l'unicité du compte se base sur l'adresse IP qui effectue la requête.

## Limiter les interactions

Pour interagir avec le solde de jeton disponible pour un `Account`, il est possible d'utiliser le
service `TokenRateLimiter`.
Ce service permet de connaitre le solde de jeton disponible, de vérifier si le compte à des jetons, ou diminuer le solde
d'un nombre `n` de jeton.

> [!TIP]
> Ce service est une abstraction et son implementation actuelle, pour ce test npm; utilise la
> class `InMemoryTokenRateLimiter` qui stock
> le solde des jetons de chaque compte en mémoire. Chaque redémarrage de l'A.P.I. réinitialisera donc le solde
> disponible.

## Définir une limite

Par défaut, la limite est défini à 500 jetons non renouvelable.
Pour changer le nombre de jetons par défaut, modifier la valeur dans le fichier d'environnement :

```dotenv
# The default count of the token available by default for each account.
TOKEN_RATE_LIMIT_DEFAULT_COUNT=100
```
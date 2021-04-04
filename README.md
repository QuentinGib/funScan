# FunScan

Ce projet est un site web développé par Quentin GIBON et Lucas LEVY permettant de visualiser et interagir avec 2 NFTs. Il est accessible à l'adresse [https://funscan.herokuapp.com/](https://funscan.herokuapp.com/) (pensez à activer votre wallet provider). L'application est développée en React.js et utilise la librairie web3.js.

Les NFTs concernés sont :
- Song for a City ( 0x004a84209a0021b8ff182ffd8bb874c53f65e90e on Rinkeby )
- Tout Doucement (0x89150a0325ecc830a2304a44de98551051b4f466 on Rinkeby )

## Fonctions implémentées

- Affichage de votre numéro de compte
- Le chain ID
- Le dernier block

A propos du NFT "Song for a city"
- Le nombre total de tokens
- Le nom du token
- Affichage de ses métadonnées

Un bouton permet de demander un token "Song for a city".
Un bouton permet d'acheter un token "tout doucement" pour 0.2 ETH.

Sont ensuite affichés le nombre et les IDs des tokens que vous possédez pour chacun des deux NFTs.

Vous avez également la possibilité de transférer un de vos token "Song for a city" ou "tout doucement" à une autre adresse, en renseignant l'ID du token que vous voulez envoyer.

Enfin sont affichées les adresses des propriétaires de tokens des deux NFTs.

En renseignant une adresse ethereum dans l'url du site (ex : `https://funscan.herokuapp.com/=0x8067c1F2E8ec7FD00C08Ff0FbedAF185cbd8ca0A`) il est également possible d'afficher toutes ces informations à propos de cette adresse.

La requête pour récupérer les informations sur le token song for a city ne fonctionnera qu'après avoir cliqué sur le bouton sur ce lien https://funscan.herokuapp.com/ . Sur heroku l'image ne s'affiche pas mais en local tout fonctionne.

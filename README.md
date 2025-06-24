# CLI-ToDo

Test technique pour recrutement sur un poste back-end. Création d'une to-do list en CLI avec connexions multiples simultanées. Serveur Node.js, BDD MongoDB.

## Lancer le projet

Prérequis : avoir un serveur MongoDB installé et en cours d'exécution.

1. Installer les dépendances : `npm install`
1. Créer le fichier .env (`cp .env.example .env`) et modifier l'URL de la BDD MongoDB si besoin.
1. (facultatif) Test de connexion à la base de données : `npm run db:test`
1. (facultatif) Peupler la BDD : `npm run db:seed`
1. Lancer le serveur : `npm run server:start`
1. Lancer le client dans un autre terminal : `npm run client:start`
1. Interagir avec la liste des tâches
1. (facultatif) Lancer d'autres instances du client pour tester le broadcast

## Fonctionnement de l'interface

- `help` : lister les commandes disponibles
- `list` : lister toutes les tâches
- `add <description>` : ajouter une tâche
- `complete <id>` : marquer une tâche comme terminée
- `delete <id>` : supprimer une tâche
- `quit`, `q`, `exit` : fermer la connexion client

# CLI-ToDo

Test technique pour recrutement sur un poste back-end. Création d'une to-do list en CLI avec connexions multiples simultanées. Serveur Node.js, BDD MongoDB.

## Configuration

Prérequis: avoir un serveur MongoDB installé et en cours d'exécution.

Installer le projet (`npm i`)

Copier le fichier .env (`cp .env.example .env`) et modifier l'URL de la BDD MongoDB si besoin.

## Base de données

### Test de connexion à la base de données

Exécuter `npm run db:test` pour vérifier la connexion à la BDD

### Seeding BDD

Exécuter `npm run db:seed` pour alimenter la BDD avec quelques tâches

## Lancer le serveur

1. Lancer le projet (`npm run server:start`)
2. Lancer un ou plusieurs clients depuis d'autres terminaux (`npm run client:start`)

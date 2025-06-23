import { createConnection } from 'node:net';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const PORT = process.env.PORT || 3000;
const rl = readline.createInterface({ input, output });

const client = createConnection({ port: PORT }, () => {
  console.log(`Client connecté au serveur sur le port ${PORT}`);
  client.write('{"action":"list"}\n'); // Affichage des tâches existantes à l'ouverture
});

client.on('data', (data) => {
  const response = JSON.parse(data.toString());
  // console.log('Réponse du serveur :', response);
  if (response.status === 'success') {
    if (response.action === 'list') {
      console.log('Liste des tâches :');
      console.table(response.tasks);
    } else {
      console.log(response.message);
    }
  } else {
    console.log('Erreur : ' + response.message);
  }

  if (response.action === 'quit') {
    client.end();
    rl.close();
    return;
  }

  prompt();
});

client.on('end', () => {
  console.log('\nDéconnecté du serveur');
});

function showHelp() {
  console.log(`
  Commandes disponibles :
    list                      ➜ Lister toutes les tâches
    add <description>         ➜ Ajouter une tâche
    complete <id>             ➜ Marquer une tâche comme complétée
    delete <id>               ➜ Supprimer une tâche
    quit                      ➜ Fermer la session
  `);
}

// Affichage des commandes pour l'utilisateur
async function prompt() {
  showHelp();
  const line = await rl.question('choix : ');
  const [command, ...args] = line.trim().split(' ');

  switch (command) {
    case 'list':
      client.write(JSON.stringify({ action: 'list' }) + '\n');
      break;

    case 'add':
      client.write(
        JSON.stringify({ action: 'add', description: args.join(' ') }) + '\n'
      );
      break;

    case 'complete':
      client.write(JSON.stringify({ action: 'complete', id: args[0] }) + '\n');
      break;

    case 'delete':
      client.write(JSON.stringify({ action: 'delete', id: args[0] }) + '\n');
      break;

    case 'quit':
    case 'q':
    case 'exit':
      client.write(JSON.stringify({ action: 'quit' }) + '\n');
      break;

    default:
      console.log('Commande inexistante');
      prompt();
  }
}

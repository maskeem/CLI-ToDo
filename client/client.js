import { createConnection } from 'node:net';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { displayTasks, showHelp } from './utils.js';

const PORT = process.env.PORT || 3000;
console.log(PORT);
const rl = readline.createInterface({ input, output });

const client = createConnection({ port: PORT }, () => {
  console.log(`Client connecté au serveur sur le port ${PORT}`);
  client.write('{"action":"list"}\n'); // Affichage des tâches existantes à l'ouverture
});

client.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    handleResponse(response);
  } catch (err) {
    console.log('Erreur : réponse JSON attendue', err);
  }
  prompt();
});

client.on('end', () => {
  console.log('\nDéconnecté du serveur');
  rl.close();
  process.exit(0);
});

// Affichage des commandes pour l'utilisateur
async function prompt() {
  showHelp();
  const line = await rl.question('Entrer une commande : ');
  const [command, ...args] = line.trim().split(' ');

  switch (command) {
    case 'list':
      send('list');
      break;

    case 'add':
      send('add', { description: args.join(' ') });
      break;

    case 'complete':
      send('complete', { id: args[0] });
      break;

    case 'delete':
      send('delete', { id: args[0] });
      break;

    case 'quit':
    case 'q':
    case 'exit':
      send('quit');
      break;

    default:
      console.log('Commande inexistante');
      prompt();
  }
}

function send(action, payload = {}) {
  client.write(JSON.stringify({ action, ...payload }) + '\n');
}

function handleResponse(response) {
  if (response.status === 'success') {
    if (response.action === 'list') {
      displayTasks(response.tasks);
    } else {
      console.log(response.message);
    }
    if (response.action === 'quit') {
      client.end();
      rl.close();
      process.exit(0);
    }
  } else {
    console.log('Erreur : ' + response.message);
  }
}

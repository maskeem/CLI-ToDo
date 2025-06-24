import { createServer } from 'node:net';
import { connectToDb } from '../database/db.js';
import {
  listTasks,
  addTask,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';
import { registerClient, unregisterClient } from './clientManager.js';
const PORT = process.env.PORT || 3000;

const server = createServer((socket) => {
  console.log('Client connecté');

  socket.on('data', async (data) => {
    const raw = data.toString().trim();
    let command;

    // vérification du format de réponse
    try {
      command = JSON.parse(raw);
    } catch (err) {
      const errorResponse = {
        status: 'error',
        message: 'Format JSON invalide',
      };
      socket.write(JSON.stringify(errorResponse) + '\n');

      // socket.write('Format JSON invalide\n');
      console.log(
        `Erreur : le message reçu n'est pas au format JSON\nError message: ${err.message}`
      );
      return;
    }

    const action = command.action;
    if (action === 'list') return listTasks(command, socket);
    if (action === 'add') return addTask(command, socket);
    if (action === 'complete') return completeTask(command, socket);
    if (action === 'delete') return deleteTask(command, socket);

    // Fermer la session
    if (action === 'quit') {
      console.log('<<< Client demande fermeture connexion');
      const response = {
        status: 'success',
        action,
        message: 'fermeture de la session',
      };
      socket.write(JSON.stringify(response) + '\n');
      socket.end();
      return;
    }

    console.log('<<< Demande client non comprise');
    const errorResponse = {
      status: 'error',
      action,
      message: 'Action inconnue',
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
  });

  socket.on('end', () => {
    console.log('Client déconnecté');
    unregisterClient(socket);
  });
});

server.on('connection', (socket) => {
  registerClient(socket);
});

async function main() {
  // Connexion à la BDD
  await connectToDb();

  server.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Erreur au lancement du serveur : ', err);
});

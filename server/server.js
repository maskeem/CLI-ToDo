import { createServer } from 'net';
import { connectToDb, getTasksCollection } from '../database/db.js';
import { ObjectId } from 'mongodb';
import {
  listTasks,
  addTask,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';
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
      console.log(
        `Erreur : le message reçu n'est pas au format JSON\nError message: « ${err.message} »`
      );
      socket.write('Format JSON invalide\n');
      return;
    }

    const action = command.action;

    if (action === 'list') return listTasks(command, socket);

    if (action === 'add') return addTask(command, socket);

    if (action === 'complete') return completeTask(command, socket);

    if (action === 'delete') return deleteTask(command, socket);

    // Fermer la session
    if (action === 'quit') {
      console.log('Client demande fermeture connexion');

      const response = {
        status: 'success',
        action,
        message: 'fermeture de la session',
      };
      socket.write(JSON.stringify(response) + '\n');
      socket.end();
      return;
    }

    console.log('Demande client non comprise');
    socket.write('Action inconnue\n');
  });

  socket.on('end', () => {
    console.log('Client déconnecté');
  });
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

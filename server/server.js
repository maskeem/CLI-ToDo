import { createServer } from 'net';
import { connectToDb, getTasksCollection } from '../database/db.js';
import { ObjectId } from 'mongodb';
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

    // Lister les tâches
    if (action === 'list') {
      console.log('Client demande la liste des tâches');

      try {
        const tasks = getTasksCollection();
        const allTasks = await tasks.find().toArray();
        const response = {
          status: 'success',
          action,
          tasks: allTasks.map((task) => ({
            id: task._id.toString(),
            description: task.description,
            completed: task.completed,
          })),
        };

        console.log('Liste des tâches envoyée au client :\n');
        console.table(response.tasks);
        socket.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const errorResponse = {
          status: 'error',
          action,
          message: "Erreur serveur lors de l'accès aux tâches",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
      }
      return;
    }

    // Ajouter une tâche
    if (action === 'add') {
      if (
        typeof command.description !== 'string' ||
        command.description.trim() === ''
      ) {
        const errorResponse = {
          status: 'error',
          action,
          message:
            "Le champ 'description' est requis et doit être une chaîne non vide",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        return;
      }
      const taskDescription = command.description;
      console.log(`Client demande création d'une tâche : ${taskDescription}`);

      try {
        // Accès à la collection et récupération des tâches en BDD
        const tasks = getTasksCollection();
        const result = await tasks.insertOne({
          description: taskDescription,
          completed: false,
          createdAt: new Date(),
        });

        const response = {
          status: 'success',
          action,
          message: `Tâche ajoutée avec succès`,
          id: result.insertedId.toString(),
        };
        socket.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const errorResponse = {
          status: 'error',
          action,
          message: "Erreur serveur lors de l'ajout de la tâche",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
      }
      return;
    }

    // Marquer une tâche comme terminée
    if (action === 'complete') {
      const taskId = command.id;

      if (typeof taskId !== 'string' || !taskId.trim()) {
        const errorResponse = {
          status: 'error',
          action,
          message: "Le champ 'id' est requis et doit être une chaîne non vide",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        return;
      }
      console.log(`Client demande complétion de la tâche : ${taskId}`);

      try {
        // Accès à la collection et modification de la tâche en BDD
        const tasks = getTasksCollection();
        const result = await tasks.updateOne(
          {
            _id: new ObjectId(taskId),
          },
          { $set: { completed: true } }
        );

        if (result.modifiedCount === 0) {
          const errorResponse = {
            status: 'error',
            action,
            message: `Aucune tâche non validée trouvée avec l'ID ${taskId}`,
          };
          socket.write(JSON.stringify(errorResponse) + '\n');
        } else {
          const response = {
            status: 'success',
            action,
            message: `Tâche ${taskId} complétée avec succès`,
          };
          socket.write(JSON.stringify(response) + '\n');
        }
      } catch (err) {
        const errorResponse = {
          status: 'error',
          action,
          message: 'ID invalide ou erreur serveur',
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        console.log('Error message : ' + err);
      }
      return;
    }

    // Supprimer une tâche
    if (action === 'delete') {
      const taskId = command.id;

      if (typeof taskId !== 'string' || !taskId.trim()) {
        const errorResponse = {
          status: 'error',
          action,
          message: "Le champ 'id' est requis et doit être une chaîne non vide",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        return;
      }
      console.log(`Client demande suppression de la tâche : ${taskId}`);

      try {
        const tasks = getTasksCollection();
        const result = await tasks.deleteOne({
          _id: new ObjectId(taskId),
        });

        if (result.deletedCount === 0) {
          const errorResponse = {
            status: 'error',
            action,
            message: `Aucune tâche trouvée avec l'ID ${taskId}`,
          };
          socket.write(JSON.stringify(errorResponse) + '\n');
        } else {
          const response = {
            status: 'success',
            action,
            message: `Tâche ${taskId} supprimée avec succès`,
          };
          socket.write(JSON.stringify(response) + '\n');
        }
      } catch (err) {
        const errorResponse = {
          status: 'error',
          action,
          message: 'ID invalide ou erreur serveur',
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
      }
      return;
    }

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

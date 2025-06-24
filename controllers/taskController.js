import { ObjectId } from 'mongodb';
import { getTasksCollection } from '../database/db.js';
import { broadcast } from '../server/server.js';

// Lister les tâches
export async function listTasks(command, socket) {
  console.log('<<< Client demande la liste des tâches');

  try {
    const tasks = getTasksCollection();
    const allTasks = await tasks.find().toArray();

    const response = {
      status: 'success',
      action: command.action,
      tasks: allTasks.map((task) => ({
        id: task._id.toString(),
        description: task.description,
        completed: task.completed,
      })),
    };

    socket.write(JSON.stringify(response) + '\n');
    // broadcast(
    //   {
    //     status: 'update',
    //     action: command.action,
    //     message: `Liste des tâches demandée par un autre client`,
    //   },
    //   socket
    // );

    console.log('>>> Liste des tâches envoyée au client :');
    console.table(response.tasks);
  } catch (err) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: "Erreur serveur lors de l'accès aux tâches\n",
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log('>>> Error message : ' + err);
  }
  return;
}

// Ajouter une tâche
export async function addTask(command, socket) {
  const taskDescription = command.description;

  if (typeof taskDescription !== 'string' || !taskDescription.trim()) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message:
        "Le champ 'description' est requis et doit être une chaîne non vide\n",
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log('>>> Erreur de description de la tâche');
    return;
  }
  console.log(`<<< Client demande création d'une tâche : ${taskDescription}`);

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
      action: command.action,
      message: `Tâche ajoutée avec succès\n`,
      id: result.insertedId.toString(),
    };

    socket.write(JSON.stringify(response) + '\n');
    broadcast(
      {
        status: 'update',
        action: command.action,
        message: `Nouvelle tâche créée par un autre client : « ${taskDescription} »\n`,
      },
      socket
    );
    console.log(`>>> Tâche ${response.id} créée : « ${taskDescription} »`);
  } catch (err) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: "Erreur serveur lors de l'ajout de la tâche\n",
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log('>>> Error message : ' + err);
  }
  return;
}

// Marquer une tâche comme terminée
export async function completeTask(command, socket) {
  const taskId = command.id;

  if (typeof taskId !== 'string' || !taskId.trim()) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: "Le champ 'id' est requis et doit être une chaîne non vide\n",
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log(">>> Erreur de l'ID de la tâche");
    return;
  }
  console.log(`<<< Client demande complétion de la tâche : ${taskId}`);

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
        action: command.action,
        message: `Aucune tâche non terminée trouvée avec l'ID ${taskId}\n`,
      };
      socket.write(JSON.stringify(errorResponse) + '\n');
      console.log(`>>> Tâche ${taskId} non trouvée ou terminée`);
    } else {
      const response = {
        status: 'success',
        action: command.action,
        message: `Tâche ${taskId} terminée avec succès\n`,
      };

      socket.write(JSON.stringify(response) + '\n');
      broadcast(
        {
          status: 'update',
          action: command.action,
          message: `Tâche ${taskId} terminée par un autre client\n`,
        },
        socket
      );
      console.log(`>>> Tâche ${taskId} terminée`);
    }
  } catch (err) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: 'ID invalide ou erreur serveur\n',
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log('>>> Error message : ' + err);
  }
  return;
}

// Supprimer une tâche
export async function deleteTask(command, socket) {
  const taskId = command.id;

  if (typeof taskId !== 'string' || !taskId.trim()) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: "Le champ 'id' est requis et doit être une chaîne non vide\n",
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log(">>> Erreur de l'ID de la tâche");
    return;
  }
  console.log(`<<< Client demande suppression de la tâche : ${taskId}`);

  try {
    const tasks = getTasksCollection();
    const result = await tasks.deleteOne({
      _id: new ObjectId(taskId),
    });

    if (result.deletedCount === 0) {
      const errorResponse = {
        status: 'error',
        action: command.action,
        message: `Aucune tâche trouvée avec l'ID ${taskId}\n`,
      };
      socket.write(JSON.stringify(errorResponse) + '\n');
      console.log(`>>> Tâche ${taskId} non trouvée`);
    } else {
      const response = {
        status: 'success',
        action: command.action,
        message: `Tâche ${taskId} supprimée avec succès\n`,
      };

      socket.write(JSON.stringify(response) + '\n');
      broadcast(
        {
          status: 'update',
          action: command.action,
          message: `Tâche ${taskId} supprimée par un autre client\n`,
        },
        socket
      );
      console.log(`>>> Tâche ${taskId} supprimée`);
    }
  } catch (err) {
    const errorResponse = {
      status: 'error',
      action: command.action,
      message: 'ID invalide ou erreur serveur\n',
    };
    socket.write(JSON.stringify(errorResponse) + '\n');
    console.log('>>> Error message : ' + err);
  }
  return;
}

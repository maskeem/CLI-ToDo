import { createServer } from 'net';
const PORT = process.env.PORT || 3000;

const server = createServer((socket) => {
  console.log('Client connecté');

  socket.on('data', (data) => {
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
      socket.write('Voici la liste des tâches\n');
      const response = {
        status: 'success',
        action,
        message: 'Voici la liste des tâches simulée',
      };
      socket.write(JSON.stringify(response) + '\n');
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

      const response = {
        status: 'success',
        action,
        message: 'Tâche ajoutée avec succès',
      };
      socket.write(JSON.stringify(response) + '\n');
      return;
    }

    // Marquer une tâche comme terminée
    if (action === 'complete') {
      if (typeof command.id !== 'string' || command.id.trim() === '') {
        const errorResponse = {
          status: 'error',
          action,
          message: "Le champ 'id' est requis et doit être une chaîne non vide",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        return;
      }
      const taskId = command.id;
      console.log(`Client demande complétion de la tâche : ${taskId}`);

      const response = {
        status: 'success',
        action,
        message: `Tâche ${taskId} complétée avec succès`,
      };
      socket.write(JSON.stringify(response) + '\n');
      return;
    }

    // Supprimer une tâche
    if (action === 'delete') {
      if (typeof command.id !== 'string' || command.id.trim() === '') {
        const errorResponse = {
          status: 'error',
          action,
          message: "Le champ 'id' est requis et doit être une chaîne non vide",
        };
        socket.write(JSON.stringify(errorResponse) + '\n');
        return;
      }
      const taskId = command.id;
      console.log(`Client demande suppression de la tâche : ${taskId}`);

      const response = {
        status: 'success',
        action,
        message: `Tâche ${taskId} supprimée avec succès`,
      };
      socket.write(JSON.stringify(response) + '\n');
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

server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

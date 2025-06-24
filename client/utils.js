export function showHelp() {
  console.log(`
Commandes disponibles :
  help                      ➜ Afficher cette aide
  list                      ➜ Lister toutes les tâches
  add <description>         ➜ Ajouter une tâche
  complete <id>             ➜ Marquer une tâche comme terminée
  delete <id>               ➜ Supprimer une tâche
  quit                      ➜ Fermer la session
  `);
}

export function displayTasks(tasks) {
  console.log('\nListe des tâches :');
  // console.table(tasks);

  if (tasks.length === 0) {
    console.log(
      "Aucune tâche pour le moment. Ajoutez-en une avec 'add <description>'"
    );
  }

  for (const task of tasks) {
    const status = task.completed ? '[X]' : '[ ]';
    console.log(`${status} ${task.description}\t\t(id: ${task.id})`);
  }
  console.log();
}

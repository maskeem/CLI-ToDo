import chalk from 'chalk';

export function showHelp() {
  console.log(chalk.bold.magenta(`Commandes disponibles :`));
  console.log(`  help                      ➜ Afficher cette aide
  list                      ➜ Lister toutes les tâches
  add <description>         ➜ Ajouter une tâche
  complete <id>             ➜ Marquer une tâche comme terminée
  delete <id>               ➜ Supprimer une tâche
  quit                      ➜ Fermer la session
  `);
}

export function displayTasks(tasks) {
  console.log(chalk.bold.magenta('\nListe des tâches :'));

  if (tasks.length === 0) {
    console.log(
      chalk.yellow(
        "Aucune tâche pour le moment. Ajoutez-en une avec 'add <description>'"
      )
    );
  }

  for (const task of tasks) {
    const status = task.completed ? chalk.green('[X]') : chalk.white('[ ]');
    const description = task.completed
      ? chalk.gray.strikethrough(task.description)
      : chalk.white(task.description);
    const id = chalk.dim(`(id: ${task.id})`);

    console.log(`${status} ${description}\t\t${id}`);
  }
  console.log();
}

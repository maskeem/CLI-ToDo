import { connectToDb, getTasksCollection } from '../db.js';

const tasks = [
  { description: 'Postuler chez Zaion', completed: true },
  { description: "Passer l'entretien", completed: true },
  { description: 'Réussir le test technique', completed: false },
  { description: 'Commencer mon alternance chez Zaion', completed: false },
];

async function seed() {
  await connectToDb();
  const collection = getTasksCollection();

  // Vide la collection
  await collection.deleteMany({});

  // Insère les nouvelles tâches
  const result = await collection.insertMany(
    tasks.map((task) => ({ ...task, createdAt: new Date() }))
  );

  console.log(`${result.insertedCount} tâches insérées`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erreur lors du seed :', err);
  process.exit(1);
});

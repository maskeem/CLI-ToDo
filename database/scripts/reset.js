import { connectToDb, getTasksCollection } from '../db.js';

async function reset() {
  await connectToDb();
  const collection = getTasksCollection();

  // Vide la collection
  const result = await collection.deleteMany({});

  console.log(`${result.deletedCount} tâches supprimées`);
  process.exit(0);
}

reset().catch((err) => {
  console.error('Erreur lors du reset :', err);
  process.exit(1);
});

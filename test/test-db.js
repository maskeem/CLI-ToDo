import { connectToDb, getTasksCollection } from '../database/db.js';

async function dbTest() {
  await connectToDb();

  const tasks = getTasksCollection();

  const result = await tasks.insertOne({
    description: 'Test insertion de tâche',
    completed: false,
    createdAt: new Date(),
  });
  console.log(`Tâche ID : ${result.insertedId} insérée`);

  const allTasks = await tasks.find().toArray();
  console.log('Toutes les tâches : ', allTasks);
}

dbTest().catch(console.error);

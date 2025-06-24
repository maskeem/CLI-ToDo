import { ObjectId } from 'mongodb';
import { connectToDb, getTasksCollection } from '../database/db.js';

async function dbTest() {
  await connectToDb();

  const tasks = getTasksCollection();

  const result = await tasks.insertOne({
    description: 'Test insertion de tâche',
    completed: false,
    createdAt: new Date(),
  });
  const newTaskId = result.insertedId.toString();
  console.log(`Tâche ID : ${newTaskId} insérée`);

  const allTasks = await tasks.find().toArray();
  console.log('Toutes les tâches : ', allTasks);

  await tasks.updateOne(
    {
      _id: new ObjectId(newTaskId),
    },
    { $set: { completed: true } }
  );
  console.log(`Tâche ID : ${newTaskId} terminée`);

  await tasks.deleteOne({
    _id: new ObjectId(newTaskId),
  });
  console.log(`Tâche ID : ${newTaskId} supprimée`);
}

dbTest().catch(console.error);

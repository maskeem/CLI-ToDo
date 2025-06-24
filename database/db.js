import { MongoClient } from 'mongodb';
require('dotenv').config();

const db_url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'todolist';

let db;

export async function connectToDb() {
  const client = new MongoClient(db_url);
  await client.connect();
  console.log(`Connexion MongoDB établie à l'URL : ${db_url}`);
  db = client.db(dbName);
}

export function getTasksCollection() {
  if (!db) throw new Error('BDD non connectée');
  return db.collection('tasks');
}

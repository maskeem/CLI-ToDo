import { createConnection } from 'node:net';

const client = createConnection({ port: process.env.PORT || 3000 }, () => {
  console.log("Test : envoi de la commande 'list'");
  client.write(JSON.stringify({ action: 'list' }) + '\n');
});

client.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log('Réponse reçue :');
    console.log(response);
  } catch {
    console.log('Réponse non JSON :', data.toString());
  }
  client.end();
});

client.on('end', () => {
  console.log('Connexion fermée');
});

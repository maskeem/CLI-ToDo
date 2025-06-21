import { createServer } from 'net';
const PORT = process.env.PORT || 3000;

const server = createServer((socket) => {
  console.log('Client connecté');

  socket.on('end', () => {
    console.log('Client déconnecté');
  });
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

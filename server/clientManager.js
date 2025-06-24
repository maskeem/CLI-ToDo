const clients = [];

export function registerClient(socket) {
  clients.push(socket);
}

export function unregisterClient(socket) {
  const index = clients.indexOf(socket);
  clients.splice(index, 1);
}

export function broadcast(message, exceptSocket = null) {
  const data = JSON.stringify(message) + '\n';
  for (const client of clients) {
    if (client !== exceptSocket) {
      client.write(data);
    }
  }
}

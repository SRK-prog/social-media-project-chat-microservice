const socketio = require("socket.io");

async function connnectSocket(server) {
  return await new Promise((resolve, reject) => {
    const io = socketio(server, { cors: { origin: "*" } });
    resolve(io);
  });
}

module.exports = connnectSocket;

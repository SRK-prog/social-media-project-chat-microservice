const socketio = require("socket.io");

async function connnectSocket(server) {
  return await new Promise(async (resolve, reject) => {
    try {
      const io = await socketio(server, { cors: { origin: "*" } });
      resolve(io);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = connnectSocket;

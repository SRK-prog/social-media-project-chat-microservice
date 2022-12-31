const Controllers = require("./controllers");

class Socket {
  constructor(socketIo) {
    this.socketIo = socketIo;
    this.state = {
      activeUsers: new Set(),
      userTrackers: new Map(),
    };
  }

  init = () => {
    this.socketIo.of("/chat").on("connection", (socket) => {
      const socketId = socket.handshake.query.id;
      const controller = new Controllers(socket);

      try {
        socket.join(socketId);
        this.state.activeUsers.add(socketId);

        socket.on("join", (...args) => {
          controller.onJoin(...args, this.state, socketId);
        });

        socket.on("message", (...args) => {
          controller.onMessage(...args, this.state, socketId);
        });

        socket.on("user_status", (...args) => {
          controller.userStatus(...args, this.state, socketId);
        });

        socket.on("remove_tracker", (...args) => {
          controller.onRemoveTracker(...args, this.state, socketId);
        });

        socket.on("disconnect", () => {
          controller.onDisconnect(this.state, socketId);
        });
      } catch (error) {
        console.log("chat space error: ", error);
      }
    });
  };
}

module.exports = Socket;

const Controllers = require("./controllers");

class Socket {
  constructor(socketIo) {
    this.socketIo = socketIo;
    this.state = {
      activeUsers: new Set(),
      userTrackings: new Map(),
      trackers: new Map(),
    };
  }

  init = () => {
    this.socketIo.of("/chat").on("connection", (socket) => {
      const socketId = socket.handshake.query.id;
      const controller = new Controllers(socket);

      try {
        socket.join(socketId);
        this.state.activeUsers.add(socketId);

        socket.on("join", (data, cb) => {
          controller.onJoin(data, cb, this.state, socketId);
        });

        socket.on("message", (data, cb) => {
          controller.onMessage(data, cb, this.state, socketId);
        });

        socket.on("user_status", (data, cb) => {
          controller.userStatus(data, cb, this.state, socketId);
        });

        socket.on("remove_tracker", (data, cb) => {
          controller.onRemoveTracker(data, cb, this.state, socketId);
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

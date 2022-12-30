class Socket {
  constructor(socketIo) {
    this.socketIo = socketIo;
    this.activeUsers = new Set();
  }
  init() {
    this.socketIo.of("/chat").on("connection", (socket) => {
      const id = socket.handshake.query.id;

      socket.join(id);

      socket.on("join", (data, cb) => {
        if (typeof cb === "function") cb({ status: "ok" });
        this.activeUsers.add(id);
      });

      // socket.on("notification", (data, cb) => {
      //   if (typeof cb === "function") cb({ status: "ok" });
      //   socket.to(data.receiver).emit("notification", data);
      // });

      socket.on("message", (data, cb) => {
        if (!data.receiver) return;

        if (this.activeUsers.has(data.receiver)) {
          socket.to(data.receiver).emit("message", data);
          if (typeof cb === "function")
            cb({ status: "ok", response: { sent: true } });
        }
        cb({ status: "ok", response: { sent: false } });
      });

      socket.on("check_online", (data, cb) => {
        const online = this.activeUsers.has(data.id);
        if (typeof cb === "function")
          cb({ status: "ok", response: { online } });
      });

      socket.on("disconnect", () => {
        this.activeUsers.delete(id);
      });
    });

    // this.socketIo.of("/notification").on("disconnect", (socket) => {
    //   console.log('this.socketIo.id: ', socket.id)
    // });
  }
}

module.exports = Socket;

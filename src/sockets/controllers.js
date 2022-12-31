const Utils = require("../utils/utils");

class Controllers {
  constructor(socket) {
    this.socket = socket;
  }

  onJoin = async (data, cb, state, socketId) => {
    const { activeUsers, userTrackers } = state;
    try {
      if (Utils.isFunc(cb)) cb({ status: "ok" });
      if (userTrackers.has(socketId)) {
        const trackers = userTrackers.get(socketId);
        for (const tracker of Array.from(trackers)) {
          if (activeUsers.has(tracker)) {
            this.socket.to(tracker).emit("user_status", { online: socketId });
          }
        }
      }
    } catch (error) {
      console.log("onJoin function: ", error);
    }
  };

  onMessage = async (data, cb, state) => {
    const { activeUsers } = state;
    try {
      if (activeUsers.has(data.receiver)) {
        this.socket.to(data.receiver).emit("message", data);
        if (Utils.isFunc(cb)) cb({ status: "ok", response: { sent: true } });
      } else {
        if (Utils.isFunc(cb)) cb({ status: "ok", response: { sent: false } });
      }
    } catch (error) {
      console.log("onMessage function: ", error);
    }
  };

  userStatus = async (data, cb, state, socketId) => {
    const { userTrackers, activeUsers } = state;
    const online = activeUsers.has(data.id);
    try {
      if (Utils.isFunc(cb)) cb({ status: "ok", response: { online } });
      if (userTrackers.has(data.id)) {
        userTrackers.set(
          data.id,
          new Set([...userTrackers.get(data.id), socketId])
        );
      } else {
        userTrackers.set(data.id, new Set([socketId]));
      }
      console.log("userTrackers: ", userTrackers);
    } catch (error) {
      console.log("userStatus function: ", error);
    }
  };

  onRemoveTracker = async (data, cb, state, socketId) => {
    const { userTrackers } = state;
    try {
      userTrackers.set(
        data.id,
        new Set(Utils.deleteInSet(userTrackers.get(data.id), socketId))
      );
      if (Utils.isFunc(cb)) cb({ status: "ok" });
    } catch (error) {
      console.log("userStatus function: ", error);
    }
  };

  onDisconnect = async (state, socketId) => {
    const { activeUsers, userTrackers } = state;
    try {
      if (userTrackers.has(socketId)) {
        const trackers = userTrackers.get(socketId);
        for (const tracker of Array.from(trackers)) {
          if (activeUsers.has(tracker)) {
            this.socket
              .to(tracker)
              .emit("user_disconnect", { offline: socketId });
          }
        }
      }
      activeUsers.delete(socketId);
    } catch (error) {
      console.log("onDisconnect function: ", error);
    }
  };
}

module.exports = Controllers;

const Utils = require("../utils/utils");
const UserUpdater = require("../updaters/userUpdater");

class Controllers {
  constructor(socket) {
    this.socket = socket;
  }

  onJoin = async (data, cb, state, socketId) => {
    const { activeUsers, userTrackings } = state;
    try {
      if (Utils.isFunc(cb)) cb({ status: "ok" });
      if (userTrackings.has(socketId)) {
        const trackers = userTrackings.get(socketId);
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
    const { userTrackings, activeUsers, trackers } = state;
    const online = activeUsers.has(data.id);
    try {
      if (Utils.isFunc(cb)) cb({ status: "ok", response: { online } });
      if (userTrackings.has(data.id)) {
        const trackingSet = userTrackings.get(data.id);
        trackingSet.add(socketId);
        userTrackings.set(data.id, trackingSet);
      } else {
        userTrackings.set(data.id, new Set([socketId]));
      }
      if (trackers.has(socketId)) {
        const trackingSet = trackers.get(socketId);
        trackingSet.add(data.id);
        trackers.set(socketId, trackingSet);
      } else {
        trackers.set(socketId, new Set([data.id]));
      }
    } catch (error) {
      console.log("userStatus function: ", error);
    }
  };

  onRemoveTracker = async (data, cb, state, socketId) => {
    const { userTrackings, trackers } = state;
    try {
      if (userTrackings.has(data.id)) {
        const trackings = userTrackings.get(data.id);
        trackings.delete(socketId);
        userTrackings.set(data.id, trackings);
        if (Utils.isFunc(cb)) cb({ status: "ok" });
        if (!trackings.size) userTrackings.delete(data.id);
      }
      if (trackers.has(socketId)) {
        const tracks = trackers.get(socketId);
        tracks.delete(data.id);
        trackers.set(socketId, tracks);
        if (!tracks.size) trackers.delete(socketId);
      }
    } catch (error) {
      console.log("userStatus function: ", error);
    }
  };

  onDisconnect = async (state, socketId) => {
    const { activeUsers, userTrackings, trackers } = state;
    try {
      if (userTrackings.has(socketId)) {
        const trackerings = userTrackings.get(socketId);
        this.socket
          .to(Array.from(trackerings))
          .emit("user_disconnect", { offline: socketId });
      }
      activeUsers.delete(socketId);
      UserUpdater.updateLastSeen(socketId);

      if (trackers.has(socketId)) {
        if (!trackers.size) trackers.delete(socketId);
        else {
          const trackingIds = [...trackers.get(socketId)];
          for (const id of trackingIds) {
            const trackings = userTrackings.get(id);
            if (trackings && trackings.has(socketId)) {
              trackings.delete(socketId);
              userTrackings.set(id, trackings);
              if (!trackings.size) userTrackings.delete(id);
            }
          }
        }
      }
    } catch (error) {
      console.log("onDisconnect function: ", error);
    }
  };
}

module.exports = Controllers;

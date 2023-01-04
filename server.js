const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connnectSocket = require("./src/connections/socketConn");
const Socket = require("./src/sockets");
const ConnectDB = require("./src/connections/dbConn");

const app = express();
app.use(cors());
const server = http.createServer(app);

const PORT = process.env.PORT || 5005;

async function listen() {
  try {
    const [socket] = await Promise.all([connnectSocket(server), ConnectDB()]);
    new Socket(socket).init();
    server.listen(PORT);
    console.log("Server start on port: ", PORT);
  } catch (error) {
    console.log("Failed to start server: ", error);
  }
}

listen();

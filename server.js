const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const connnectSocket = require("./src/connections/socketConn");
const Socket = require("./src/sockets");
const connectDB = require("./src/connections/dbConn");

const isDev = process.env.NODE_ENV === "development";

const logFormat = isDev
  ? "dev"
  : '":method :url HTTP/:http-version" :status ":referrer" ":user-agent" [:date]';

const app = express();
app.use(express.json());
app.use(morgan(logFormat));
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 5005;

async function listen() {
  try {
    require("./routes")(app);
    const [socket] = await Promise.all([connnectSocket(server), connectDB()]);
    new Socket(socket).init();
    server.listen(PORT);
    console.log("Server start on port: ", PORT);
  } catch (error) {
    console.log("Failed to start server: ", error);
  }
}

listen();

const conversationRoute = require("./src/controllers/conversation");
const messageRoute = require("./src/controllers/messages");

module.exports = function (app) {
    app.get("/", (req, res) => res.send("Chat Microservice Running"));
    app.use("/api/conversations", conversationRoute)
    app.use("/api/messages", messageRoute)
}
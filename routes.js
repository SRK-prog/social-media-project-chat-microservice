module.exports = function (app) {
    app.get("/", (req, res) => res.send("Chat Microservice Running"));
}
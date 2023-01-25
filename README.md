# README #
Realtime Private Chat Microservice

This microservice allows for real-time private chat functionality between users using Node.js and Socket.io.

### Prerequisites ###   
* Node.js v14 or higher

### Installation ###
* Clone the repository: git clone [https://github.com/SRK-prog/social-media-project-chat-microservice](https://github.com/SRK-prog/social-media-project-chat-microservice)

* Install the dependencies: `npm install`

* Create a .env file in the root of the project and set the following environment variables:
    - `MONGO_URI`: the connection string for your MongoDB database

* Start the application: 
    - `production`: npm start
    - `development`: npm run dev

### Usage ###
The microservice uses socket.io to handle real-time communication between users. Users can send private messages to each other by connecting to the server with a unique identifier (e.g. a userId).

The following events are emitted and listened by the server:

- `join`: connects the user to the server
- `message`: emitted when a user sends a private message to another user
- `user_status`: check specific user online status and add a status tracker to that specific user
- `remove_tracker`: to remove the status tracker from specific user
- `disconnect`: emitted when a tracking user disconnects from the server 
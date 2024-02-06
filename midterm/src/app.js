const http = require("http");
const express = require("express");
const hbs = require("express-handlebars");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { logout, login, createConversation, joinRoom, sendMessage, typingMessage, sendFile } = require("./socket/chat");

// Set View Engine
app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routers")(app);
require("./config/connectDB");

io.on("connection", async (socket) => {

  console.log("user " + socket.id + " connected");

  socket.on("logout", (token) => { logout(io, token) })

  socket.on("login", (token) => { login(io, token) })

  socket.on("disconnect", () => { console.log("user disconnected"); });

  socket.on("create-conversation", (token, socketSenderID, receiverID) => { createConversation(io, token, socketSenderID, receiverID) })

  socket.on("join-room", (roomID, token) => { joinRoom(socket, roomID, token) });

  socket.on("send-message-room", (conversationID, message, token, socketID) => { sendMessage(io, conversationID, message, token, socketID) });  

  socket.on("typing", (conversationID, socketID, token) => { typingMessage(io, conversationID, socketID, token) });

  socket.on("send-file-room", (conversationID, file, token, socketID, fileName) => { sendFile(io, conversationID, file, token, socketID, fileName) });

})

const port = 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

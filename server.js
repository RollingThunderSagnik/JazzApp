const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

let interval;

var playersIN = [];

var messages = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("receivemessage",messages);

  socket.on("addplayer", (userPlayer) => {
    playersIN.push(userPlayer);
    socket.emit("changedPlayerPositions", playersIN);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("sendmessage",(name,str) => {
    messages.push(name + ': ' + str);
    if(messages.length > 5)
        messages.splice(0,1);
    io.emit("receivemessage",messages);
  });

  socket.on("changePlayerPositions", (playersChanged) =>{
    playersIN = [...playersChanged];
    console.log(playersIN);
    io.emit("changedPlayerPositions", playersIN);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
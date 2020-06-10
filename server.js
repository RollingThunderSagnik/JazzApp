const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

var playersIN = [];

var messages = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("receivemessage",messages);

  socket.on("checkplayer", (newname) => {
    var x= playersIN.findIndex( (player) => {
      // console.log(player.name + 'vs' + newname);

      // console.log(player.name == newname);
      return (player.name == newname);
    })
    if(newname == '')
      x = 0;
    socket.emit("playerReadyToAdd",x);
  });

  socket.on("addplayer", (userPlayer) => {
    playersIN.push({
      name : userPlayer.name,
      x : userPlayer.x,
      y: userPlayer.y,
      fLeft : userPlayer.fLeft,
      avatar : userPlayer.avatar,
      id : socket.id
    });
    console.log(playersIN);
    socket.emit("changedPlayerPositions", playersIN);
  });

  socket.on("disconnect", () => {
    var i = playersIN.findIndex((player) => player.id == socket.id);
    playersIN.splice(i,1);
    io.emit("changedPlayerPositions", playersIN);
    console.log("Client"+i +" disconnected");
  });

  socket.on("sendmessage",(name,str) => {
    messages.push(name + ': ' + str);
    if(messages.length > 5)
        messages.splice(0,1);
    io.emit("receivemessage",messages);
  });

  socket.on("changePlayerPositions", (playersChanged) =>{
    playersIN = [...playersChanged];
    io.emit("changedPlayerPositions", playersIN);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const port = process.env.PORT || 4001;
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

const io = socketIo(server, { origins : '*:*'});

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
    });
    if(newname == '')
      x = 0;
    socket.emit("playerReadyToAdd",x);
  });

  socket.on("addplayer", (userPlayer) => {
    socket.emit("previousPlayers",playersIN);
    playersIN.push({
      name : userPlayer.name,
      x : userPlayer.x,
      y: userPlayer.y,
      fLeft : userPlayer.fLeft,
      avatar : userPlayer.avatar,
      id : socket.id
    });
    console.log(playersIN);
    io.emit("newPlayerJoined", playersIN[playersIN.length-1]);
    socket.emit("receivemessage",messages);
  });

  socket.on("disconnect", () => {
    var i = playersIN.findIndex((player) => player.id == socket.id);
    if(i>-1)
    { 
        io.emit("deletePlayer", playersIN[i].name);
        playersIN.splice(i,1);
        console.log("Client"+i +" disconnected");
    }
  });

  socket.on("sendmessage",(name,str) => {
    messages.push(name + ': ' + str);
    if(messages.length > 5)
        messages.splice(0,1);
    io.emit("receivemessage",messages);
  });

  socket.on("changePlayerPositions", (nplayer) =>{
    // playersIN = [...playersChanged];
    // io.emit("changedPlayerPositions", playersIN);
    var x= playersIN.findIndex( (player) => {
      // console.log(player.name + 'vs' + newname);

      // console.log(player.name == newname);
      return (player.name == nplayer.name);
    });
    playersIN[x]= {
      name : nplayer.name,
      x : nplayer.x,
      y: nplayer.y,
      fLeft : nplayer.fLeft,
      avatar : nplayer.avatar,
      id : socket.id
    };

    io.emit("changedPlayerPositions", playersIN[x]);

  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
'use strict';

var os = require('os');
var nodeStatic = require('node-static');
//var socketIO = require('socket.io');
var express = require('express');
var app = express();
var http = require('http').createServer(app);

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let roomID;
//이건 방관리하는거임. 흠.....처음엔 false 그 후엔 true만 반환.
var ROOM = [];
app.get('/room/:roomId', function(req, res){
  roomID = req.params.roomId;
  console.log("roomID 나오나? "+roomID);
  if(ROOM[roomID] != undefined){
    res.send(false)
  }else{
    res.send(true)
  }

});

app.get('/room/', function(req, res){
  roomID = req.query.roomid;
  console.log("roomID 나오나? "+roomID);
  res.sendFile(__dirname + '/room.html');
});


http.listen(process.env.PORT||3000, function(){
  console.log('listening on *:3000');
});

let room_info = new Object();

var io = require('socket.io')(http);
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
io.on('connection', function(socket) {
  
  RTCMultiConnectionServer.addSocket(socket);


  socket.on('bye', function(){
    console.log('received bye');
  });

  socket.on('disconnect', () => {
    console.log('disconnected '+socket.id);
    io.sockets.in(room_info[socket.id]).emit("disconnect", 'diconnect');
    room_info[socket.id] = null;
  });


  socket.on('message', function(message) {
    console.log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  // socket.on('request', (room) => {
  //   socket.broadcast.emit("getRequest", room);
  //   room_info = room;
  // });

  // socket.on('response', (room, isGrant) => {
  //     if(isGrant){
  //         socket.broadcast.emit("getResponse", room, isGrant);
  //         socket.emit("enter", room);
  //     }else{
  //       console.log('방에 들어가는거 거절.');
  //     }
  // });

  socket.on("onCollabo", (id) => {
      room_info[id] = roomID;
      socket.emit("collabo", room_info[id]);
      console.log('---room_info list ' + id + ', ' + room_info[id]);
  });
/*
  socket.on("enter", (room, id) => {
      socket.emit("collabo", room);
      console.log("enter: " + room);
  });

  socket.on("connect", () => {
      console.log("connection")
      socket.emit("onCollabo", socket.id);
  });
*/
  socket.on("create or join", (room) => {
      console.log("received request to create or join room " + room);

      var clientsInRoom = io.sockets.adapter.rooms[room];
      var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
      console.log("Room "+room + " now has "+ numClients + " client(s)");
      //console.log();
      if(numClients === 0){
          socket.join(room);
          console.log("client id: "+socket.id+" created room " + room);
          socket.emit('created', room, socket.id);
      }else if(numClients === 1){
          console.log("client id: "+socket.id+" created room " + room);
          io.sockets.in(room).emit("join", room);
          socket.join(room);
          socket.emit("joined", room, socket.id);
          //io.sockets.in(room).emit("ready", room);
          //socket.broadcast.emit("ready", room);            
      }else{
          socket.emit('full', room);
      }
  });


});

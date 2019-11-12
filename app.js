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

app.get('/gazua', function(req, res){
  res.sendFile(__dirname + '/gazua.html');
});


let roomID;
//이건 방관리하는거임. 흠.....처음엔 false 그 후엔 true만 반환.
let ROOM = [];
app.get('/room/:roomId', function(req, res){
  roomID = req.params.roomId;
  console.log(roomID+"roomID 나오나? "+ROOM[roomID]);
  if(ROOM[roomID] === undefined){
    ROOM[roomID] = true;
    res.send(true)
  }else{
    res.send(false)
  }
  
});

app.get('/room/', function(req, res){
  roomID = req.query.roomid;
  console.log("roomID 나오나? "+roomID);
  res.sendFile(__dirname + '/room.html');
});

let A = 0;
let B = 0;
//A 득점
app.post('/score/A/', function(req, res){
  console.log("A 득점");
  A++;
});

//B 득점
app.post('/score/B/', function(req, res){
  console.log("B 득점");
  B++;
});

//Reset
app.post('/score/reset/', function(req, res){
  console.log("Score Reset");
  A = 0;
  B = 0;
});

//Get Score
app.get('/score/', function(req, res){
  console.log(A+" : "+B+" score get!");
  let score = {'A':A, 'B':B};
  res.send(score);
});

http.listen(process.env.PORT||3000, function(){
  console.log('listening on *:3000');
});

let room_info = new Object();

var io = require('socket.io')(http);
/*
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

  socket.on("onCollabo", (id) => {
      room_info[id] = roomID;
      socket.emit("collabo", room_info[id]);
      console.log('---room_info list ' + id + ', ' + room_info[id]);
  });

  socket.on("create or join", (room) => {
      console.log("received request to create or join room " + room);

      var clientsInRoom = io.sockets.adapter.rooms[room];
      var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
      console.log("Room "+room + " now has "+ numClients + " client(s)");

      if(numClients === 0){
          socket.join(room);
          console.log("client id: "+socket.id+" created room " + room);
          socket.emit('created', room, socket.id);
      }else if(numClients === 1){
          console.log("client id: "+socket.id+" created room " + room);
          io.sockets.in(room).emit("join", room);
          socket.join(room);
          socket.emit("joined", room, socket.id);          
      }else{
          socket.emit('full', room);
      }
  });


});*/

io.sockets.on('connection', function (socket) {
  var initiatorChannel = '';
  if (!io.isConnected) {
      io.isConnected = true;
  }

  socket.on('new-channel', function (data) {
      if (!channels[data.channel]) {
          initiatorChannel = data.channel;
      }

      channels[data.channel] = data.channel;
      onNewNamespace(data.channel, data.sender);
  });

  socket.on('presence', function (channel) {
      var isChannelPresent = !! channels[channel];
      socket.emit('presence', isChannelPresent);
  });

  socket.on('disconnect', function (channel) {
      if (initiatorChannel) {
          delete channels[initiatorChannel];
      }
  });
});

function onNewNamespace(channel, sender) {
  io.of('/' + channel).on('connection', function (socket) {
      var username;
      if (io.isConnected) {
          io.isConnected = false;
          socket.emit('connect', true);
      }

      socket.on('message', function (data) {
          if (data.sender == sender) {
              if(!username) username = data.data.sender;
              
              socket.broadcast.emit('message', data.data);
          }
      });
      
      socket.on('disconnect', function() {
          if(username) {
              socket.broadcast.emit('user-left', username);
              username = null;
          }
      });
  });
}
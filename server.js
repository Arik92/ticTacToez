var express = require('express');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').strategy;
var userRoutes = require('./routes/userRoutes');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));;
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/
app.use('/users', userRoutes);
app.use(express.static('public'));
app.use(express.static('node_modules'));


app.all('*', function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

////////////////////////////////////////// SOCKET INTERFACE ///////////////////////////////////////////
var player1Name;
var player2Name;
var gameInProgress = false; 


io.on('connection', function(socket){  
  setInterval(function(){
    if (gameInProgress) {
    io.sockets.in('gameRoom').emit('clear');
    gameInProgress = false;
    socket.disconnect();
    }
  }, 1000*60*5);// 2 minuts when testing, 5 for dev env
  //console.log(io.engine);   
  socket.on('whois', function(name){
    if (io.engine.clientsCount===1) {
      player1Name = name;
    } else if (io.engine.clientsCount===2) {
      player2Name = name;
    };
    console.log(name+" has connected to game room");
  })
  //console.log("there are "+io.engine.clientsCount+"people in game room");
  console.log("there are "+io.engine.clientsCount+"people in game room");

  if (io.engine.clientsCount===1) {
    player1Socket = socket.id;
    console.log("player 1 id ", player1Socket);
    socket.join('gameRoom');
    //socket.to(player1Socket).emit('private', 'I just met you'); -> PM
    io.sockets.in('gameRoom').emit('player1Message');    
    //io.sockets.broadcast.to(player1Socket).emit('private', 'for your eyes only');
    //socket.broadcast.to('gameRoom').emit('waiting', 'Loading... Waiting for a player to join');
  } else if (io.engine.clientsCount===2) {
    var game = {
      numMoves: 0,
      board: 0,
      player1: player1Name,
      player2: player2Name
    }//game
    gameInProgress = true;
    socket.join('gameRoom');    
    io.sockets.in('gameRoom').emit('play', game);    
  } else {
    io.emit('tooMany', 'Game already in progress. Check again soon!');
    socket.disconnect();
  }  
  socket.on('update', function(game){    
    io.sockets.in('gameRoom').emit('update', game);
  })
  socket.on('chat message', function(msg){
  io.emit('chat message',msg);
  });
  socket.on('endgame', function(){
    console.log("reached endgame through winning");
    gameInProgress = false;
    player1Name = '';
    player2Name = '';
    socket.disconnect();
  })
  socket.on('disconnect', function(){    
    console.log("goodbye");    
    if (io.engine.clientsCount===1) {
      io.sockets.in('gameRoom').emit('player_disconnect');
    }
    console.log("engine? ", io.engine.clientsCount);  })
});


//main error handler
// warning - not for use in production code!
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});*/


server.listen(process.env.PORT || 8000, function() {
  console.log("Tic Tac Toe!!! Listening on port 8000.");
});

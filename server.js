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
var player1Socket;
var player2Socket;
var gameInProgress = false; //future use

io.on('connection', function(socket){  
  //console.log(io.engine);
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
      gameBoard: 0
    }//game
    socket.join('gameRoom');    
    io.sockets.in('gameRoom').emit('play', game);    
  } else {
    io.emit('tooMany', 'Game already in progress. Check again soon!');
  }  
  socket.on('update', function(game){
    if (game.winner!==null) {
      io.sockets.in('gameRoom').emit('winner', game);
      //TODO: server request for winner handling in db
    }// if we have a winner
    io.sockets.in('gameRoom').emit('update', game);
  })
  socket.on('chat message', function(msg){
  io.emit('chat message',msg);
  });
  socket.on('disconnect', function(){    
    console.log("goodbye");
    console.log("engine? ", io.engine.clientsCount);
  })
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

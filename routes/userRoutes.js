const express = require('express');
const router = express.Router();
var  Postgras_user, Postgras_password,Postgras_host, Postgras_db, Postgras_port;
if (process.env.NODE_ENV === 'production') {
  Postgras_user = process.env.Postgras_user;
  Postgras_host = process.env.Postgras_host;//host
  Postgras_db = process.env.Postgras_db;//db
  Postgras_password = process.env.Postgras_password;
  Postgras_port = process.env.Postgras_port;//port
  //callbackURL = "https://danktickets.herokuapp.com/users/facebook/callback";
 } else {
  //callbackURL = "http://localhost:8000/users/facebook/callback";
  Postgras_user, Postgras_password,Postgras_host, Postgras_db, Postgras_port = require('../config.js');
 }
const { Pool, Client } = require('pg');
//console.log("db creds", Postgras_user+ Postgras_password);
//var passport = require('passport'); consider using just localStorage
// if login is successful, set localStorage item in controller cb

//I need to connect to the remote  postgres sql server. SOMEHOW
// Once I have that and the querying syntax nailed down I can move on

const pool = new Pool({
  user: Postgras_user,
  host: Postgras_host,
  database: Postgras_db,
  password: Postgras_password,
  port: Postgras_port,
})
/*pool.query('SELECT * from postgres.tictactoe.users', (err, res) => {
  console.log("user?", res);
  console.log("error", err);
  //console.log(err, res);
  pool.end()
})*/

//the user routes go here
router.post('/join', function(req, res1, next){
  var text = 'INSERT INTO postgres.tictactoe.users(username, password) VALUES($1, $2) RETURNING *';
  var values = [req.body.username, req.body.password];
  pool.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack);
      var dupeName_error = {
        'errorText': "this username already exists"
      }
      res1.json(dupeName_error);
      //throw (err);     
      //pool.end();
    } else {
      console.log(res.rows[0]);
      res1.send(res);
      //pool.end();
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    }
  })
});


router.post('/login', function(req, res1) {
  console.log("request body", req.body);
  var selq = {
    username: req.body.username
  }
  var text ='SELECT username, password FROM postgres.tictactoe.users WHERE username =$1 ';
  //console.log("query text is", text);
  pool.query(text,[ req.body.username], (err, res) => {
    if (err) {
      console.log(err.stack);    
    } else {
      console.log(res.rows[0]);
      if ((res.rows[0])&&(res.rows[0].password.localeCompare(req.body.password)===0)){
        res1.send(true);
      } else {
        res1.send(false)
      }
      //pool.end();
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    }
  })
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  //res.send(req.user)
});

// router.get('/success', function (req, res){
//   if (req.isAuthenticated()) {
//     res.send('Hey, ' + req.user + ', hello from the server!');
//   } else {
//     res.redirect('/login');
//   }
// });

router.get('/logout', function (req, res) { //Why is this here? logout can be client specific with localStorage
  // you can leave the server alone with this one. just signup/login update the 
  req.logout();
  console.log("in logout server route");
  res.send('Logged out!');
});

    // Successful authentication, redirect home.
   // res.redirect('/');
module.exports = router;
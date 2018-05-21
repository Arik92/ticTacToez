const express = require('express');
const router = express.Router();
var  Postgras_user, Postgras_password,Postgras_host, Postgras_db, Postgras_port, Postgras_table;
if (process.env.NODE_ENV === 'production') {
  Postgras_user = process.env.Postgras_user;
  Postgras_host = process.env.Postgras_host;//host
  Postgras_db = process.env.Postgras_db;//db
  Postgras_password = process.env.Postgras_password;
  Postgras_port = process.env.Postgras_port;//port
  Postgras_table = process.env.Postgras_table;
 } else {
  var postgrasDefs = require('../config.js');  
  Postgras_user = postgrasDefs.Postgras_user;
   Postgras_password = postgrasDefs.Postgras_password;
   Postgras_host = postgrasDefs.Postgras_host;
   Postgras_db = postgrasDefs.Postgras_db;
   Postgras_port = postgrasDefs.Postgras_port;
   Postgras_table = postgrasDefs.Postgras_table;
 }//else getting postgras defs
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: Postgras_user,
  host: Postgras_host,
  database: Postgras_db,
  password: Postgras_password,
  port: Postgras_port,
})

//////////////////////////////////////// Server Maintainance ///////////////////////////////
setInterval(function(){
  var text = 'UPDATE '+Postgras_table+' SET dailyscore = 0';  
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);           
      //throw (err);           
    } else {
      console.log("Daily reset");            
    }
  })
},1000*60*60*24 )// reset daily

 
setInterval(function(){
  var text = 'UPDATE '+Postgras_table+' SET weeklyscore = 0';  
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);           
      //throw (err);           
    } else {
      console.log("Weekly Reset");            
    }
  })
},1000*60*60*24*7 )// reset weekly
 setInterval(function(){
   var text = 'UPDATE '+Postgras_table+' SET monthlyscore = 0';  
   pool.query(text, (err, res) => {
     if (err) {
       console.log(err.stack);           
       //throw (err);           
     } else {
       console.log("Monthly Reset");            
     }
   })
 },1000*60*60*24*7*3 )// reset monthly - every 3 weeks~
 
///////////////////////////////////////    Auth //////////////////////////////////////////////////////////////
router.post('/join', function(req, res1, next){
  var text = 'INSERT INTO '+Postgras_table+'(username, password, totalscore, dailyscore, weeklyscore, monthlyscore) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  var values = [req.body.username, req.body.password, 0, 0, 0, 0];
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
    }
  })
});
router.post('/login', function(req, res1) {
  console.log("request body", req.body);
  /*var selq = {
    username: req.body.username
  } */
  var text ='SELECT username, password FROM '+Postgras_table+' WHERE username =$1 ';
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
    }
  })  
});

//////////////////////////////////////////////////////// SCORE KEEPING ///////////////////////////////////
router.put('/addScore', function(req, res1, next){
  /* UPDATE weather SET temp_lo = temp_lo+1, temp_hi = temp_lo+15, prcp = DEFAULT
  WHERE city = 'San Francisco' AND date = '2003-07-03';*/
  console.log("adding to ", req.body.winnerName);
  var text = 'UPDATE '+Postgras_table+' SET totalscore = totalscore+1, dailyscore = dailyscore+1, weeklyscore = weeklyscore+1, monthlyscore = monthlyscore+1 WHERE username = $1';  
  var value = [req.body.winnerName];
  pool.query(text, value, (err, res) => {
    if (err) {
      console.log(err.stack);       
      //throw (err);     
    } else {
      console.log(res);
      res1.send(res);           
    }//else
  })
});
router.get('/alltime', function(req, res1) {  
  var text ='SELECT username, totalscore FROM '+Postgras_table+' ORDER BY totalscore DESC limit 10; ';
  //console.log("query text is", text);
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);    
    } else {
      console.log(res);
      res1.send(res.rows);     
    }
  }) 
}); //all time scores
router.get('/weekly', function(req, res1) {  
  var text ='SELECT username, weeklyscore FROM '+Postgras_table+' ORDER BY weeklyscore DESC limit 10; ';
  //console.log("query text is", text);
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);    
    } else {
      console.log(res);
      res1.send(res.rows);     
    }
  }) 
}); //weekly scores
router.get('/monthly', function(req, res1) {  
  var text ='SELECT username, monthlyscore FROM '+Postgras_table+' ORDER BY monthlyscore DESC limit 10; ';
  //console.log("query text is", text);
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);    
    } else {
      console.log(res);
      res1.send(res.rows);     
    }
  }) 
});
router.get('/daily', function(req, res1) {  
  var text ='SELECT username, dailyscore FROM '+Postgras_table+' ORDER BY dailyscore DESC limit 10; ';
  //console.log("query text is", text);
  pool.query(text, (err, res) => {
    if (err) {
      console.log(err.stack);    
    } else {
      console.log(res);
      res1.send(res.rows);     
    }
  }) 
});
/*
CREATE TABLE tictactoe.users
(
    username text  NOT NULL,
    password text  NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (username)
)
WITH (
    OIDS = FALSE
)
SELECT * FROM tictactoe.USERS
 */

module.exports = router;
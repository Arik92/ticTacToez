Hello! 
Please check out https://tic-2-toe.herokuapp.com/home for the deployed app page
This document will help you set up this project for local development and run some tests

*Running tests:* 
1.Navigate into your directory from the command window, and then type: jasmine
Writing tests:
Additional tests can be added to /spec/support folder. Name your test files with a spec.js/Spec.js suffix.


*Setting up for development:*
1.Fork(or join as a contributor) and clone the following repo:
  https://github.com/Arik92/ticTacToez
2.Navigate into your directory from the command window, and then type:
  *npm install => install dependencies
  *npm start => To have the project run on localhost

3.Subsection: Setting up the database => the app makes use of postgres/sql.
  connect to your db server.
  You will have to specify the following variables:
  Postgras_user, Postgras_password,Postgras_host, Postgras_db, Postgras_table and Postgras_port
  Put them in a config.js file(not included within github for security reasons. Plus local databases vary) inside the project directory
  or as environment variables.
  You will also need to create a users table inside a schema on your database with the fields:
  username, password - text fields 
  totalscore, dailyscore, weeklyscore and monthlyscore - numeric
  set Postgras_table to your combination of database.schema.table(ex. postgres.tictactoe.users)

4. navigate to localhost:8000 on your browser and you should be good to go!
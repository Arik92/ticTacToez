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
3. Regarding database => the app makes use of postgres/sql.
  You will have to specify the following variables:
  Postgras_user, Postgras_password,Postgras_host, Postgras_db, Postgras_port
  Put them in a config.js file(not included within github for security reasons. Plus local databases vary) inside the project directory
  or as environment variables.
  You will also need to set Postgras_table to your combination of database.schema.table(ex. postgres.tictactoe.users)
4. navigate to localhost:8000 and you should be good to go!
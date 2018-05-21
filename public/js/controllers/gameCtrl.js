app.controller('gameCtrl', [ '$scope', '$stateParams','$timeout','$state', 'authService', function($scope, $stateParams,$timeout,$state, authService) {
  
  this.$onInit = function() {  
    $scope.player1Message = false;   
    //$scope.gameBoard = [];
  }//onInit 
  var socket = io();
  socket.on('connect', function onConnect(){
    console.log('This socket is now connected to the server.');
    var name = localStorage.getItem("ticTacUser")
    socket.emit('whois',name);
  });
  socket.on('clear', function(){
    alert("time's up!");
      $timeout(function () {      
      $state.go('home', {}, {
        reload: true
      });
    }, 500);
  });//
  socket.on('toomany', function(){
    alert("Game room full for now. Check back soon");
      $timeout(function () {      
      $state.go('home', {}, {
        reload: true
      });
    }, 500);
  });//not very DRY
  
  socket.on('disconnect', function onDisConnect(){
    console.log('disconnecad.');
  });
  socket.on('player1Message', function(){
    $scope.playerValue = 1;
    $scope.player1Message = true;
    $scope.$apply();
    console.log("You will begin the game as x. Waiting on another player");
  })
  
  socket.on('play', function(game){ //starting position
        $scope.gameBoard = [];
    var boardNum = baseThreeToDecimal(game.board);
    $scope.game = {};
    $scope.game.player1 = game.player1;
    $scope.game.player2 = game.player2;//perhaps redundant
    $scope.game.numMoves = game.numMoves;
    makeBoard(boardNum);// at this stage can also be replaced by 0. Start of game     
    console.log("starting game board", $scope.gameBoard);
    console.log(game);
    if ($scope.playerValue!==1) {
      $scope.playerValue = 2;
      $scope.game.player2 = localStorage.getItem("ticTacUser"); // updating second player      
    }// if on player 2's side
    updateServer();
    $scope.$apply();
  })
  socket.on('update', function(game){
    console.log("client update", game);
    $scope.game.numMoves = game.numMoves;
    $scope.game.player1 = game.player1;
    $scope.game.player2 = game.player2;
    //this function gets the boardstate(ternary number) and prepares the new number array 
    //console.log("base 3 from server", game.board);
    console.log("base 10 from server", game.board);
    //makeBoard(baseThreeToDecimal(game.board)); 
    makeBoard(game.board);    
    $scope.$apply();
    if (game.gameWon)    {
      alert(game.winnerName+" is the winner!!! redirecting");
      socket.emit('endgame'); // disconnect sockets after game is won
      $timeout(function () {
        $state.go('home', {}, {
          reload: true
        });
      }, 1000);
    } else if (isTie(game.board)){
      alert(game.winnerName+" its a tie!!! redirecting");
      socket.emit('endgame'); // disconnect sockets after game is won
      $timeout(function () {
        $state.go('home', {}, {
          reload: true
        });
      }, 1000);
    }//if there's a tie
  })
  
  function isTie(board) {
    for (var i=0;i<board.length;i++) {
      if (board[i]===0) {
        return false;
      }
    }//for 
    return true;
  }//isTie 
  $scope.isOne = function(num) {    
    if (num===1) {
      return true;
    } //if
    return false;
  }//isOne 
  $scope.isTwo = function(num) {
    if (num===2) {
      return true;
    } //if
    return false;
  }//isTwo

  $scope.tacMove = function(index) {            
    console.log("player value is"+$scope.playerValue+" and number of moves is"+$scope.game.numMoves);
    //player value is either 1 for x, or 2 for circle    
    if ($scope.gameBoard[index] === 0) {
      if (($scope.game.numMoves % 2 !== 0) && ($scope.playerValue === 2)) {
        console.log("turned to circle");
        $scope.gameBoard[index] = 2; 
        $scope.game.numMoves++;
        updateServer(); // when move is made, update the board,      
      } else if (($scope.game.numMoves % 2 === 0) && ($scope.playerValue === 1)) {
        $scope.gameBoard[index] = 1;
        $scope.game.numMoves++;          
        updateServer(); // when move is made, update the board,       
      } //else if right player/move
    } //if guarentee empty square   
  }// tacMove 

  function checkWin() {
    //checking rows
    if (
      (($scope.gameBoard[0]===$scope.playerValue)&&($scope.gameBoard[1]===$scope.playerValue)&&($scope.gameBoard[2]===$scope.playerValue))
      || (($scope.gameBoard[3]===$scope.playerValue)&&($scope.gameBoard[4]===$scope.playerValue)&&($scope.gameBoard[5]===$scope.playerValue))
      || (($scope.gameBoard[6]===$scope.playerValue)&&($scope.gameBoard[7]===$scope.playerValue)&&($scope.gameBoard[8]===$scope.playerValue))
    ) {
      console.log("row win!");
      return true;
    } else if ( //checking cols
      (($scope.gameBoard[0]===$scope.playerValue)&&($scope.gameBoard[3]===$scope.playerValue)&&($scope.gameBoard[6]===$scope.playerValue))
      || (($scope.gameBoard[1]===$scope.playerValue)&&($scope.gameBoard[4]===$scope.playerValue)&&($scope.gameBoard[7]===$scope.playerValue))
      || (($scope.gameBoard[2]===$scope.playerValue)&&($scope.gameBoard[5]===$scope.playerValue)&&($scope.gameBoard[8]===$scope.playerValue))
    ) {
      console.log("column wins");   
      return true; 
  } else if ( //checking across
    (($scope.gameBoard[0]===$scope.playerValue)&&($scope.gameBoard[4]===$scope.playerValue)&&($scope.gameBoard[8]===$scope.playerValue))
    || (($scope.gameBoard[2]===$scope.playerValue)&&($scope.gameBoard[4]===$scope.playerValue)&&($scope.gameBoard[6]===$scope.playerValue))
   ) {
     console.log("won across");
     return true;
    } else {
      return false; // no winner yet
    }//else
  }//checkWin
  
  function updateServer(game) {
    var isWinner = false;
    //check for winner needs to be done HERE, because the board is still in array form
    var gameWon = checkWin();
    var winnerName = null;
    if (gameWon) {
      isWinner = true;
      winnerName = localStorage.getItem("ticTacUser");         
    }// if getting winner identity
    var boardNum = makeNumber($scope.gameBoard); //array to decimal
    console.log("Im sending into the server", boardNum);
    //boardNum = toBaseThree(boardNum); //decimal to ternary MIGHT REMOVE THIS   
    var game = {
      'board': boardNum,
      'gameWon': isWinner,
      'winnerName': winnerName,
      'numMoves': $scope.game.numMoves,
      'player1': $scope.game.player1,
      'player2': $scope.game.player2
    }
    socket.emit('update', game);
    if (gameWon) {
      console.log("winner name is", winnerName);
      authService.updateWinner(winnerName).then(function(response){
        console.log("score++");
      })  
    }//update score
    // emit update
  }
  

  ////////////////////////********************CONVERSION FUNCTIONS**************************************/////////////////////
  function makeBoard(num) {
    //function takes a DECIMAL number and turns it into a length 9 array with appropriate numbers
    //ex: [0][0][0][0][0][0][0][0][0] for empty board( 0 for input)
    console.log("initial num", num);
    $scope.gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var currDigit = $scope.gameBoard.length;//9
    var dig;
    while (num>=10) {
      dig = Math.floor(num%10); //takes rightmost digit
      console.log("current rightmost digit is"+num+" , "+dig);
      $scope.gameBoard[currDigit-1] = dig;
      currDigit--;
      num = Math.floor(num/10);
    }//while 
    $scope.gameBoard[currDigit-1] = num;   
  }//makeBoard

  function makeNumber(board) {
    //exact opposite of make board. take a board and turn into a decimal number
    var res = 0;
    var count = 0;
    while (board[count]===0) {
      count++
    }//while removing leading zeros
    for (var i=count;i<board.length;i++) {      
        res*=10;
        res+=board[i];      
    }//for 
    console.log(board);
    console.log("turned into", res);
    return res;
  }//makeNumber 
  
  function toBaseThree(num) {
      //converts a decimal number to base 3 representation. for board-state record keeping
      var str = num.toString(3);
       var res = parseInt(str, 10);
      console.log(num+" to base 3 "+res+" and its a "+typeof(res));
      return res;
  }//toBaseThree 
  
  function baseThreeToDecimal(num) {
    var res = parseInt(num, 3);
    var str = res.toString(10);   
      console.log(num+" to base 10 "+str);
      return res;
  }//BTTD consider migrating these to a service   

}]);//gameCtrl
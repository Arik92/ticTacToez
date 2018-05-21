//this file will house tests for the number conversion functions, utilized in gameCtrl
function makeBoard(num) {
    //function takes a DECIMAL number and turns it into a length 9 array with appropriate numbers
    //ex: [0][0][0][0][0][0][0][0][0] for empty board( 0 for input)    
     var gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var currDigit = gameBoard.length;//9
    var dig;
    while (num>=10) {
      dig = Math.floor(num%10); //takes rightmost digit
      console.log("current rightmost digit is"+num+" , "+dig);
      gameBoard[currDigit-1] = dig;
      currDigit--;
      num = Math.floor(num/10);
    }//while 
    gameBoard[currDigit-1] = num;   
    return gameBoard;
  }//makeBoard  
  
describe("tenToThree", function(){
    it("Should turn decimal numbers into ternary based ones", function(){
        var res1 = makeBoard(3);
        var res2 = makeBoard(27);
        var res3 = makeBoard(82);
        var res4 = makeBoard(45);
        expect(res1).toBe(10);
        expect(res2).toBe(1000);
        expect(res3).toBe(10001);
        expect(res4).toBe(1200);
    })//it
})//tenToThree  

  function makeNumber(board) {
    //exact opposite of make board. take a board and turn into a decimal number
    var res = 0;
    var count = 0;
    while (board[count]!=0) {
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
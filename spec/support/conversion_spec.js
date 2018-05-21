//this file will house tests for the number conversion functions, utilized in gameCtrl
  
  function toBaseThree(num) {
      //converts a decimal number to base 3 representation. for board-state record keeping
      var str = num.toString(3);
      var res = parseInt(str, 10);      
      return res;
  }//toBaseThree 
  describe("tenToThree", function(){
      it("Should turn decimal numbers into ternary based ones", function(){
          var res1 = toBaseThree(3);
          var res2 = toBaseThree(27);
          var res3 = toBaseThree(82);
          var res4 = toBaseThree(45);
          expect(res1).toBe(10);
          expect(res2).toBe(1000);
          expect(res3).toBe(10001);
          expect(res4).toBe(1200);
      })//it
  })//tenToThree 



  function baseThreeToDecimal(num) {
    var res = parseInt(num, 3);
    var str = res.toString(10);         
      return res;
  }//BTTD   
  describe("threeToTen", function(){
    it("Should turn decimal numbers into ternary based ones", function(){
        var res1 = baseThreeToDecimal(10);
        var res2 = baseThreeToDecimal(1000);
        var res3 = baseThreeToDecimal(10001);
        var res4 = baseThreeToDecimal(1200);
        var res5 = baseThreeToDecimal(10000);
        expect(res1).toBe(3);
        expect(res2).toBe(27);
        expect(res3).toBe(82);
        expect(res4).toBe(45);
        
    })//it
})//threeToTen

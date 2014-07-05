describe("SudokuGame", function() {
  var sudoku;

  beforeEach(function() {
    sudoku = new SudokuGame("hard");
  });

  it("difficulty should be easy by default", function(){
    sudoku = new SudokuGame();
    expect(sudoku.difficulty).toBe("easy");
  });

  it("should not be complete on creation", function(){
    expect(sudoku.isComplete()).toBe(false);
  });

  it("should not be solved", function(){
    expect(sudoku.isSolved()).toBe(false);
  });

  it("playersGrid should equal puzzle on creation", function(){
    expect(sudoku.playersGrid).toEqual(sudoku.puzzle);
  })

  it("should be complete when playersGrid is fillled", function(){
    sudoku.playersGrid = sudoku.generatePuzzle();
    expect(sudoku.isComplete()).toBe(true);
  });

  it("should be solved when playersGrid equals the puzzle solution", function(){
    sudoku.playersGrid = sudoku.copyPuzzle(sudoku.solution);
    expect(sudoku.isSolved()).toBe(true);
  });

  it("should throw error on invalid input of 'a'", function(){
    try{
      sudoku.playerInput(1,1,"a");
    }
    catch(error){
      expect(error.name).toEqual("invalidGuess");
    }
  });

  it("should not throw error on valid input of 1", function(){
    var checkError;
    try{
      sudoku.playerInput(1,1,1);
    }
    catch(error){
      checkError = error;
    }
    expect(checkError).toBeUndefined();
  });

  it("a full grid should return no hints", function(){
    sudoku.playersGrid = sudoku.generatePuzzle();
    var result = sudoku.giveHint();
    console.log(result);
    expect(result.hint).toBe(null);
  });

  it("a grid with empty cells should return a hint with a row and column", function(){
    var result = sudoku.giveHint();
    console.log(result);
    expect(result.hint).toBeDefined();
    expect(result.row).toBeDefined();
    expect(result.column).toBeDefined();
  });



});

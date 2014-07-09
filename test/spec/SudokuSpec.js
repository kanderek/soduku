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
  });

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

  describe("whichSubGrid", function(){
    it("should return coordintes of 1, 1 for a row and column of 2, 2 in the larger grid" +
      "with start and end indices for the larger grid", function(){

      var subGrid = sudoku.whichSubGrid(2,2);
      expect(subGrid).toEqual({
        coordinates: [1,1],
        startRowIndex: 0,
        endRowIndex: 2,
        startColumnIndex: 0,
        endColumnIndex: 2
      });
    });

    it("should return coordintes of 3, 1 for a row and column of 7, 2 in the larger grid" +
      "with start and end indices for the larger grid", function(){

      var subGrid = sudoku.whichSubGrid(7,2);
      expect(subGrid).toEqual({
        coordinates: [3,1],
        startRowIndex: 6,
        endRowIndex: 8,
        startColumnIndex: 0,
        endColumnIndex: 2
      });
    });

  });

  describe("getPossibleValuesForCell", function(){
    var sampleGrid, solution; 
    beforeEach(function(){
      sampleGrid = [
        [0, 2, 3, 0, 5, 0, 0, 6, 0], 
        [8, 0, 0, 9, 0, 0, 4, 2, 0], 
        [4, 0, 0, 0, 2, 7, 0, 0, 3], 
        [3, 1, 0, 2, 0, 8, 5, 0, 0], 
        [2, 8, 0, 1, 9, 0, 6, 3, 4], 
        [9, 0, 5, 3, 0, 6, 2, 0, 0], 
        [0, 7, 2, 6, 8, 9, 0, 4, 5], 
        [0, 0, 0, 5, 0, 0, 7, 1, 2], 
        [5, 3, 4, 7, 1, 2, 0, 9, 0] 
      ];
      solution = [
        [7, 2, 3, 4, 5, 1, 9, 6, 8],
        [8, 5, 1, 9, 6, 3, 4, 2, 7],
        [4, 6, 9, 8, 2, 7, 1, 5, 3],
        [3, 1, 6, 2, 4, 8, 5, 7, 9],
        [2, 8, 7, 1, 9, 5, 6, 3, 4],
        [9, 4, 5, 3, 7, 6, 2, 8, 1],
        [1, 7, 2, 6, 8, 9, 3, 4, 5],
        [6, 9, 8, 5, 3, 4, 7, 1, 2],
        [5, 3, 4, 7, 1, 2, 8, 9, 6]
      ];
    });

    it("should return possible values of cell ", function(){
      var possible = sudoku.getPossibleValuesForCell(sampleGrid, 1, 2);
      expect(possible.values).toEqual({
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
        6: true,
        7: true,
        8: false,
        9: false
      });
    });

    it("should return clash at cell 5,4 of column, row and subgrid for value of 7", function(){
      var possible = sudoku.getPossibleValuesForCell(sampleGrid, 5, 4, 7);
      expect(possible.clash).toEqual({
        row: false,
        column: false,
        subgrid: false
      });
    });

    it("should return clash at cell 7,4 of column, row and subgrid for value of 2", function(){
      var possible = sudoku.getPossibleValuesForCell(sampleGrid, 7, 4, 6);
      expect(possible.clash).toEqual({
        row: false,
        column: false,
        subgrid: true
      });
    });

    it("should return clash at cell 1,1 of column, row and subgrid for value of 2", function(){
      var possible = sudoku.getPossibleValuesForCell(sampleGrid, 1, 1, 2);
      expect(possible.clash).toEqual({
        row: true,
        column: true,
        subgrid: true
      });
    });

    it("should return clash at cell 0,3 of column for value of 1", function(){
      var possible = sudoku.getPossibleValuesForCell(sampleGrid, 0, 3, 1);
      expect(possible.clash).toEqual({
        row: false,
        column: true,
        subgrid: false
      });
    });

  });



});

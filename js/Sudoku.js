// Soduku understands the rules for the game of soduku

function SudokuGame() {
  this.board = undefined;
  this.solution = this.generatePuzzle();
  this.DIFFICULTY = {easy: 50, medium: 40, hard: 30};
}

SudokuGame.prototype.generatePuzzle = function(){
  var solution = [
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
  // this.solution = {
  //   A1: 7, A2: 2, A3: 3, A4: 4, A5: 5, A6: 1, A7: 9, A8: 6, A9: 8,
  //   B1: 8, B2: 5, B3: 1, B4: 9, B5: 6, B6: 3, B7: 4, B8: 2, B9: 7,
  //   C1: 4, C2: 6, C3: 9, C4: 8, C5: 2, C6: 7, C7: 1, C8: 5, C9: 3,
  //   D1: 3, D2: 1, D3: 6, D4: 2, D5: 4, D6: 8, D7: 5, D8: 7, D9: 9,
  //   E1: 2, E2: 8, D3: 7, E4: 1, E5: 9, E6: 5, E7: 6, E8: 3, E9: 4,
  //   F1: 9, F2: 4, F3: 5, F4: 3, F5: 7, F6: 6, F7: 2, F8: 8, F9: 1,
  //   G1: 1, G2: 7, G3: 2, G4: 6, G5: 8, G6: 9, G7: 3, G8: 4, G9: 5,
  //   H1: 6, H2: 9, H3: 8, H4: 5, H5: 3, H6: 4, H7: 7, H8: 1, H9: 2,
  //   I1: 5, I2: 3, I3: 4, I4: 7, I5: 1, I6: 2, I7: 8, I8: 9, I9: 6
  // }

  //this.solution = "723451968851963427469827153316248579287195634945376281172689345698534712896"
  return solution;
}

SudokuGame.prototype.initializePuzzle = function(difficulty){
  //check is string and key is defined
  var numberOfBlanks = this.DIFFICULTY[difficulty];
  var i, j;
  var rows = this.solution.length;
  var columns = this.solution[0].length;
  var puzzle = [];

  for(i=0; i < rows; i++){
    for(j=0; j < columns; j++){
      if(Math.random() < numberOfBlanks/81){
        puzzle[i][j] = solution[i][j];
      }
    }
  }
  return puzzle;
}

SudokuGame.prototype.newGame = function(difficulty){

  this.solution = this.generate();

  return this.solution;
};
SudokuGame.prototype.isWinner = function(){};
SudokuGame.prototype.resumeGame = function(){};

// Board understands the state of a sudoku game

function SudokuBoard(domBoard) {
  this.id = domBoard;
  this.cells = [];
}

SudokuBoard.prototype.isComplete = function(){};
SudokuBoard.prototype.updateCell = function(){};
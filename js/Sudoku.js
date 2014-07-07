// Soduku understands the rules for the game of soduku

function SudokuGame(difficulty) {
  this.SETTINGS = {easy: 50, medium: 40, hard: 30};
  this.difficulty = difficulty || "easy";
  this.solution = this.generatePuzzle();
  this.puzzle = this.initializePuzzle(this.difficulty);
  this.playersGrid = this.copyPuzzle(this.puzzle);
}

SudokuGame.prototype.restoreGame = function(solution, puzzle, playersGrid){
  this.solution = solution;
  this.puzzle = puzzle;
  this.playersGrid = playersGrid;
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
  var numberOfBlanks = this.SETTINGS[difficulty];
  var i, j;
  var rows = this.solution.length;
  var columns = this.solution[0].length;
  var puzzle = [];

  for(i=0; i < rows; i++){
    for(j=0; j < columns; j++){
      j === 0 ? puzzle.push([]) : null;
      if(Math.random()*100 < numberOfBlanks/81*100){
        puzzle[i].push(this.solution[i][j]);
      }
      else{
        puzzle[i].push(0);
      }
    }
  }
  return puzzle;
}

SudokuGame.prototype.copyPuzzle = function(puzzle){
  var i, j;
  var rows = puzzle.length;
  var columns = puzzle[0].length;
  var copy = [];

  for(i=0; i < rows; i++){
    copy.push([]);
    for(j=0; j < columns; j++){
        copy[i].push(puzzle[i][j]);
    }
  }
  return copy;
}

SudokuGame.prototype.print = function(grid){

  var i, j;
  var rows = grid.length;
  var columns = grid[0].length;
  var printable = "";

  for(i=0; i < rows; i++){
    if(i%3 === 0){
      printable += "- - - - - - - - - - - - \n";
    }
    for(j=0; j < columns; j++){
      if((j)%3 === 0 ){
        printable += "| "
      }
      printable += grid[i][j] + " ";
    }
    printable += "\n";
  }
  console.log(printable);
};

SudokuGame.prototype.isSolved = function(){
  var i, j;
  var rows = this.playersGrid.length;
  var columns = this.playersGrid[0].length;

  for(i=0; i < rows; i++){
    for(j=0; j < columns; j++){
        if(this.playersGrid[i][j] !== this.solution[i][j]){
          return false;
        }
    }
  }
  return true;
};

SudokuGame.prototype.isComplete = function(){
  return this.getEmptyCells(this.playersGrid).length === 0;
};


SudokuGame.prototype.playerInput = function(row, column, guess){
  row = parseInt(row, 10);
  column = parseInt(column, 10);
  var parsedGuess = parseInt(guess, 10);
  if(isNaN(parsedGuess) || parsedGuess <= 0 || parsedGuess >= 10){
    throw {name: "invalidGuess", message: "a number between 1 and 9 is required"};
  }
  this.playersGrid[row][column] = guess;
};

SudokuGame.prototype.getEmptyCells = function(grid){
  var i, j;
  var rows = grid.length;
  var columns = grid[0].length;
  var emptyCells = [];

  for(i=0; i < rows; i++){
    for(j=0; j < columns; j++){
        if(grid[i][j] === 0){
          emptyCells.push([i,j]);
        }
    }
  }
  return emptyCells;
}

SudokuGame.prototype.getPossibleValuesForCell = function(grid, row, column, value){
  var possibleValues = {
        row: row,
        column: column,
        values: {
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
          6: true,
          7: true,
          8: true,
          9: true
        },
        clash: {row: false, column: false, subgrid: false } 
      };
  var valueOfCell = grid[row][column];
  var i, j;
  var peerValue;
  var subGrid = this.whichSubGrid(row, column);
  value = parseInt(value, 10);

  //check row unit
  for(i=0; i < grid[row].length; i++){
    peerValue = grid[row][i]
    possibleValues.values[peerValue] = false;
    if(!possibleValues.clash.row){
      possibleValues.clash.row = peerValue === value ? true : false;
    }
  }

  //check column unit
  for(i=0; i < grid.length; i++){
    peerValue = grid[i][column];
    possibleValues.values[peerValue] = false;
    if(!possibleValues.clash.column){
      possibleValues.clash.column = peerValue === value ? true : false;
    }
  }

  //check inside grid unit
  for(i=subGrid.startRowIndex; i <= subGrid.endRowIndex; i++){
    for(j=subGrid.startColumnIndex; j <= subGrid.endColumnIndex; j++){
      peerValue = grid[i][j];
      possibleValues.values[peerValue] =  false;
      if(!possibleValues.clash.subgrid){
        possibleValues.clash.subgrid = peerValue === value ? true : false;
      }
    }
  }

  delete possibleValues.values[0];

  return possibleValues;
}

SudokuGame.prototype.whichSubGrid = function(row, column){
  var subGrid = {};
  var subGridRow = this.resolveSubGridCoordinate(row);
  var subGridColumn = this.resolveSubGridCoordinate(column);

  subGrid.coordinates = [subGridRow, subGridColumn];
  subGrid.endColumnIndex = subGridColumn*3-1;
  subGrid.startColumnIndex = subGrid.endColumnIndex - 2;
  subGrid.endRowIndex = subGridRow*3-1;
  subGrid.startRowIndex = subGrid.endRowIndex - 2;

  return subGrid;
}

SudokuGame.prototype.resolveSubGridCoordinate = function(rowOrColumn){
  if(rowOrColumn < 3){
    return 1;
  }
  else if(rowOrColumn < 6){
    return 2;
  }
  else if(rowOrColumn < 9){
    return 3;
  }
}

SudokuGame.prototype.giveHint = function(){
  var emptyCells = this.getEmptyCells(this.playersGrid);
  var pickANumber = Math.floor(Math.random()*emptyCells.length);
  
  console.log("emptyCells length...");
  console.log(emptyCells.length);
  console.log(pickANumber);
  if(emptyCells.length > pickANumber){
    var row = emptyCells[pickANumber][0];
    var column = emptyCells[pickANumber][1];

    return {
      row: row,
      column: column,
      hint: this.solution[row][column] 
    };
  }
  else{
    return {hint: null};
  }
}

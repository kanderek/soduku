// Soduku understands the rules for the game of soduku

function SudokuGame(difficulty) {

    this.SETTINGS = {easy: 50, medium: 40, hard: 30};
    this.difficulty = difficulty || "easy";
    this.solution = this.generatePuzzle();
    this.puzzle = this.initializePuzzle(this.difficulty);
    this.playersGrid = this.copyPuzzle(this.puzzle);
}

SudokuGame.prototype.generatePuzzle = function () {

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

    return solution;
};

SudokuGame.prototype.initializePuzzle = function (difficulty) {
    //check is string and key is defined
    var numberOfBlanks = this.SETTINGS[difficulty];
    var i, j;
    var rows = this.solution.length;
    var columns = this.solution[0].length;
    var puzzle = [];

    for(i=0; i < rows; i++){
        puzzle.push([]);
        for(j=0; j < columns; j++){
            if(Math.random()*100 < numberOfBlanks/81*100){
                puzzle[i].push(this.solution[i][j]);
            }
            else{
                puzzle[i].push(0);
            }
        }
    }
    return puzzle;
};

SudokuGame.prototype.copyPuzzle = function (puzzle) {
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
};

SudokuGame.prototype.print = function (grid) {

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
                printable += "| ";
            }
            printable += grid[i][j] + " ";
        }
        printable += "\n";
    }
    console.log(printable);
};

SudokuGame.prototype.isSolved = function () {
    var i, j;
    var rows = this.playersGrid.length;
    var columns = this.playersGrid[0].length;

    for(i=0; i < rows; i++){
        for(j=0; j < columns; j++){
            if(parseInt(this.playersGrid[i][j],10) !== parseInt(this.solution[i][j],10)){
                return false;
            }
        }
    }
    return true;
};

SudokuGame.prototype.isComplete = function () {
    return this.getEmptyCells(this.playersGrid).length === 0;
};


SudokuGame.prototype.playerInput = function (row, column, guess) {
    row = parseInt(row, 10);
    column = parseInt(column, 10);
    var parsedGuess = parseInt(guess, 10);
    // var spaces = /\s*/;
    // console.log(guess);
    // console.log(guess.match(spaces));
    if(guess !== ""){
        if(isNaN(parsedGuess) || parsedGuess <= 0 || parsedGuess >= 10){
          throw {name: "invalidGuess", message: "a number between 1 and 9 is required"};
        }
    }
    this.playersGrid[row][column] = guess === "" ? 0 : guess;
};

SudokuGame.prototype.getPlayersGuesses = function () {
    var gridOfGuesses = [];
    var i, j;

    for(i=0; i<this.puzzle.length; i++){

        gridOfGuesses.push([]);

        for(j=0; j<this.puzzle[i].length; j++){
            gridOfGuesses[i].push(this.playersGrid[i][j]-this.puzzle[i][j]);
        }
    }
    return gridOfGuesses;
};

SudokuGame.prototype.getEmptyCells = function (grid) {
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
};

SudokuGame.prototype.getPossibleValuesForCell = function (grid, row, column, value) {
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
        peerValue = grid[row][i];
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
};

SudokuGame.prototype.whichSubGrid = function (row, column) {
    var subGrid = {};
    var subGridRow = this.resolveSubGridCoordinate(row);
    var subGridColumn = this.resolveSubGridCoordinate(column);

    subGrid.coordinates = [subGridRow, subGridColumn];
    subGrid.endColumnIndex = subGridColumn*3-1;
    subGrid.startColumnIndex = subGrid.endColumnIndex - 2;
    subGrid.endRowIndex = subGridRow*3-1;
    subGrid.startRowIndex = subGrid.endRowIndex - 2;

    return subGrid;
};

SudokuGame.prototype.resolveSubGridCoordinate = function (rowOrColumn) {
    if(rowOrColumn < 3){
        return 1;
    }
    else if(rowOrColumn < 6){
        return 2;
    }
    else if(rowOrColumn < 9){
        return 3;
    }
};

SudokuGame.prototype.giveHint = function () {
    var emptyCells = this.getEmptyCells(this.playersGrid);
    var pickANumber = Math.floor(Math.random()*emptyCells.length);
    var row, column;

    if(emptyCells.length > pickANumber){
        row = emptyCells[pickANumber][0];
        column = emptyCells[pickANumber][1];

        return {
            row: row,
            column: column,
            hint: this.solution[row][column] 
        };
    }
    else{
        return {hint: null};
    }
};


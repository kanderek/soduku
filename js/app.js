
var $sudokuBoard = $("#soduku-board");
var $sudokuRulesBoard = $("#game-rules table");
var sudoku = new SudokuGame("easy");
var timer = new Timer("#timer-1");
var medium = "pen";
var difficulty = "easy";
var showPossibleValues = false;
var showClashes = false;


function saveGame () {
    var savedGame = {};

    savedGame.sudoku = sudoku;
    savedGame.timer = timer;
    savedGame.settings = {
        medium: medium,
        difficulty: difficulty,
        showPossibleValues: showPossibleValues,
        showClashes: showClashes
    };

    localStorage.setItem("savedGame", JSON.stringify(savedGame));
}

function resumeSavedGame(){
    var storedGame = JSON.parse(localStorage.getItem("savedGame"));

    if(storedGame){
        sudoku = storedGame.sudoku;
        sudoku.__proto__ = SudokuGame.prototype;//TODO: do this right
        timer.stop();
        timer = storedGame.timer;
        timer.__proto__ = Timer.prototype;//TODO: do this right
        medium = storedGame.settings.medium;
        difficulty = storedGame.settings.difficulty;
        showPossibleValues = storedGame.settings.showPossibleValues;
        showClashes = storedGame.settings.showClashes;
        console.log("resuming saved game...");

        restoreUI();

        return true;
    }
    else{
        //no saved game in local storage
        return false;
    }
}

function restoreUI(){
    console.log("restoring UI...");
    drawPuzzleDom(sudoku.playersGrid);
    disableCells();
    styleGuessCells(medium);
    // clearConflictHighlights();
    markConflicts();
    timer.refreshTimeDom();
    if(timer.isStopped){
        timer.stop();
    }
    else{
        timer.start();
    }
    $("#game-settings-options .possible-values").prop("checked", showPossibleValues);
    $("#game-settings-options .highlight-clashes").prop("checked", showClashes);
    $("#pallete input[value='"+medium + "']").prop("checked", true);
    $("#game-details .difficulty").html(difficulty);
}

var maintainAspectRatio = function($element){
    $element.css("height", $element.width());
};

$(document).on("load", (function(){
    //initializing function calls
    maintainAspectRatio($sudokuBoard);
    drawPuzzleDom(sudoku.puzzle);
    disableCells();
    timer.start();
})());

$(window).resize(function(){
    maintainAspectRatio($sudokuBoard);
    maintainAspectRatio($sudokuRulesBoard);
});

// Widget Event handlers (TODO: consolidate events)

$("#game-rules").on("click", function(event){
    var target = event.target ? event.target : event.srcElement;
    switch(target.className){
        case "game-rules-modal": 
            $("#game-rules").hide();
            break;
        case "close-rules-modal": 
            $("#game-rules").hide();
            break;
        case "play-game":
            newPuzzle(difficulty);
            $("#game-rules").hide();
            break;
    }
});

$(".game-menu li").on("click", function(event){
    var target = event.target ? event.target : event.srcElement;
    switch(target.className){
        case "select-new-puzzle": 
            $("#game-settings-options").hide();
            $("#select-puzzle-options").toggle(); 
            break;
        case "game-settings": 
            $("#select-puzzle-options").hide();
            $("#game-settings-options").toggle();
            break;
    }
});

$("#game-settings-options").on("click", function(event){
    var target = event.target ? event.target : event.srcElement;

    switch(target.className){
        case "game-rules": 
            $("#game-settings-options").hide();
            $("#game-rules").show();
            maintainAspectRatio($sudokuRulesBoard);
            break;
        case "possible-values": 
            showPossibleValues = target.checked;
            drawPuzzleDom(sudoku.playersGrid);
            break;
        case "highlight-clashes":
            showClashes = target.checked;
            break;
    }
});

$("#select-puzzle-options").on("click", function (event) {
    var target = event.target ? event.target : event.srcElement;

    difficulty = target.value;
    newPuzzle(difficulty);
    $(this).hide();
});

function newPuzzle (selectedDifficulty) {
    sudoku = new SudokuGame(selectedDifficulty);
    drawPuzzleDom(sudoku.puzzle);
    disableCells();
    clearConflictHighlights();
    $("#game-details .difficulty").html(difficulty);
    timer.reset();
}

$("#hint").on("click", function (event) {
    var hintInfo = sudoku.giveHint();

    if(hintInfo.hint){
        inputCellDom(hintInfo.row, hintInfo.column, hintInfo.hint, "show-hint");
        sudoku.playerInput(hintInfo.row, hintInfo.column, hintInfo.hint);
    }
    drawPuzzleDom(sudoku.playersGrid);
});

$("#timer-1").on("click", function (event) {
    var target = event.target ? event.target : event.srcElement;

    if(target.className === "toggle"){
        if(target.checked){
            timer.start();
        }
        else{
            timer.stop();
        }
    }
    else if(target.className === "close-timer"){
        $("#timer-1 .timer").hide();
        $("#timer-1 .show-timer").show();
    }
    else if(target.className === "show-timer"){
        $("#timer-1 .show-timer").hide();
        $("#timer-1 .timer").show();
    }
});

$("#pallete .toggle-select").on("click", function (event) {
    var target = event.target ? event.target : event.srcElement;
    medium = target.value;
});

$sudokuBoard.on("focusin", function (event) {
    var target = event.target ? event.target : event.srcElement;
    $(target).removeClass().addClass(medium);
});

$sudokuBoard.on("change", function (event) {
    var $target = event.target ? $(event.target) : $(event.srcElement);
    var newCellValue = $target.val();
    var cell = $target.attr("data-cell").split(",");
    var row = cell[0];
    var column = cell[1];
    var possibleValues;
    var previousCellValue;

    $target.removeClass().addClass(medium);

    try {
        if(showClashes){
          possibleValues = sudoku.getPossibleValuesForCell(sudoku.playersGrid, row, column, newCellValue);
          highlightClash(possibleValues.clash, row, column);
        }
        sudoku.playerInput(row, column, newCellValue);
        markConflicts();
        drawPuzzleDom(sudoku.playersGrid);//causes a required to be added to the changed cell

        if(sudoku.isComplete()){
            if(sudoku.isSolved()){
                console.log("puzzle solved");
                weHaveAWinner();
            }
        }
    }
    catch(error){
        previousCellValue = formatCellValue(cell[0], cell[1]);
        $target.val(previousCellValue);
        console.log(error);
        //notify player of invalid entry
    }
});

function formatCellValue(row, column){
    var cellValue = sudoku.playersGrid[row][column];
    cellValue = cellValue === 0 ? " " : cellValue;

    return cellValue;
}

//HTML5 Number input doesn't log validation errors
$sudokuBoard.on("focusout", function(event){
    var target = event.target ? event.target : event.srcElement;
    var cell;
    var previousCellValue;

    if(!target.checkValidity()){
        cell = target.dataset.cell.split(",");
        previousCellValue = formatCellValue(cell[0], cell[1]);
        $(target).val(previousCellValue);

        throw {name: "invalidGuess", message: "a number between 1 and 9 is required"};
    }
    else{
        $target = $(target);
        if($target.val() === ""){
            $target.removeClass();
        }
    }
});

// END event handlers

function inputCellDom(row, column, value, className){
    $("td input").each(function(index, cell){
        var cellLocation = $(this).attr("data-cell").split(",");

        if(cellLocation[0] == row && cellLocation[1] == column){
            $(this).val(value);
            if(className){
                $(this).removeClass().addClass(className);
            }
        }
    });
}

function drawPuzzleDom(puzzle){
  $("td input").each(function(index, cell){
    var cellLocation = $(this).attr("data-cell").split(",");
    var row = cellLocation[0];
    var column = cellLocation[1];
    var value = puzzle[row][column];
    var possibleValues = showPossibleValues ? sudoku.getPossibleValuesForCell(puzzle, row, column) : {};

    $(this).parent().removeClass().addClass("cell");
    $(this).parent().css({"background-color": ""});
    $(this).siblings("h1").remove();
    $(this).next().empty();

    if(value === 0){
      value = " ";

      for(var possibleValue in possibleValues.values){
        if(possibleValues.values[possibleValue]){
          $(this).next().append(possibleValue);
        }
      }
    }
    $(this).val(value);
  });
}

function styleGuessCells(cellClass){
    var cellLocation;
    var row, column;
    var playerGuesses;

    $("td input").each(function (index, cell) {
        cellLocation = $(this).attr("data-cell").split(",");
        row = cellLocation[0];
        column = cellLocation[1];
        playerGuesses = sudoku.getPlayersGuesses();

        if(playerGuesses[row][column] !== 0){
            if(cellClass){
                $(this).removeClass().addClass(cellClass);
            }
            else{
                $(this).removeClass();
            }
        }
    });
}

function disableCells(){
    var cellLocation;
    var row, column;
    var disabled;

    $("td input").each(function(index, cell){
        cellLocation = $(this).attr("data-cell").split(",");
        row = cellLocation[0];
        column = cellLocation[1];
        disabled = true;

        if(sudoku.puzzle[row][column] === 0){
            disabled = false;
        }
        // $(this).parent().parent().removeClass();
        $(this).attr("disabled", disabled);
        $(this).removeClass();
    });
}

function markConflicts(){
    var guessesGrid = sudoku.getPlayersGuesses();
    var cellLocation;
    var row, column;
    var conflicts;
    var value;

    $("td input").each(function(index, cell){
        cellLocation = $(this).attr("data-cell").split(",");
        row = cellLocation[0];
        column = cellLocation[1];
        value = guessesGrid[row][column];

        //REFACTOR!
        if(value !== 0){
            conflicts = sudoku.getPossibleValuesForCell(sudoku.playersGrid, row, column, value).clash;

            if(conflicts.row || conflicts.column || conflicts.subgrid){
                $(this).next().removeClass().addClass("hint-overlay conflict");
            }
            else{
                $(this).next().removeClass().addClass("hint-overlay");
            }
        }
        else{
          $(this).next().removeClass().addClass("hint-overlay");
        }
    });
}

function highlightClash(typeOfClash, row, column){ 
    var subgrid = sudoku.whichSubGrid(row, column);
    var cellLocation;
    var currentRow, currentColumn;
    var $tdSudokuSquare;

    $("td input").each(function(index, cell){
        cellLocation = $(this).attr("data-cell").split(",");
        currentRow = cellLocation[0];
        currentColumn = cellLocation[1];
        $tdSudokuSquare = $(this).parent().parent();

        $tdSudokuSquare.removeClass();

        if(typeOfClash.row && row === currentRow){
            $tdSudokuSquare.addClass("clash");
        }

        if(typeOfClash.column && column === currentColumn){
            $tdSudokuSquare.addClass("clash");
        }

        if(typeOfClash.subgrid && currentRow>= subgrid.startRowIndex && currentRow <= subgrid.endRowIndex &&
            currentColumn >= subgrid.startColumnIndex && currentColumn <= subgrid.endColumnIndex){
            $tdSudokuSquare.addClass("clash");
        }
    });
}

function clearConflictHighlights(){
    $("td input").each(function(index, cell){
        $(this).parent().parent().removeClass();
        $(this).next().removeClass().addClass("hint-overlay");
    });
}

//REFACTOR - REDESIGN!
function weHaveAWinner(){
    var message = "GOOD JOB!";
    var colors2 = [
    "rgba(194,22,23,",
    "rgba(212,40,25,",
    "rgba(235,64,29,",
    "rgba(253,82,31,",
    "rgba(254,117,22,",
    "rgba(254,163,9,",
    "rgba(255,198,0,",
    "rgba(181,179,26,",
    "rgba(84,155,60,",
    "rgba(10,136,86,",
    "rgba(6,126,106,",
    "rgba(2,116,127,",
    "rgba(0,111,137,",
    "rgba(48,95,131,",
    "rgba(112,75,123,",
    "rgba(160,59,117,",
    "rgba(154,54,89,"
    ];

    // $("td input").each(function(index, cell){
    // var red = Math.round(Math.random()*255);
    // var green = Math.round(Math.random()*255);
    // var blue = Math.round(Math.random()*255);
    // var alpha = Math.random();
    // var rgba = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    var allDone = false;
    var countdown = 1000;
    var visitCount;
    var visited = {};
    var cellNumber;
    var $thisCell;

    while(!allDone && countdown > 0){
        visitCount = 0;
        cellNumber = Math.round(Math.random()*81);
        visited[cellNumber] = true;
        $thisCell = $("td input").eq(cellNumber);

        var color = colors2[Math.floor(colors2.length*Math.random())];
        color += 0.8 + ")";//Math.random() + ")";
        // console.log(color);
        // $(this).attr("disabled", true).val("");
        $thisCell.attr("disabled", true).val("");
        // var that = this;
        setTimeout((function(cell, index, cellColor){
            // $(that).parent().addClass("win");
            // $(that).parent().append("<h1>" + message[index%9] + "</h1>");
            // $(that).parent().css({"background-color": color});
            return function(){
                cell.parent().removeClass("win").addClass("win");
                cell.parent().append("<h1>" + message[index%9] + "</h1>");
                cell.parent().css({"background-color": cellColor});
            };
        })($thisCell, cellNumber, color), 500);

        for(var i=0; i<81; i++){
            if(visited[i]){
                visitCount += 1;
            }
        }
        if(visitCount === 81){
            allDone = true;
        }
        countdown -= 1;
    }
  // });
}
var $sudokuBoard = $("#soduku-board");
var $sudokuRulesBoard = $("#game-rules table");
var sudoku = new SudokuGame("easy");
var puzzle;
var timer = new Timer("#timer-1");
var medium = "pen";
var difficulty = "easy";
var showPossibleValues = false;
var showClashes = false;

var maintainAspectRatio = function($element){
  $element.css("height", $element.width());
}

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
      console.log("clicked on game-rules-modal");
      $("#game-rules").hide();
      break;
    case "close-rules-modal": 
      console.log("clicked on close rules modal");
      $("#game-rules").hide();
      break;
    case "play-game":
      console.log("start a new game");
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
      $("#select-puzzle-options").hide()
      $("#game-settings-options").toggle();
      break;
  }
});

$("#game-settings-options").on("click", function(event){
  var target = event.target ? event.target : event.srcElement;
  // console.log(target);
  // console.log(target.className);
  switch(target.className){
    case "game-rules": 
      console.log("bring up game rules");
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

$("#select-puzzle-options").on("click", function(event){
  var target = event.target ? event.target : event.srcElement;
  difficulty = target.value;
  newPuzzle(difficulty);
  $(this).hide();
})

function newPuzzle(selectedDifficulty){
  sudoku = new SudokuGame(selectedDifficulty);
  drawPuzzleDom(sudoku.puzzle);
  disableCells();
  $("#game-details .difficulty").html(difficulty);
  timer.reset();
}

$("#hint").on("click", function(event){
  var hintInfo = sudoku.giveHint();
  if(hintInfo.hint){
    inputCellDom(hintInfo.row, hintInfo.column, hintInfo.hint, "show-hint");
    sudoku.playerInput(hintInfo.row, hintInfo.column, hintInfo.hint);
  }
  drawPuzzleDom(sudoku.playersGrid);
  // console.log(hintInfo);
  // console.log(sudoku.print(sudoku.playersGrid));
})

$("#timer-1").on("click", function(event){
  var target = event.target ? event.target : event.srcElement;
  if(target.className === "toggle"){
    target.checked ? timer.start() : timer.stop();
  }
  else if(target.className === "close-timer"){
    console.log("close timer clicked");
    $("#timer-1 .timer").hide();
    $("#timer-1 .show-timer").show();
  }
  else if(target.className === "show-timer"){
    console.log("show timer clicked");
    $("#timer-1 .show-timer").hide();
    $("#timer-1 .timer").show();
  }
});

$("#pallete .toggle-select").on("click", function(event){
  var target = event.target ? event.target : event.srcElement;
  medium = target.value;
});

$sudokuBoard.on("focusin", function(event){
  var target = event.target ? event.target : event.srcElement;
  $(target).removeClass().addClass(medium);
});

$sudokuBoard.on("change", function(event){
  console.log("cell value changed...");
  var $target = event.target ? $(event.target) : $(event.srcElement);
  var newCellValue = $target.val();
  var cell = $target.attr("data-cell").split(",");
  var row = cell[0];
  var column = cell[1];

  $target.removeClass().addClass(medium);
  // console.log(event.target.dataset.cell);
  //validate value of cell 
  try {
    if(showClashes){
      var possibleValues = sudoku.getPossibleValuesForCell(sudoku.playersGrid, row, column, newCellValue);
      highlightClash(possibleValues.clash, row, column);
    }
    sudoku.playerInput(row, column, newCellValue);
    markConflicts();
    drawPuzzleDom(sudoku.playersGrid);//causes a required to be added to the changed cell

    if(sudoku.isComplete()){
      if(sudoku.isSolved()){
        console.log("puzzle solved");
      }
      else{
        console.log("puzzle not solved..where to notify")
      }
    }
  }
  catch(error){
    var previousCellValue = formatCellValue(cell[0], cell[1]);
    $target.val(previousCellValue);
    console.log(error);
  //   //notify player of invalid entry
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
  if(!target.checkValidity()){
    var cell = target.dataset.cell.split(",");
    var previousCellValue = formatCellValue(cell[0], cell[1]);
    $(target).val(previousCellValue);
    
    throw {name: "invalidGuess", message: "a number between 1 and 9 is required"};
  }
  else{
    $target = $(target);
    $target.val() == "" ? $target.removeClass() : null;
  }

});

// END event handlers

function inputCellDom(row, column, value, className){
  $("td input").each(function(index, cell){
    var cellLocation = $(this).attr("data-cell").split(",");

    if(cellLocation[0] == row && cellLocation[1] == column){
      $(this).val(value);
      className ? $(this).removeClass().addClass(className) : null;
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

    $(this).next().empty();

    if(value === 0){
      value = " ";

      for(possibleValue in possibleValues.values){
        if(possibleValues.values[possibleValue]){
          $(this).next().append(possibleValue);
        }
      }
    }

    $(this).val(value);
    
  });
}

function disableCells(){
  $("td input").each(function(index, cell){
    var cellLocation = $(this).attr("data-cell").split(",");
    var row = cellLocation[0];
    var column = cellLocation[1];
    var disabled = true;

    if(sudoku.puzzle[row][column] == 0){
      disabled = false;
    }

    $(this).removeClass();
    // $(this).parent().parent().removeClass();
    $(this).attr("disabled", disabled);
  });
}

function markConflicts(){
  var guessesGrid = sudoku.getPlayersGuesses();

  $("td input").each(function(index, cell){
    var cellLocation = $(this).attr("data-cell").split(",");
    var row = cellLocation[0];
    var column = cellLocation[1];
    var conflicts;
    var value = guessesGrid[row][column];

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
  
  $("td input").each(function(index, cell){
    var cellLocation = $(this).attr("data-cell").split(",");
    var currentRow = cellLocation[0];
    var currentColumn = cellLocation[1];
    var $tdSudokuSquare = $(this).parent().parent();

    $tdSudokuSquare.removeClass();

    if(typeOfClash.row && row === currentRow){
      $tdSudokuSquare.addClass("clash");
    }

    if(typeOfClash.column && column === currentColumn){
      $tdSudokuSquare.addClass("clash");
    }

    if(typeOfClash.subgrid && currentRow>= subgrid.startRowIndex && currentRow <= subgrid.endRowIndex 
       && currentColumn >= subgrid.startColumnIndex && currentColumn <= subgrid.endColumnIndex){
       $tdSudokuSquare.addClass("clash");
    }

  });
}
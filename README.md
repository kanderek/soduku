# Sudoku Times

A simply complex game of sudoku for the web and mobile web.

## Structure of Application 

This version of sudoku is a single page application that utilizes basic web technologies (HTML, CSS, JavaScript). The appliacation logic is seperated out into two major sections. The first section represents the 'class' objects that represent aspects of the game. One is a fairly complex SudokuGame object which holds the logic for playing the game of sudoku. The second is a much simpler object which represents a stop/start timer for keeping track of time while a player is solving a sudoku puzzle. The second section is the wiring which heavily utilizes Jquery to connect the form/input elements in the html to instantiated SudokuGame and Timer objects to play a game. 

Unit testing is performed using Jasmine. Basic tests are written for the Timer object and SudokuGame object. With the help of Grunt these tests can be run as part of a build stage or alone.  

## Technologies Utilized

HTML5, CSS3, Sass/Compass, JavaScript, Jquery, Jasmine, Grunt

## Reasoning behind technical choices

The objects for the SudokuGame and Timer were seperated from any DOM manipulation/interaction as possible so testing would be easier. This also gave clearer roles to each chunk of code. The code for each object, especially the app.js (representing the UI manipulations and interactions) and the SudokuGame evolved and grew as I defined new features for the game. The features were defined arbitrarily based on my fancy but would ideally be tested by lovers of sudoku to see if they make sense and are easy to use. 

I employed Sass/Compass to simply embed the icon images into the CSS. I used Grunt to minify the CSS and JavaScript (after a combine step). These efforts were made to minimize the number of http requests. In further revisions setting up the files/server to utilize the gzip content-type would improve load times further.  

## Trade-offs/changes pending

I focused a lot on getting the application logic working and ensuring I had some test coverage and a basic build workflow set up. This meant spending less time on the visual aspect of the game. The layout is consistent and implemented according to plan, but the styles could use some massagine, font choice, colors and some of the responsize stylings could be improved. 

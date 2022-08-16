/*  A simple Tic-Tac-Toe game
Players 'X' and 'O' take turn inputing their position on the command line using numbers 1-9
1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9
*/

// importing user import library
// missed ({sigint: true});
const prompt = require('prompt-sync')({sigint: true});

let board = {
    1: ' ', 2: ' ', 3: ' ',
    4: ' ', 5: ' ', 6: ' ',
    7: ' ', 8: ' ', 9: ' '
};

// TODO: update the gameboard with the user input
function markBoard(position, mark) {
    // console.log('position: ' + position + '; mark: ' + mark);
    board[position] = mark;
}

// TODO: print the game board as described at the top of this code skeleton
function printBoard() {
    // deep copy as object is passed by reference
    let copiedBoard = JSON.parse(JSON.stringify(board));
    // len = 9;
    let len = Object.keys(board).length;
    let keys = Object.keys(board)
    let boardValues = ''

    for (let i = 1; i <= len; i++) {
        if (copiedBoard[i] === ' ') {
            copiedBoard[i] = keys[i-1];
        }
        // append all values
        boardValues = boardValues + '' + copiedBoard[i];
        
        // board
        if (i % 3 != 0) {
            boardValues += ' | '
        }
        if (i % 3 == 0 && i != len) {
            boardValues += "\n----------\n";
        }
    }
    console.log(boardValues)
}


// TODO: check for wrong input, this function should return true or false.
// true denoting that the user input is correct
// you will need to check for wrong input (user is entering invalid position) or position is out of bound
// another case is that the position is already occupied
function validateMove(position) {
    const validInput = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let isValidate = false;

    if (typeof position !== 'string') {position = String(position);}
    // check if the input is within 1-9
    // check if the input already exists, if exists then not validate
    if (validInput.includes(position) && board[position] === ' ') {
        isValidate = true;
    }
    return isValidate
}

// TODO: list out all the combinations of winning, you will neeed this
// one of the winning combinations is already done for you
let winCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

// TODO: implement a logic to check if the previous winner just win
// This method should return with true or false
function checkWin(player) {
    let isWin = true;
    let boardValues = Object.values(board);
    // index+1 to match the winCombinations, make sure all >= 1, type is number
    let filledKeys = boardValues.map((element, i) => {
        if (element === player) {return i+1};
    }).filter(element => element >= 1)

    for (let i = 0; i < winCombinations.length; i++) {
        if (winCombinations[i].every(element => filledKeys.includes(element))) {
            isWin = true;
            break;
        } else {
            isWin = false;
        }
    }
    return isWin
}

// TODO: implement a function to check if the game board is already full
// For tic-tac-toe, tie bascially means the whole board is already occupied
// This function should return with boolean
function checkFull() {
    let currentFilledPosition = Object.values(board).map(
        (element, i) => {
            if (element !== ' ') {return i+1;}
        }).filter(element => element !== undefined)
    // console.log('Board keys length: ' + Object.keys(board).length)
    // console.log('Current board length: ' + currentFilledPosition.length)
    return currentFilledPosition.length === Object.keys(board).length
}

// *****************************************************
// Copy all your code/fucntions in Part 1 to above lines
// (Without Test Cases)
// *****************************************************


// TODO: the main part of the program
// This part should handle prompting the users to put in their next step, checking for winning or tie, etc
function playTurn(player) {
    let playerInput = prompt(`${player}'s turn, input: `);
    let isFulled = checkFull();
    let isValidate = false;
    let isWin = false;

    if (!isFulled) {
        isValidate = validateMove(playerInput);
        if (isValidate) {
            markBoard(playerInput, player);
            printBoard();
            isWin = checkWin(player);
            isFulled = checkFull();
            // if (isWin) {
            //     isWin = true;
            // }
        } else {
            // not validated
            printBoard();
        }
    }

    let status = {
        'currentPlayer': player,
        'isFulled': isFulled,
        'isValidate': isValidate,
        'isWin': isWin,
    }
    return status

}

// self added, to make the board cleared
const boardCopy = JSON.parse(JSON.stringify(board));

function clearboard(){
    // for (let key in board) {
    //     board[key] = ' ';
    // }
    board = JSON.parse(JSON.stringify(boardCopy));
}

// entry point of the whole program
let playAgain = true;
let restartGame = '';
do {
    console.log('Game started: \n\n' +
        ' 1 | 2 | 3 \n' +
        ' --------- \n' +
        ' 4 | 5 | 6 \n' +
        ' --------- \n' +
        ' 7 | 8 | 9 \n');

    let winnerIdentified = false
    let currentTurnPlayer = 'X'     // or 'O'
    let currentStatus = undefined;
    

    // make sure the board is cleared before play game
    clearboard()
    while (!winnerIdentified){
        currentStatus = playTurn(currentTurnPlayer);
        // feel free to add logic here if needed, e.g. announcing winner or tie
        // console.log(currentStatus);
        if (currentStatus.isValidate) {
            if (currentStatus.isWin) {
                winnerIdentified = true;
                console.log(`Player ${currentStatus.currentPlayer} wins!`);
            } else {
                if (!currentStatus.isFulled) {
                    // next turn
                    if (currentStatus.currentPlayer === 'X') {currentTurnPlayer = 'O';} else {currentTurnPlayer = 'X';}
                } else {
                    // end game or restart game
                    console.log('The board is fully occupied! It is a Tie! Please start a new game or stop.');
                    break;
                }
            }
        } else {
            console.log(`The player ${currentStatus.currentPlayer}'s input is invalid (either the input position is already occupied / invalid input position / out of bound input position). Please reenter a valid input.`)
        }
    }
    restartGame = prompt('Do you want to restart the game [y/n]? ')
    if (restartGame.toLowerCase() == 'y' || restartGame.toLowerCase() == 'yes' || restartGame.toLowerCase() == '1') {playAgain = true;} 
    else {playAgain = false;}
} while (playAgain)



// Bonus Point: Implement the feature for the user to restart the game after a tie or game over

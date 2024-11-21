import { showBoard, updateCell, state } from './board.js';
import { applyFallAnimation } from './animations.js';


// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard();
    setupBoardEventListeners();
    resetActivePlayer();

    const newGameButton = document.getElementById("newGame");
    newGameButton.addEventListener('click', () => handleNewGameClick());
});

function setupBoardEventListeners() {
    const boardElement = document.getElementById("board");

    boardElement.addEventListener('click', (event) => {
        const cellDiv = event.target.closest('.field');
        if (!cellDiv) return;

        const colIndex = Array.from(cellDiv.parentElement.children).indexOf(cellDiv);
        const rowIndex = Array.from(boardElement.children).indexOf(cellDiv.parentElement);

        handleCellClick(rowIndex, colIndex);
    });
}

/**
 * handles the click event on a cell
 * highest empty cell in the row gets filled if possible
 * 
 * @param rowIndex
 * @param colIndex
 */
function handleCellClick(rowIndex, colIndex) {

    const highestEmptyRow = getHighestEmptyRow(colIndex);
    
    if (highestEmptyRow !== -1) {
        state.board[highestEmptyRow][colIndex] = state.players[state.currentPlayerIndex];
        updateCell(highestEmptyRow, colIndex)

        state.currentPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
        updateActivePlayer();
    }
}

/**
 * This function is used to get the highest empty row in a column by looping through the board state.
 * 
 * @param colIndex
 * @returns {number}
 */
function getHighestEmptyRow(colIndex) {
    for (let rowIndex = state.board.length - 1; rowIndex >= 0; rowIndex--) {
        if (state.board[rowIndex][colIndex] === '') {
            return rowIndex;
        }
    }
    return -1;
}



/**
 * This function is used to empty the board by applying the fall animation to each piece in the board.
 * It loops through the board state and applies the fall animation to each piece in the board.
 * 
 * @param boardElement
 * @returns {number}
 */
function emptyBoard(boardElement) {
    const pieces = Array.from(boardElement.children).map(row => Array.from(row.children).map(cell => cell.querySelector('.piece')));

    let adjustedDelay = 0;

    // Skip leading empty columns
    for (let colIndex = 0; colIndex < 7; colIndex++) {
        const columnHasPieces = pieces.some(row => row[colIndex]);
        if (!columnHasPieces) continue;

        // Apply fall animation to each piece in the column
        for (let rowIndex = 5; rowIndex >= 0; rowIndex--) {
            applyFallAnimation(pieces, colIndex, rowIndex, adjustedDelay);
        }
        adjustedDelay += 100;
    }
    return adjustedDelay;
}

/**
 * This function is used to handle the click event on the new game button.
 * It empties the board and resets the board state to start a new game.
 * It also updates the active player to the first player.
 */
function handleNewGameClick() {
    const boardElement = document.getElementById("board");

    // Disable all clicks and prevent scrolling during the animation
    boardElement.classList.add('disable-clicks');
    document.body.style.overflow = 'hidden';
    
    let adjustedDelay = emptyBoard(boardElement);

    // Wait for the longest animation to finish before resetting the board
    const animationDuration = 1000 + adjustedDelay ;
    setTimeout(() => {
        state.board = Array(6).fill(null).map(() => Array(7).fill(''));
        state.currentPlayerIndex = 1;
        showBoard();
        resetActivePlayer();

        boardElement.classList.remove('disable-clicks');
        document.body.style.overflow = '';
    }, animationDuration);
}

/**
 * This function is used to update the scoreboard based on the current player index.
 * It basically swaps the active class between the player elements.
 */
function updateActivePlayer() {
    const players = [document.querySelector('#player1'), document.querySelector('#player2')];
    
    players.forEach((player, index) => {
        player.classList.toggle('active-player', index === state.currentPlayerIndex);
    });
}

/**
 * This function is used to reset the active player to the first player.
 */
function resetActivePlayer() {
    state.currentPlayerIndex = 0;
    updateActivePlayer();
}





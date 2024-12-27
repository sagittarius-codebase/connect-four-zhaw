import {showBoard, updateCell} from './board.js';
import {applyFallAnimation} from './animations.js';
import {setInList, setInObj, checkIfWinner} from "./utils.js";

const emptyBoardState = Array(6).fill(null).map(() => Array(7).fill(''));

// The game state
let state = {
    board: structuredClone(emptyBoardState),
    players: [{id: 1, name: 'Player 1'}, {id: 2, name: 'Player 2'}],
    currentPlayerIndex: 1
};

// the game state sequence
let stateSeq = [];

// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard(state);
    setupBoardEventListeners();
    resetActivePlayer();

    const newGameButton = document.getElementById("newGame");
    newGameButton.addEventListener('click', () => handleNewGameClick());
    
    const stepBackButton = document.getElementById("stepBack");
    stepBackButton.addEventListener('click', () => handleStepBackClick());

    const loadStateButton = document.getElementById("loadState");
    loadStateButton.addEventListener('click', () => loadState());

    const saveStateButton = document.getElementById("saveState");
    saveStateButton.addEventListener('click', () => saveState());
});

/**
 * This function is used to set up the event listeners for the board (app).
 * It adds a click event listener to the board element and handles the cell click event.
 */
function setupBoardEventListeners() {
    const boardElement = document.getElementById("app");
    
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
        stateSeq.push(state);
        let newRow = setInList(state.board[highestEmptyRow], colIndex, state.players[state.currentPlayerIndex]);
        state = setInObj(state, 'board', setInList(state.board, highestEmptyRow, newRow));
        const cell = updateCell(state, highestEmptyRow, colIndex);
        
        cell.addEventListener("animationend", () => {
            checkForWinner();
        }, { once: true });
        
        let nextPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
        state = setInObj(state, 'currentPlayerIndex', nextPlayerIndex);
        
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
    const animationDuration = 1000 + adjustedDelay;
    setTimeout(() => {
        state.board = structuredClone(emptyBoardState);
        state.currentPlayerIndex = 1;
        boardElement.innerHTML = '';

        showBoard(state);
        resetActivePlayer();

        boardElement.classList.remove('disable-clicks');
        document.body.style.overflow = '';
    }, animationDuration);
}

function handleStepBackClick() {
    if (stateSeq.length > 0) {
        state = stateSeq.pop(); // Restore the last state
        showBoard(state);
        updateActivePlayer();
    } else {
        alert("No more steps to undo!");
    }
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

/**
 * This function is used to check for a winner after each move.
 */
function checkForWinner() {

    for (let i = 0; i < 2; i++) {
        if (checkIfWinner(state.players[i], state)) {
            alert(`Player ${state.players[i].id} wins!`);
            return;
        }
    }
}

/**
 * This function is used to load the state from the local storage.
 * It then updates the board based on the loaded state.
 * If the board is non-empty, it asks for confirmation before loading a new state.
 */
function loadState() {

    if (!confirmStateLoad()) return;

    try {

        const data = fetchSavedState();
        if (!data) {
            console.error("No saved state found.");
            alert("No saved state found.");
            return;
        }

        initializeState(data);
        animateBoardFromState(data);

    } catch (error) {
        handleLoadError(error);
    }
}

/**
 * Confirm if the user wants to load a new state if the board is non-empty.
 * @returns {boolean} true if loading should proceed, false otherwise.
 */
function confirmStateLoad() {
    if (state.board.flat().some(cell => cell !== '')) {
        return confirm("There is already a game in progress. Do you want to load a new game?\nCurrent progress will be lost.");
    }
    return true;
}

/**
 * Fetch the saved state from localStorage.
 * @returns {Object|null} The saved game state, or null if none found.
 */
function fetchSavedState() {
    const rawData = localStorage.getItem('connect4State');
    return rawData ? JSON.parse(rawData) : null;
}

/**
 * Initialize the state with the loaded data.
 * @param {Object} data - The saved state to initialize.
 */
function initializeState(data) {
    state = structuredClone(data);
    state.board = structuredClone(emptyBoardState);
    showBoard(state);
}

/**
 * Animate the board state based on the loaded data.
 * @param {Object} data - The saved state containing board data.
 */
function animateBoardFromState(data) {
    let activeAnimations = 0;

    data.board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== '') {
                activeAnimations++;
                scheduleAnimation(rowIndex, colIndex, cell, () => {
                    activeAnimations--;
                    if (activeAnimations === 0) checkForWinner();
                });
            }
        });
    });
}

/**
 * Schedule an animation for a given cell.
 * @param {number} rowIndex - The row index of the cell.
 * @param {number} colIndex - The column index of the cell.
 * @param {Object} cell - The cell data containing the player's ID.
 * @param {Function} onAnimationEnd - Callback to execute when the animation ends.
 */
function scheduleAnimation(rowIndex, colIndex, cell, onAnimationEnd) {
    setTimeout(() => {
        state.board[rowIndex][colIndex] = state.players[cell.id - 1];
        const updatedCell = updateCell(state, rowIndex, colIndex);
        updateActivePlayer();

        updatedCell.addEventListener("animationend", onAnimationEnd, { once: true });
    }, (6 - rowIndex) * 100 + colIndex * 200); // Add delays for row and column
}


/**
 * Handle errors that occur during the loading process.
 * @param {Error} error - The error object to handle.
 */
function handleLoadError(error) {
    console.error('Failed to load state from LocalStorage:', error);
    alert('Failed to load the game state.');
}


/**
 * Save the current state to the local storage
 */
function saveState() {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('connect4State', serializedState);
        alert('Game state saved successfully!');
    } catch (error) {
        console.error('Failed to save state to LocalStorage:', error);
        alert('Failed to save the game state.');
    }
}



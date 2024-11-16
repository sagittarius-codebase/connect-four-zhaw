const player1 = {id: 1, name: 'Player 1'};
const player2 = {id: 2, name: 'Player 2'};

// The game state
let state = {
    board: Array(6).fill(null).map(() => Array(7).fill('')), // 6x7 board
    players: [player1, player2],
    currentPlayerIndex: 1
};


/**
 * This function is used to show the current state of the board.
 * It calls the elt function to create new elements and append them to the board element.
 * It loops through the board state and creates div elements for each cell in the board.
 *
 * If the cell contains a piece, it creates a div element for the piece and appends it to the cell div.
 */
function showBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear existing board

    // Loop through the board state to create cells
    state.board.forEach((row, rowIndex) => {
        let rowDiv = elt("div", {class: "row"});

        row.forEach((cell, colIndex) => {
            let cellDiv = elt("div", {class: "field"});

            // onClick event listener
            cellDiv.addEventListener('click', () => handleCellClick(rowIndex, colIndex));

            if (cell) {
                let pieceDiv = elt("div", {class: `piece player${cell.id}`});
                cellDiv.appendChild(pieceDiv);
            }

            rowDiv.appendChild(cellDiv);
        });

        boardElement.appendChild(rowDiv);
    });
}

/**
 * only updates given cell instead of updating the whole board -> performance improvement
 * 
 * @param rowIndex
 * @param colIndex
 */
function updateCell(rowIndex, colIndex) {
    const boardElement = document.getElementById("board");
    const rowElement = boardElement.children[rowIndex];
    const cellElement = rowElement.children[colIndex];

    const cell = state.board[rowIndex][colIndex];
    if (cell) {
        const pieceDiv = elt("div", {class: `piece player${cell.id} piece-fall` });
        cellElement.appendChild(pieceDiv);
    }
}


/**
 * This function is used to create a new element with the given type, attributes and children.
 *
 * @param {string} type - The type of the element to create
 * @param {object} attrs - An object containing the attributes to set on the created element
 * @param {...HTMLElement|string} children - The children to append to the created element
 * @returns {HTMLElement}
 */
function elt(type, attrs, ...children) {
    let node = document.createElement(type);

    // Loop through the attributes object and set attributes on the created element
    Object.keys(attrs).forEach(key => {
        node.setAttribute(key, attrs[key]);
    });

    // Loop through the children array and append them to the created element
    for (let child of children) {
        if (typeof child != "string") {
            node.appendChild(child);
        } else {
            node.appendChild(document.createTextNode(child));
        }
    }

    return node;
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
 * This function is used to apply the fall animation to a piece in the board.
 * It sets the animation delay based on the row index and the adjusted delay.
 * Delay is calculated based on the row index and the adjusted delay. -> pieces at the bottom fall first
 * 
 * @param pieces
 * @param colIndex
 * @param rowIndex
 * @param adjustedDelay
 */
function applyFallAnimation(pieces, colIndex, rowIndex, adjustedDelay) {
    const piece = pieces[rowIndex]?.[colIndex];
    if (piece) {
        const rowDelay = (5 - rowIndex) * 50;
        const totalDelay = adjustedDelay + rowDelay;

        piece.style.animationDelay = `${totalDelay}ms`;
        piece.classList.add('piece-fall-out');
    }
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
        updateActivePlayer();

        boardElement.classList.remove('disable-clicks');
        document.body.style.overflow = '';
    }, animationDuration);
}

/**
 * This function is used to update the scoreboard based on the current player index.
 * It basically swaps the active class between the player elements.
 */
function updateActivePlayer() {
    const player1Name = document.querySelector('#player1 .player-name');
    const player2Name = document.querySelector('#player2 .player-name');

    // Reset styles for both players
    player1Name.classList.remove('active');
    player2Name.classList.remove('active');
    player1Name.style.backgroundColor = '';
    player2Name.style.backgroundColor = '';
    player1Name.style.color = '';
    player2Name.style.color = '';

    // Set the active player
    if (state.currentPlayerIndex === 0) {
        player1Name.classList.add('active');
        player1Name.style.backgroundColor = 'var(--color-player-one-light)';
        player1Name.style.color = 'black';
    } else {
        player2Name.classList.add('active');
        player2Name.style.backgroundColor = 'var(--color-player-two-light)';
        player2Name.style.color = 'black';
    }
}


// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard();
    updateActivePlayer();
    
    const newGameButton = document.getElementById("newGame");
    newGameButton.addEventListener('click', () => handleNewGameClick());
});

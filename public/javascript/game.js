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
        state.currentPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
        showBoard();
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


// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard();
});

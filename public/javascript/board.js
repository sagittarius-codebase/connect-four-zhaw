import { elt } from './utils.js';

// The game state
const state = {
    board: Array(6).fill(null).map(() => Array(7).fill('')),
    players: [{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }],
    currentPlayerIndex: 1
};


/**
 * This function is used to show the current state of the board.
 * It calls the elt function to create new elements and append them to the board element.
 * It loops through the board state and creates div elements for each cell in the board.
 *
 * If the cell contains a piece, it creates a div element for the piece and appends it to the cell div.
 *
 */
function showBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear existing board

    // Loop through the board state to create cells
    state.board.forEach((row) => {
        let rowDiv = elt("div", {class: "row"});

        row.forEach((cell) => {
            let cellDiv = elt("div", {class: "field"});

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

export { state, showBoard, updateCell };


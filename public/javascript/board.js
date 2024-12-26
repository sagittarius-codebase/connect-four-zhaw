import { elt } from "./utils.js";
import { render, useSJDON} from "./lib/suiweb_1-1.js";
// Field component - represents a single field on the board
const Field = ({ id }) => {
    return [
        "div",
        { className: "field" },
        ...(id ? [["div", { className: `piece player${id}` }]] : [])
    ];
};

// Board component - contains the board and the fields
const Board = ({ board }) => {
    return [
        "div",
        { className: "board", id: "board" },
        ...board.map(row => [
            "div",
            { className: "row" },
            ...row.map(cell => [Field, { id: cell?.id }])
        ])
    ];
};

// App component
const App = ( { state }) => [Board, { board: state.board }];


useSJDON(Field, Board, App);


/**
 * renders the board to the app element
 * first clears the app element and then renders the board
 */
function showBoard(state) {
    const app = document.querySelector(".app")
    app.innerHTML = ""
    render([App, { state }], app)
}

/**
 * only updates given cell instead of updating the whole board -> performance improvement
 *
 * @param state - the current game state
 * @param rowIndex - the row index of the cell to be updated
 * @param colIndex - the column index of the cell to be updated
 */
function updateCell(state, rowIndex, colIndex) {
    const boardElement = document.getElementById("board");
    const rowElement = boardElement.children[rowIndex];
    const cellElement = rowElement.children[colIndex];

    const cell = state.board[rowIndex][colIndex];
    if (cell) {
        const pieceDiv = elt("div", {class: `piece player${cell.id} piece-fall` });
        cellElement.appendChild(pieceDiv);
    }

    return cellElement;
}

export { showBoard, updateCell };


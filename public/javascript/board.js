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


const appWrapper = document.querySelector(".app-disabled-wrapper");
const app = document.getElementById("app");

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

/**
 * Disables the board by adding a class to the app element and the app wrapper
 */
function disableBoard() {
    appWrapper.classList.add("cursor-disabled");
    app.classList.add("disable-clicks");
}

/**
 * Enables the board by removing a class from the app element and the app wrapper
 */
function enableBoard() {
    appWrapper.classList.remove("cursor-disabled");
    app.classList.remove("disable-clicks");
}

/**
 * Disables the load state button by adding a class and setting the disabled attribute
 */
function disableLoadState() {
    document.getElementById("loadState").setAttribute("disabled", "true");
    document.getElementById("loadState").classList.remove("loadState");
}

/**
 * Enables the load state button by removing a class and removing the disabled attribute
 */
function enableLoadState() {
    document.getElementById("loadState").removeAttribute("disabled");
    document.getElementById("loadState").classList.add("loadState");
}

/**
 * Disables the step back button by adding a class and setting the disabled attribute
 */
function disableStepBack() {
    document.getElementById("stepBack").setAttribute("disabled", "true");
    document.getElementById("stepBack").classList.remove("stepBack");
}

/**
 * Enables the step back button by removing a class and removing the disabled attribute
 */
function enableStepBack() {
    document.getElementById("stepBack").removeAttribute("disabled");
    document.getElementById("stepBack").classList.add("stepBack");
}

export { showBoard, updateCell, disableBoard, enableBoard , disableLoadState, enableLoadState, disableStepBack, enableStepBack};



// The game state
let state = {
    board: Array(6).fill(null).map(() => Array(7).fill(''))
};


/**
 * This function is used to show the current state of the board.
 * It calls the elt function to create new elements and append them to the board element.
 */
function showBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear existing board

    // Loop through the board state to create cells
    state.board.forEach((row) => {
        let rowDiv = elt("div", {class: "row"});

        row.forEach((cell) => {
            let cellDiv = elt("div", {class: "field"});
            cellDiv.textContent = cell;
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

// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard();
});
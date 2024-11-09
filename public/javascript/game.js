/**
 * This function is used to show the current state of the board.
 * It calls the elt function to create new elements and append them to the board element.
 */
function showBoard() {
    const boardElement = document.getElementById("board");
    const rows = 6;
    const cols = 7;

    // Create the board
    for (let row = 0; row < rows; row++) {
        let rowDiv = elt("div", {class: "row"});

        for (let col = 0; col < cols; col++) {
            let cell = elt("div", {class: "field"});
            rowDiv.appendChild(cell);
        }

        boardElement.appendChild(rowDiv);
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

// Function to initialize the board on page load
document.addEventListener('DOMContentLoaded', () => {
    showBoard();
});
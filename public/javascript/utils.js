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
 * This function is used to check if a player has won the game.
 * It checks all possible directions for 4 pieces in a row.
 * If it finds 4 pieces in a row, it returns true, otherwise false.
 *
 * @param player - the player to check for
 * @param state - the current game state
 * @returns {boolean} - true if the player has won, false otherwise
 */
function checkIfWinner(player, state) {
    const board = state.board;
    const rows = board.length;
    const cols = board[0].length;

    // Helper to check 4 pieces in a direction
    function checkDirection(row, col, rowDir, colDir) {
        let count = 0;

        for (let i = 0; i < 4; i++) {
            const r = row + i * rowDir;
            const c = col + i * colDir;

            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }

        return count === 4;
    }

    // Check all cells for potential winning directions
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (
                checkDirection(row, col, 0, 1) || // Horizontal
                checkDirection(row, col, 1, 0) || // Vertical
                checkDirection(row, col, 1, 1) || // Diagonal down-right
                checkDirection(row, col, 1, -1)   // Diagonal down-left
            ) {
                return true;
            }
        }
    }

    return false;
}

export { elt, checkIfWinner };
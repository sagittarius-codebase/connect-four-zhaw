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
export function applyFallAnimation(pieces, colIndex, rowIndex, adjustedDelay) {
    const piece = pieces[rowIndex]?.[colIndex];
    if (piece) {
        const rowDelay = (5 - rowIndex) * 50;
        const totalDelay = adjustedDelay + rowDelay;

        piece.style.animationDelay = `${totalDelay}ms`;
        piece.classList.add('piece-fall-out');
    }
}

const API_URL = "http://localhost:3000/api/data/connect4State?api-key=c4game";

/**
 * Load the state from the server
 *
 * @returns {Promise<any>} - a promise that resolves with the state loaded from the server
 */
function loadStateFromServer() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        });
}

/**
 * Save the given state to the server
 *
 * @param state - the state to save
 * @returns {Promise<void>} - a promise that resolves when the state is saved
 */
function saveStateToServer(state) {
    return fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("State saved successfully!");
        })
        .catch(err => {
            console.error("Failed to save state to server:", err);
            throw err;
        });
}

export { loadStateFromServer, saveStateToServer };
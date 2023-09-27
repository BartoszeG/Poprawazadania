// Parametry gry (konfigurowalne)
const boardSize = 10;
const mineCount = 10;

// Definicja planszy
let board = [];

// Elementy planszy
const boardElement = document.getElementById("board");
const resetButton = document.getElementById("reset-button");

// Funkcja inicjalizująca planszę
function initBoard() {
    board = [];
    boardElement.innerHTML = "";

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push({ isMine: false, isRevealed: false, count: 0 });
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            boardElement.appendChild(cell);
        }
        board.push(row);
    }
}

// Funkcja losująca miejsca na miny
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

// Funkcja sprawdzająca, czy dane pole znajduje się na planszy
function isValid(row, col) {
    return row >= 0 && col >= 0 && row < boardSize && col < boardSize;
}

// Funkcja zliczająca miny w sąsiedztwie
function countNeighboringMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (isValid(newRow, newCol) && board[newRow][newCol].isMine) {
                count++;
            }
        }
    }
    return count;
}

// Funkcja odkrywająca pola (rekurencyjnie)
function reveal(row, col) {
    if (!isValid(row, col) || board[row][col].isRevealed) return;

    board[row][col].isRevealed = true;

    if (board[row][col].isMine) {
        // Kliknięcie na minę
        gameOver();
        return;
    }

    const mineCount = countNeighboringMines(row, col);

    if (mineCount > 0) {
        // Odkrywanie pola z liczbą min w sąsiedztwie
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(`count-${mineCount}`);
        cell.textContent = mineCount;
    } else {
        // Odkrywanie pustych pól w sąsiedztwie
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                reveal(row + dr, col + dc);
            }
        }
    }
}

// Funkcja kończąca grę po przegranej
function gameOver() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (board[row][col].isMine) {
                cell.classList.add("mine");
            }
            cell.removeEventListener("click", cellClickHandler);
        }
    }
    resetButton.textContent = "Przegrałeś! Nowa gra";
}

// Obsługa kliknięcia na komórkę
function cellClickHandler(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    reveal(row, col);
}

// Obsługa kliknięcia na przycisk reset
function resetButtonClickHandler() {
    initBoard();
    placeMines();
    resetButton.textContent = "Nowa gra";
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.addEventListener("click", cellClickHandler);
        }
    }
}

// Inicjalizacja planszy po załadowaniu strony
window.addEventListener("DOMContentLoaded", () => {
    initBoard();
    placeMines();
    resetButton.addEventListener("click", resetButtonClickHandler);
});

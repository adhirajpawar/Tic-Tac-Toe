const socket = io();
const board = document.getElementById("board");
const statusDisplay = document.getElementById("statusDisplay");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let symbol;
let myTurn = false;

// Render board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.index = i;
  board.appendChild(cell);
}

board.addEventListener("click", e => {
  if (!myTurn) return;
  const index = e.target.dataset.index;
  if (e.target.textContent === "") {
    socket.emit("makeMove", index, symbol);
  }
});

socket.on("symbol", s => {
  symbol = s;
  statusDisplay.textContent = `You are '${symbol}'. Waiting for opponent...`;
});

socket.on("waiting", () => {
  statusDisplay.textContent = "Waiting for another player...";
});

socket.on("startGame", firstTurn => {
  myTurn = symbol === firstTurn;
  updateStatus(firstTurn);
  clearBoard();
});

socket.on("moveMade", ({ board: gameState, currentTurn }) => {
  const cells = document.querySelectorAll(".cell");
  gameState.forEach((val, i) => {
    cells[i].textContent = val || "";
  });
  myTurn = symbol === currentTurn;
  updateStatus(currentTurn);
});

socket.on("gameOver", ({ result, winner }) => {
  let msg = "", theme = "";

  if (result === "draw") {
    msg = "It's a Draw!";
    theme = "draw";
  } else if (symbol === winner) {
    msg = "You Win! 🎉";
    theme = "win";
  } else {
    msg = "You Lose 😞";
    theme = "lose";
  }

  showModal(msg, theme);
});

socket.on("scoreUpdate", scores => {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
});

socket.on("reset", () => {
  clearBoard();
  myTurn = false;
  statusDisplay.textContent = "Opponent left. Waiting for a new player...";
});

socket.on("full", () => {
  statusDisplay.textContent = "Game is full. Try again later.";
});

function updateStatus(currentTurn) {
  statusDisplay.textContent = myTurn
    ? `Your turn (${symbol})`
    : `Opponent's turn (${currentTurn})`;
}

function clearBoard() {
  document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
}

function showModal(msg, theme) {
  const modal = document.getElementById("gameModal");
  const message = document.getElementById("modalMessage");
  message.textContent = msg;
  modal.className = theme;
  modal.style.display = "flex";
  setTimeout(() => modal.style.display = "none", 4000);
}

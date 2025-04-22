const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("public"));  // Serves the public folder

let players = {}; // { X: socket.id, O: socket.id }
let gameBoard = Array(9).fill(null);
let currentTurn = null;
let scores = { X: 0, O: 0 };

function resetGame() {
  gameBoard = Array(9).fill(null);
  currentTurn = Math.random() > 0.5 ? "X" : "O";
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes(null)) return "draw";
  return null;
}

io.on("connection", (socket) => {
  let assigned = null;
  if (!players.X) {
    players.X = socket.id;
    assigned = "X";
  } else if (!players.O) {
    players.O = socket.id;
    assigned = "O";
  }

  if (!assigned) {
    socket.emit("full");
    return;
  }

  socket.emit("symbol", assigned);
  socket.emit("scoreUpdate", scores);

  if (players.X && players.O) {
    resetGame();
    io.emit("startGame", currentTurn);
  } else {
    socket.emit("waiting");
  }

  socket.on("makeMove", (index, symbol) => {
    if (gameBoard[index] === null && symbol === currentTurn) {
      gameBoard[index] = symbol;
      const winner = checkWinner(gameBoard);

      if (winner) {
        io.emit("moveMade", { board: gameBoard, currentTurn: null });

        if (winner === "draw") {
          io.emit("gameOver", { result: "draw" });
        } else {
          scores[winner]++;
          io.emit("gameOver", { result: "win", winner });
          io.emit("scoreUpdate", scores);
        }

        setTimeout(() => {
          resetGame();
          io.emit("startGame", currentTurn);
        }, 4000);
      } else {
        currentTurn = symbol === "X" ? "O" : "X";
        io.emit("moveMade", { board: gameBoard, currentTurn });
      }
    }
  });

  socket.on("disconnect", () => {
    if (players.X === socket.id) players.X = null;
    if (players.O === socket.id) players.O = null;
    gameBoard = Array(9).fill(null);
    currentTurn = null;
    scores = { X: 0, O: 0 };
    io.emit("reset");
  });
});

const os = require("os");
const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i.family === "IPv4" && !i.internal).address;

server.listen(3000, () => {
  console.log(`Server running on http://${ip}:3000`);
});

    
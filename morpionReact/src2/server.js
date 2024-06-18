const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let gameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

app.get('/api/game', (req, res) => {
  res.json(gameState);
});

app.put('/api/game', (req, res) => {
  const { currentMove, squares } = req.body;
  const newHistory = [...gameState.history.slice(0, currentMove + 1), squares];
  const winner = calculateWinner(squares);
  gameState = {
    history: newHistory,
    currentMove: newHistory.length - 1,
    winner: winner,
  };
  res.json(gameState);
});

app.post('/api/game/jump', (req, res) => {
  const { move } = req.body;
  const newMove = Math.min(Math.max(move, 0), gameState.history.length - 1);
  gameState.currentMove = newMove;
  res.json(gameState);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


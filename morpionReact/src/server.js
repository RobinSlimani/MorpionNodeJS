const express = require('express');
const cors = require('cors');
const redis = require('redis');
const app = express();

app.use(cors());
app.use(express.json());

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

let gameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
  winner: null,
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

app.put('/api/game', async (req, res) => {
  const { currentMove, squares } = req.body;
  const newHistory = [...gameState.history.slice(0, currentMove + 1), squares];
  const winner = calculateWinner(squares);
  gameState = {
    history: newHistory,
    currentMove: newHistory.length - 1,
    winner: winner,
  };

  if (winner) {
    try {
      await redisClient.incr('gamesPlayed');
    } catch (err) {
      console.error('Redis incr error:', err);
    }
  }

  res.json(gameState);
});

app.post('/api/game/jump', (req, res) => {
  const { move } = req.body;
  const newMove = Math.min(Math.max(move, 0), gameState.history.length - 1);
  gameState.currentMove = newMove;
  res.json(gameState);
});

app.post('/api/game/reset', (req, res) => {
  gameState = {
    history: [Array(9).fill(null)],
    currentMove: 0,
    winner: null,
  };
  res.json(gameState);
});

app.get('/api/games', async (req, res) => {
  try {
    const reply = await redisClient.get('gamesPlayed');
    res.json({ gamesPlayed: reply || 0 });
  } catch (err) {
    console.error('Redis get error:', err);
    res.status(500).json({ error: 'Could not retrieve games played' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


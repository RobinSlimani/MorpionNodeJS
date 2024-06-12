import { useState, useEffect } from 'react';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

let history = [Array(9).fill(null)];
let currentMove = 0;

app.get('/game-state', (req, res) => {
  res.json({ history, currentMove });
});

app.post('/play', (req, res) => {
  const { nextSquares } = req.body;
  if (!nextSquares || nextSquares.length !== 9) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (calculateWinner(nextSquares)) {
    return res.status(400).json({ error: 'Game already won' });
  }

  history = [...history.slice(0, currentMove + 1), nextSquares];
  currentMove = history.length - 1;

  res.json({ history, currentMove });
});

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    fetchGameState();
  }, []);

  async function fetchGameState() {
    try {
      const response = await fetch('http://localhost:3001/game-state');
      if (!response.ok) {
        throw new Error('Failed to fetch game state');
      }
      const data = await response.json();
      setHistory(data.history);
      setCurrentMove(data.currentMove);
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePlay(nextSquares) {
    try {
      const response = await fetch('http://localhost:3001/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nextSquares }),
      });
      if (!response.ok) {
        throw new Error('Failed to play move');
      }
      const data = await response.json();
      setHistory(data.history);
      setCurrentMove(data.currentMove);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
    </div>
  );
}


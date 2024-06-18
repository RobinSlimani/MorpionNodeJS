import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares.winner || squares.history[squares.currentMove][i]) {
      return;
    }
    onPlay(i);
  }

  const winner = squares.winner;
  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {squares.history[squares.currentMove].slice(0, 3).map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
      <div className="board-row">
        {squares.history[squares.currentMove].slice(3, 6).map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index + 3)} />
        ))}
      </div>
      <div className="board-row">
        {squares.history[squares.currentMove].slice(6, 9).map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index + 6)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [gameState, setGameState] = useState({
    history: [Array(9).fill(null)],
    currentMove: 0,
    winner: null,
  });
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setGameState(data))
      .catch(error => console.error('Error fetching game state:', error));

    fetch('/api/games')
      .then(response => response.json())
      .then(data => setGamesPlayed(data.gamesPlayed))
      .catch(error => console.error('Error fetching games played:', error));
  }, []);

  useEffect(() => {
    if (gameState.winner) {
      fetch('/api/games')
        .then(response => response.json())
        .then(data => setGamesPlayed(data.gamesPlayed))
        .catch(error => console.error('Error fetching games played:', error));
    }
  }, [gameState.winner]);

  function handlePlay(squareIndex) {
    const currentSquares = gameState.history[gameState.currentMove];
    if (currentSquares[squareIndex] || gameState.winner) {
      return;
    }

    const newSquares = currentSquares.slice();
    newSquares[squareIndex] = gameState.currentMove % 2 === 0 ? 'X' : 'O';

    fetch('/api/game', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentMove: gameState.currentMove, squares: newSquares }),
    })
      .then(response => response.json())
      .then(data => setGameState(data))
      .catch(error => console.error('Error updating game state:', error));
  }

  function jumpTo(move) {
    fetch('/api/game/jump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ move }),
    })
      .then(response => response.json())
      .then(data => setGameState(data))
      .catch(error => console.error('Error jumping to move:', error));
  }

  function resetGame() {
    fetch('/api/game/reset', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => setGameState(data))
      .catch(error => console.error('Error resetting game state:', error));
  }

  const moves = gameState.history.map((squares, move) => {
    const description = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const xIsNext = gameState.currentMove % 2 === 0;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={gameState} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>Games played: {gamesPlayed}</div>
        <ol>{moves}</ol>
        {gameState.winner && <button onClick={resetGame}>New Game</button>}
      </div>
    </div>
  );
}


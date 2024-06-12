const express = require('express');
const cors = require('cors'); // Importation du package cors
const app = express();

app.use(cors()); // Configuration de CORS pour autoriser toutes les origines

app.use(express.json());

let gameState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
};

app.get('/api/game', (req, res) => {
  res.json(gameState);
});

app.post('/api/game', (req, res) => {
  gameState = req.body;
  res.json({ message: 'jeu mis à jour' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


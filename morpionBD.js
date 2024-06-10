const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database');
const Game = require('./models/Game');

app.use(express.json());

sequelize.sync();

app.post('/api/games', async (req, res) => {
    const initialState = {
        1: null, 2: null, 3: null,
        4: null, 5: null, 6: null,
        7: null, 8: null, 9: null
    };
    
    const newGame = await Game.create({ state: initialState });

    res.status(201).json({ gameId: newGame.id });
});

app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;

    const game = await Game.findByPk(id);

    if (!game) {
        return res.status(404).json({ error: "id de partie non trouvée" });
    }

    let state = game.state;

    if (state[position] === 'on') {
        return res.status(400).json({ error: 'Position déjà prise' });
    }

    state = { ...state, [position]: 'on' };

    await game.update({ state });

    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    let winner = null;
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            winner = state[a];
            break;
        }
    }

    if (winner) {
        await game.update({ status: 'GAGNE' });
	console.log("GAGNE")
    }
    res.json({ gameId: game.id, state: game.state, status: game.status });
});

app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;

    const game = await Game.findByPk(id);

    if (!game) {
        return res.status(404).json({ error: "id de partie non trouvé" });
    }
    res.json({ gameId: game.id, state: game.state, status: game.status });
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});


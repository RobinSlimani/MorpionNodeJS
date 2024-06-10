const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database');
const Game = require('./models/Game');

<<<<<<< HEAD
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
=======
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

sequelize.sync();

app.get('/', async (req, res) => {
    res.render('index');
});

app.post('/new', async (req, res) => {
    const newGame = await Game.create({ state: {} });
    res.redirect(`/game/${newGame.id}`);
});

app.get('/game/:id', async (req, res) => {
    const game = await Game.findByPk(req.params.id);
    res.render('morpionBD', { gameId: game.id, checkboxStates: game.state, compteur: Object.keys(game.state).length });
});

app.post('/game/:id/submit', async (req, res) => {
    let compteur = 0;
    let coche = {};
    let checkboxStates = {};

    for (let i = 1; i <= 9; i++) {
        if (req.body[i] === 'on') {
            compteur += 1;
            coche[i] = true;
            checkboxStates[i] = 'on';
        }
    }

    const game = await Game.findByPk(req.params.id);
    await game.update({ state: checkboxStates });
>>>>>>> 18acdae7ec14b78f1769a50b5ca90725127d19a6

    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

<<<<<<< HEAD
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
=======
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (coche[a] && coche[b] && coche[c]) {
            return res.redirect(`/winBD/${game.id}`);
        }
    }

    res.render('morpionBD', { gameId: game.id, checkboxStates, compteur });
});

app.get('/winBD/:id', async (req, res) => {
    res.render('winBD', { gameId: req.params.id });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
>>>>>>> 18acdae7ec14b78f1769a50b5ca90725127d19a6
});


const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database');
const Game = require('./models/Game');

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

    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

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
});


const express = require('express');
const app = express();
const port = 3000;

let checkboxStates = {};

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    let compteur = 0;
    let coche = {};
    checkboxStates = {}; 
    
    for (let i = 1; i <= 9; i++) {
        if (req.body[i] === 'on') {
            compteur += 1;
            coche[i] = true;
            checkboxStates[i] = 'on';
        }
    }
    console.log(compteur);
    console.log(coche);

    if (compteur >= 3) {
        const winningCombinations = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (coche[a] && coche[b] && coche[c]) {
                return res.redirect('/win');
            }
        }
    }

    res.render('morpion', { checkboxStates, compteur });
});

app.get('/win', (req, res) => {
    res.render('win');
});

app.get('/', (req, res) => {
    res.render('morpion', { checkboxStates, compteur:0 });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

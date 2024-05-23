const express = require('express');
const app = express();
const port = 3000;

let checkboxStates = {};
let compteur = 0;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    for (let i = 1; i <= 9; i++) {
        if (req.body[i] === 'on'){
            compteur +=1;
            console.log(compteur);
        }
    }
});

app.get('/', (req, res) => {
    res.render('morpion', { checkboxStates });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

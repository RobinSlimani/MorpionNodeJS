const express = require('express');
const app = express();
const port = 3000;

let checkboxStates = {};


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    let compteur = 0;
    let coche = {};
    for (let i = 1; i <= 9; i++) {
        if (req.body[i] === 'on'){
            compteur +=1;
            coche[i] = true;
            console.log(compteur);
            console.log(coche);
        }
    }

    if (compteur === 3){
        if (coche[1] && coche[2] && coche[3]) {
            console.log("GAGNE")
        }
        if (coche[4] && coche[5] && coche[6]) {
            console.log("GAGNE")
        }
        if (coche[7] && coche[8] && coche[9]) {
            console.log("GAGNE")
        }
        if (coche[1] && coche[4] && coche[7]) {
            console.log("GAGNE")
        }
        if (coche[2] && coche[5] && coche[8]) {
            console.log("GAGNE")
        }
        if (coche[3] && coche[6] && coche[9]) {
            console.log("GAGNE")
        }
        if (coche[1] && coche[5] && coche[9]) {
            console.log("GAGNE")
        }
        if (coche[3] && coche[5] && coche[7]) {
            console.log("GAGNE")
        }
    }
    
});

app.get('/', (req, res) => {
    res.render('morpion', { checkboxStates });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

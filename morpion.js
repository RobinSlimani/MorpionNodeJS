const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('morpion');
    console.log(query);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
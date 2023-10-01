const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send({
        tshirt: '👕',
        size: 'large',
    })
})

app.listen(PORT ,() => {
    console.log("Running!");
})
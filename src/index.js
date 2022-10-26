require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({slackUsername: 'MrCholo', backend: true, age: 26, Bio: "Passionate driven ambitious"})
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})
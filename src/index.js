require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({slackUsername: 'Mr Cholo', backend: true, age: 26, Bio: "I am a passionate, driven and ambitious software engineer. I enjoy reading, travelling and playing with my sons. Yeah I am also married with two lovely boys."})
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})
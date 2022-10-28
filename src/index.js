require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 4000;


app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/', (req, res) => {
   
    res.status(200).json({slackUsername:  'offorifeanayor', backend:  true, age:  26, bio:  "I am a passionate, driven and ambitious software engineer. I enjoy reading, travelling and playing with my sons."})
})

app.listen(PORT)
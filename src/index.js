require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { computeValue } = require('../utils/calculate')

const app = express();

const PORT = process.env.PORT || 4000;


app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).json({slackUsername:  'MrCholo', backend:  true, age:  26, bio:  "I am a passionate, driven and ambitious software engineer. I enjoy reading, travelling and playing with my sons."})
})

app.post('/', (req, res) => {
    const obj = req.body
     let arr = obj.operation_type.split(' ')
     if (arr.length === 1) {
        let value =computeValue(arr[0], obj?.x, obj?.y)
         return res.status(200).json(value);
     }
     arr.forEach(element => {
         console.log("12", element)
     });
    
    res.status(200).json({message: 'good'});
})



app.listen(PORT)
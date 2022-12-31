require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connect = require('./db/db');
const helmet = require('helmet');

const app = express();

const PORT = process.env.PORT || 3005;

const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const postsRouter = require('./routes/post.routes');

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);



connect();

app.get('/', (req, res) => {
   return res.status(200).json({message: "THE ODIN BOOK"})
})

//Error handler middleware
app.use((err, req, res, next) => {
    console.log(err)
    const errorStatus = err.status || 500;
    res.status(errorStatus).send("An error occured")
    next()
})

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
})
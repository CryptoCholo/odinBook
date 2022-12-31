const mongoose = require('mongoose');

function connect() {
    mongoose.connect("mongodb+srv://test-project:test-project@cluster0.4qna20m.mongodb.net/?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true")

    const db = mongoose.connection;

    db.on('connected', () => {
        console.log("connected to MongoDB Successfully");
    })
    db.on('error', (err) => {
        console.log('An error occurred while connecting to MongoDB');
        console.log(err);
    });
}

module.exports =  connect;
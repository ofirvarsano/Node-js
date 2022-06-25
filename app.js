const express = require('express');
//const PORT = 8080;

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//Import Routes
const messagesRoute = require('./routes/messages');

app.use('/messages', messagesRoute);


//app.use( express.json() )

app.get('/', (req, res) => {
    res.status(200).send('We are home');
});
/*
app.get('/posts', (req, res) => {
    res.status(200).send('We are on posts');
});

app.get('/messages', (req, res) => {
    res.status(200).json(mess);
});

app.post('/messages', (req, res) => {
    //var newMess = JSON.parse(req.body);
    var newMess = req.body.newMess;
    mess.push(newMess);
    res.status(201).json();
});
*/
app.listen(8080);

// connect to DB
mongoose.set('bufferCommands', false); 
mongoose.connect(process.env.DB_CONNECTION, { userNewUrlParser: true, userUnifiedTopology: true }, () => console.log('connected to DB'));
/*
app.listen(
    PORT,
    () => console.log('its alive on http//localhost:${PORT}')
)
*/
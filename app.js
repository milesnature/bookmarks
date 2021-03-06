
// Get dependencies
require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
// Sessions and authentication WIP
// const uuid       = require('uuid/v4');
// const session    = require('express-session');
// const FileStore  = require('session-file-store')(session);

const app        = express();
const http       = require('http').createServer(app);
const io         = require('socket.io')(http);

// Parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');    
    next();
});

// Add & configure middleware
// app.use(session({
//   genid: (req) => {
//     console.log('Inside the session middleware')
//     console.log(req.sessionID)
//     return uuid() // use UUIDs for session IDs
//   },
//   store: new FileStore(),
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }));

// Configuring the database
const mongoose = require('mongoose');
require('./bookmark.routes.js')(app);  //Add route file here

mongoose.Promise = global.Promise;

// Connecting to the database - mongoose.connect(uri, { useFindAndModify: false });
mongoose.connect(process.env.DB_CONNECTION, {
	useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Static access to public folder
app.use(express.static(__dirname + '/public'));

// Default route
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Sessions and authentication WIP
// app.get('/login', (req, res) => {
//     console.log('Inside the homepage callback function')
//     console.log(req.sessionID)
//     res.send(`You hit home page!\n`)
//     // res.sendFile(path.join(__dirname+'/public/login.html'));
// });

// Just for fun
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// Listen on port 3000
http.listen(process.env.SERVER_PORT, () => {
    console.log("Server is listening on port : " + process.env.SERVER_PORT);
});

// Using node file system and socket.io (instead of webpack or gulp) may be overkill just to auto-reload browsers.
// However, socket.io is more fun to play with and potentially more useful later on.
// var fs = require('fs');

// fs.watch('public', {recursive:true}, function(event, file){
//     let response = { 'file' : file, 'event' : event } 
//     console.log( response );
//     io.emit( 'change', file );
// });
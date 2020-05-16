
// get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Configuring the database
const config = require('./config.js');
const mongoose = require('mongoose');
require('./bookmark.routes.js')(app);  //Add route file here

mongoose.Promise = global.Promise;

// Connecting to the database - mongoose.connect(uri, { useFindAndModify: false });
mongoose.connect(config.url, {
	useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// static access to public folder
app.use(express.static(__dirname + '/public'));

// default route
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'index.html'));
});

// listen on port 3000
app.listen(config.serverport, () => {
    console.log("Server is listening on port 3000");
})
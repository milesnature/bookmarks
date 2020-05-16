# bookmarks
Online bookmarks tool. REST API, using node, express, mongoose, mongodb an vanilla js. 

Create a config.js file in the main directory. It contains the access to desired mongodb database.

module.exports = {
    url: '<mongodb-access-url>',
    serverport: 3000 
}

Installation requires node and npm.
$ npm install

Deploy
$ node server.js
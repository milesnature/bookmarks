# bookmarks

DESCRIPTION

Online bookmarks tool. REST API, using node, express, mongoose, mongodb an vanilla js. 


VERSION 0.0.1 

EARLY STAGE OF CONSTRUCTION. This is NOT READY for consumption, nor contribution. 
However, the basic API works, the app is deployable, database connection is working, and data can be retrieved.


INSTRUCTIONS

Create a config.js file in the main directory. It contains the access to desired mongodb database.

module.exports = {
    url: '<mongodb-access-url>',
    serverport: 3000 
}

Installation requires node and npm.
$ npm install

Deploy
$ node server.js
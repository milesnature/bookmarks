# bookmarks

### Description
Online bookmarks tool.
* NodeJS REST API (express, mongoose, mongodb). 

### Version 0.0.1 
__Early stage of construction__. This is __ready__ for consumption. However, it does require a nosql database (mongodb) and the deployment of a node server. 
* The basic API works
* The app is deployable
* Database connection is working
* Data can be retrieved, updated, and deleted.

### Instructions
1. Create a .env file in the main directory. This provides access to the mongodb database and sets deployment port. The url below points to a locally deployed instance, named MyDatabase. This should be updated with your db connection string.
```javascript
DB_CONNECTION=mongodb://localhost:27017/MyDatabase
SERVER_PORT=3000
```
2. Install node and npm
3. $ npm install
4. $ node server.js
5. http://localhost:3000

### Example
Please use caution when clicking links you haven't generated. Validation has not been completed for all security risks.
http://bookmarks-example.milesnature.com/

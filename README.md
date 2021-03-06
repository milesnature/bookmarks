# bookmarks

### Why do I need another bookmarks tool? 
Life is easier with a single independent source of bookmarks. 
Web developers maintain large sets of bookmarks which are more useful when un-tethered from extensions, 3rd party applications and operating systems.
Complete ownership and control of the data is also advantageous for privacy, anonymity and security.
It's faster to simply type in a website and load a dedicated "app". In fact, I keep it open permanently and pin the tab to the left. 

### Description
* NodeJS REST API (express, mongoose, mongodb). 

### Version 1.0.82 
__Early stage of construction__. This is __ready__ for consumption. However, it does require a nosql database (mongodb) and the deployment of a node server. 
* The basic API works
* The app is deploy-able
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
4. $ npm run production
5. $ node app.js
6. http://localhost:3000
7. Comment out the socket io script references in the index.html for production.

### Example
Please use caution when clicking links you haven't generated. Validation has not been completed for all security risks.

http://bookmarks-example.milesnature.com/

### TO DO
* Secure login with UUID, authentication ...
* Encrypt data for privacy
* Nested groups of bookmarks
* Inline editing
* Import bookmark files (ie. exported from a browser)
* Export bookmarks to file
* Multiple simultaneous edits
* Order and layout preferences
* Bookmark Sets
* Minify code source and other optimizations to load times 

### Implementation & Design
This website was designed and hand-coded from scratch. No 3rd libraries were used (Node JS and related NPM libs excepted). The latest versions of languages and syntax were chosen above older, more backwards compatible alternatives. All modern (updated) browsers are supported, including mobile.

The layout is designed to be the most useful for a web developer, someone who is constantly jumping from one browser to another. The organization is deliberately simple (no folders or collapsing groups), allowing the user to see everything all at once. I plan to add nested groups regardless because not everyone is going to agree. However, it is a low priority.

Database storage was added to accommodate users who might not have ftp access or have the knowledge to edit a webpage. It's also pretty handy for quick edits. The goal is to make saving a bookmark as simple as possible. Enhancements forthcoming.

### Need help?
I'm happy to help implement. I will likely offer this as a service in the future if there is interest. 
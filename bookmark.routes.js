module.exports = (app) => {
    const bookmark = require('./bookmark.controller.js');

    // Create a new Bookmark
    app.post('/bookmarks', bookmark.create);

    // Retrieve all Bookmarks
    app.get('/bookmarks', bookmark.findAll);

    // Retrieve all Bookmarks by group
    app.get('/bookmarks/group/:group', bookmark.findAllByGroup);

    // Retrieve a single Bookmark with bookmarkId
    app.get('/bookmarks/:bookmarkId', bookmark.findOne);

    // Update a Note with bookmarkId
    app.put('/bookmarks/:bookmarkId', bookmark.update);

    // Delete a Note with bookmarkId
    app.delete('/bookmarks/:bookmarkId', bookmark.delete);

    // Delete all bookmarks by their shared group name
    app.delete('/bookmarks/group/:group', bookmark.deleteGroup);
}
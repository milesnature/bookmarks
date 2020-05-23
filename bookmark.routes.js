module.exports = (app) => {

    const bookmark = require('./bookmark.controller.js');

    // Create a new Bookmark
    app.post('/bookmarks', bookmark.createBookmark);

    // Retrieve all Bookmarks
    app.get('/bookmarks', bookmark.getBookmarks);

    // Retrieve all Bookmarks by group
    app.get('/bookmarks/group/:group', bookmark.getBookmarksByGroup);

    // Retrieve a single Bookmark with bookmarkId
    app.get('/bookmarks/:bookmarkId', bookmark.getBookmark);

    // Update a Bookmark with bookmarkId
    app.put('/bookmarks/:bookmarkId', bookmark.updateBookmark);

    // Delete a Bookmark with bookmarkId
    app.delete('/bookmarks/:bookmarkId', bookmark.deleteBookmark);

    // Delete a Group and all bookmarks associated to it
    app.delete('/bookmarks/group/:group', bookmark.deleteGroup);
    
}
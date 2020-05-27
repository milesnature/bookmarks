const Bookmark = require('./bookmark.model.js');

//Create new Bookmark
exports.createBookmark = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "Bookmark content can not be empty."
        });
    }

    // Create a Bookmark
    const bookmark = new Bookmark({
        name   : req.body.name   || "", 
        url    : req.body.url    || "",
        group  : req.body.group  || "",
        parent : req.body.parent || ""
    });

    // Save Bookmark in the database
    bookmark.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the bookmark."
        });
    });
};

/*
// Model.collection.insert(docs, options, callback)
exports.createBookmarkSet = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "Bookmark set content can not be empty."
        });
    }

    // Create a Collection
    var bookmarkSet = [],
    createBookmarkSet = function( item, index ) {

        const bookmark = new Bookmark({
            name   : item.name   || "", 
            url    : item.url    || "",
            group  : item.group  || "",
            parent : item.parent || ""
        });

        bookmarkSet.push( bookmark );
    }

    req.body.forEach( createBookmarkSet );

    // Save Collection in the database
    bookmarkSet.insert()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the collection."
        });
    });
};
*/


// Retrieve all bookmarks from the database.
// TODO: Sorting on mixed lower and upper case doesn't work as expected. Known issue with mongodb.
exports.getBookmarks = (req, res) => {
    Bookmark.find()
    .sort({group: 'asc', name: 'asc'})
    .then(bookmarks => {
        res.send(bookmarks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Could not retrieve bookmarks"
        });
    });
};

// Retrieve all bookmarks by group.
exports.getBookmarksByGroup = (req, res) => {
    console.log('req', req);
    Bookmark.find({group: req.params.group})
    .sort({name: -1})
    .then(bookmarks => {
        res.send(bookmarks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "No bookmarks found for group named [" + req.params.group + "]"
        });
    });
};

// Find a single bookmark with a bookmarkId
exports.getBookmark = (req, res) => {
    Bookmark.findById(req.params.bookmarkId)
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });            
        }
        res.send(bookmark);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });                
        }
        return res.status(500).send({
            message: "Could not get bookmark with id [" + req.params.bookmarkId + "]"
        });
    });
};

// Update a bookmark
exports.updateBookmark = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Bookmark content can not be empty"
        });
    }

    // Find and update bookmark with the request body
    Bookmark.findByIdAndUpdate(req.params.bookmarkId, {
        name   : req.body.name   || "", 
        url    : req.body.url    || "",
        group  : req.body.group  || "",
        parent : req.body.parent || ""
    }, { new: true })
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });
        }
        res.send(bookmark);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });                
        }
        return res.status(500).send({
            message: "Could not update bookmark with id [" + req.params.bookmarkId + "]"
        });
    });
};

// Delete a bookmark with the specified bookmarkId in the request
exports.deleteBookmark = (req, res) => {
    Bookmark.findByIdAndRemove(req.params.bookmarkId)
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });
        }
        res.send({message: "Bookmark deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Bookmark with the id [" + req.params.bookmarkId + "] was not found"
            });                
        }
        return res.status(500).send({
            message: "Could not delete bookmark with id [" + req.params.bookmarkId + "]"
        });
    });
};

// Delete all bookmarks that share the same group name.
exports.deleteGroup = (req, res) => {
    Bookmark.deleteMany({ group: req.params.group })
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "No group named [" + req.params.group + "] was found"
            });
        }
        res.send({message: "Group deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "No group named [" + req.params.group + "] was found"
            });                
        }
        return res.status(500).send({
            message: "Could not delete the group named [" + req.params.group + "]"
        });
    });
};

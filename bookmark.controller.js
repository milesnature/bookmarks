const Bookmark = require('./bookmark.model.js');
/* const BookmarkSet = require('./bookmark-set.model.js'); */
const Group = require('./group.model.js');

//Create new Bookmark
exports.create = (req, res) => {
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
exports.findAll = (req, res) => {
    Bookmark.find()
    .then(bookmarks => {
        res.send(bookmarks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving bookmarks."
        });
    });
};

// Retrieve all bookmarks by group.
exports.findAllByGroup = (req, res) => {
    console.log('req', req);
    Bookmark.find({group: req.params.group})
    .then(bookmarks => {
        res.send(bookmarks);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "No bookmarks found for group named " + req.params.group
        });
    });
};

// Find a single bookmark with a bookmarkId
exports.findOne = (req, res) => {
    Bookmark.findById(req.params.bookmarkId)
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "Bookmark not found with id " + req.params.bookmarkId
            });            
        }
        res.send(bookmark);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Bookmark not found with id " + req.params.bookmarkId
            });                
        }
        return res.status(500).send({
            message: "Something wrong retrieving bookmark with id " + req.params.bookmarkId
        });
    });
};

// Update a bookmark
exports.update = (req, res) => {
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
                message: "Bookmark not found with id " + req.params.bookmarkId
            });
        }
        res.send(bookmark);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Bookmark not found with id " + req.params.bookmarkId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating bookmark with id " + req.params.bookmarkId
        });
    });
};

// Delete a bookmark with the specified bookmarkId in the request
exports.delete = (req, res) => {
    Bookmark.findByIdAndRemove(req.params.bookmarkId)
    .then(bookmark => {
        if(!bookmark) {
            return res.status(404).send({
                message: "Bookmark not found with id " + req.params.bookmarkId
            });
        }
        res.send({message: "Bookmark deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Bookmark not found with id " + req.params.bookmarkId
            });                
        }
        return res.status(500).send({
            message: "Could not delete bookmark with id " + req.params.bookmarkId
        });
    });
};
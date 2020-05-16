const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
    name   : String,
    url    : String,
    group  : String
}, {
    timestamps: true
});

module.exports = mongoose.model('Bookmarks', BookmarkSchema);
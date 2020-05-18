const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
    name : {
    	type: String,
    	required: true,
    	unique: true
    },
    url : {
    	type: String,
    	required: true,
    	unique: true
    },
    group : {
    	type: String,
    	required: true,
    	unique: true
    },
    target : {
    	type: String,
    	required: false,
    	unique: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bookmarks', BookmarkSchema);
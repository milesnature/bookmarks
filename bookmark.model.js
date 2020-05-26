const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
    name : {
    	type: String,
    	required: true,
    	unique: true,
        minlength: 1,
        maxlength: 100
    },
    url : {
    	type: String,
    	required: true,
    	unique: true,
        minlength: 1,   
        maxlength: 2083
    },
    group : {
    	type: String,
    	required: true,
    	unique: true,
        minlength: 1,
        maxlength: 100
    },
    parent : {
    	type: String,
    	required: false,
    	unique: false,
        minlength: 1,
        maxlength: 100
    },
    target : {
    	type: String,
    	required: false,
        minlength: 1,
        maxlength: 20
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bookmarks', BookmarkSchema);
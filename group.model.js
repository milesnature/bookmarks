const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    group  : String,
    parent : String
}, {
    timestamps: true
});

module.exports = mongoose.model('Groups', GroupSchema);
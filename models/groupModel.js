//mongoose library import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Group model creation
const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
});
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
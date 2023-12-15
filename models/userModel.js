// mongoose library import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema Creation
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    password: { 
        type: String,
        required: true 
    },
    id_group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
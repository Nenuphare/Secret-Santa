// mongoose library import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Membership model creation
const membershipSchema = new Schema({
    id_group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invite: {
        type: Boolean
    }
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;

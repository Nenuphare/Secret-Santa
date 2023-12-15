// mongoose library import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Group model creation
const assignmentSchema = new Schema({
    id_giver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

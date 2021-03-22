const mongoose = require('mongoose');

const { Schema } = mongoose;
const newSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Level', newSchema);
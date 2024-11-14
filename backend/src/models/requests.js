const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
}, { timestamps: true });

const requestModel = mongoose.model('UserRequests', requestSchema);

module.exports = requestModel;